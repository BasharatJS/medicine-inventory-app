import { create } from 'zustand';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { SalesReport, InventoryReport, ProfitReport, TopSellingItem, CategorySales, PaymentMethodSales } from '@/lib/types';

interface ReportState {
  salesReport: SalesReport | null;
  inventoryReport: InventoryReport | null;
  profitReport: ProfitReport | null;
  isLoading: boolean;
  error: string | null;
  generateSalesReport: (startDate: Date, endDate: Date) => Promise<void>;
  generateInventoryReport: () => Promise<void>;
  generateProfitReport: (startDate: Date, endDate: Date) => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
  salesReport: null,
  inventoryReport: null,
  profitReport: null,
  isLoading: false,
  error: null,

  // Generate sales report for date range with top selling medicines and payment methods
  generateSalesReport: async (startDate: Date, endDate: Date) => {
    try {
      set({ isLoading: true, error: null });

      const q = query(
        collection(db, COLLECTIONS.SALES),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate)),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const sales = snapshot.docs.map(doc => doc.data());

      // Calculate totals
      const totalTransactions = sales.length;
      const totalRevenue = sales.reduce((sum, sale) => sum + sale.grandTotal, 0);
      const totalProfit = sales.reduce((sum, sale) => {
        // Calculate profit from items
        const itemsProfit = sale.items.reduce((itemSum: number, item: any) => {
          const cost = item.purchasePrice ? item.purchasePrice * item.quantity : 0;
          const revenue = item.total;
          return itemSum + (revenue - cost);
        }, 0);
        return sum + itemsProfit;
      }, 0);

      const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

      // Top selling medicines
      const medicineStats: { [key: string]: { name: string; quantity: number; revenue: number } } = {};

      sales.forEach(sale => {
        sale.items.forEach((item: any) => {
          if (!medicineStats[item.medicineName]) {
            medicineStats[item.medicineName] = {
              name: item.medicineName,
              quantity: 0,
              revenue: 0,
            };
          }
          medicineStats[item.medicineName].quantity += item.quantity;
          medicineStats[item.medicineName].revenue += item.total;
        });
      });

      const topSellingMedicines: TopSellingItem[] = Object.entries(medicineStats)
        .map(([name, data]) => ({
          medicineId: '',
          medicineName: data.name,
          quantitySold: data.quantity,
          revenue: data.revenue,
        }))
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, 10);

      // Sales by payment method
      const paymentMethodStats: { [key: string]: { count: number; amount: number } } = {};

      sales.forEach(sale => {
        if (!paymentMethodStats[sale.paymentMethod]) {
          paymentMethodStats[sale.paymentMethod] = { count: 0, amount: 0 };
        }
        paymentMethodStats[sale.paymentMethod].count += 1;
        paymentMethodStats[sale.paymentMethod].amount += sale.grandTotal;
      });

      const salesByPaymentMethod: PaymentMethodSales[] = Object.entries(paymentMethodStats).map(
        ([method, data]) => ({
          method,
          count: data.count,
          amount: data.amount,
          percentage: (data.amount / totalRevenue) * 100,
        })
      );

      // Sales by category (simplified - would need medicine data)
      const salesByCategory: CategorySales[] = [];

      const report: SalesReport = {
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        totalSales: totalTransactions,
        totalRevenue,
        totalProfit,
        totalTransactions,
        averageOrderValue,
        topSellingMedicines,
        salesByCategory,
        salesByPaymentMethod,
      };

      set({ salesReport: report, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Generate inventory report with stock value, expiry alerts, and category breakdown
  generateInventoryReport: async () => {
    try {
      set({ isLoading: true, error: null });

      const medicinesSnapshot = await getDocs(
        query(collection(db, COLLECTIONS.MEDICINES), where('isActive', '==', true))
      );

      const batchesSnapshot = await getDocs(collection(db, COLLECTIONS.BATCHES));

      const medicines = medicinesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const batches = batchesSnapshot.docs.map(doc => doc.data());

      const totalMedicines = medicines.length;
      let totalStockValue = 0;
      let lowStockItems = 0;
      let outOfStockItems = 0;

      medicines.forEach((medicine: any) => {
        const stock = medicine.totalStock || 0;

        if (stock === 0) {
          outOfStockItems++;
        } else if (stock <= medicine.minStockQty) {
          lowStockItems++;
        }

        if (medicine.purchasePrice && stock) {
          totalStockValue += medicine.purchasePrice * stock;
        }
      });

      // Expired and expiring items
      let expiredItems = 0;
      let expiringIn30Days = 0;
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      batches.forEach((batch: any) => {
        const expiryDate = batch.expiryDate.toDate();
        if (expiryDate < now && batch.quantity > 0) {
          expiredItems++;
        } else if (expiryDate <= thirtyDaysFromNow && expiryDate >= now && batch.quantity > 0) {
          expiringIn30Days++;
        }
      });

      // Stock by category
      const categoryStats: { [key: string]: { count: number; value: number } } = {};

      medicines.forEach((medicine: any) => {
        if (!categoryStats[medicine.category]) {
          categoryStats[medicine.category] = { count: 0, value: 0 };
        }
        categoryStats[medicine.category].count += 1;
        if (medicine.purchasePrice && medicine.totalStock) {
          categoryStats[medicine.category].value += medicine.purchasePrice * medicine.totalStock;
        }
      });

      const stockByCategory = Object.entries(categoryStats).map(([category, data]) => ({
        category,
        itemCount: data.count,
        stockValue: data.value,
        percentage: (data.value / totalStockValue) * 100,
      }));

      const report: InventoryReport = {
        totalMedicines,
        totalStockValue,
        lowStockItems,
        outOfStockItems,
        expiredItems,
        expiringIn30Days,
        stockByCategory,
      };

      set({ inventoryReport: report, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Generate profit report calculating revenue, cost, profit margin for date range
  generateProfitReport: async (startDate: Date, endDate: Date) => {
    try {
      set({ isLoading: true, error: null });

      const q = query(
        collection(db, COLLECTIONS.SALES),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate)),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const sales = snapshot.docs.map(doc => doc.data());

      let totalRevenue = 0;
      let totalCost = 0;
      const medicineProfit: { [key: string]: { revenue: number; cost: number } } = {};

      sales.forEach(sale => {
        totalRevenue += sale.grandTotal;

        sale.items.forEach((item: any) => {
          const itemCost = (item.purchasePrice || 0) * item.quantity;
          const itemRevenue = item.total;

          totalCost += itemCost;

          if (!medicineProfit[item.medicineName]) {
            medicineProfit[item.medicineName] = { revenue: 0, cost: 0 };
          }
          medicineProfit[item.medicineName].revenue += itemRevenue;
          medicineProfit[item.medicineName].cost += itemCost;
        });
      });

      const grossProfit = totalRevenue - totalCost;
      const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

      const topProfitableMedicines = Object.entries(medicineProfit)
        .map(([name, data]) => ({
          medicineId: '',
          medicineName: name,
          revenue: data.revenue,
          cost: data.cost,
          profit: data.revenue - data.cost,
          profitMargin: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0,
        }))
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 10);

      const report: ProfitReport = {
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        totalRevenue,
        totalCost,
        grossProfit,
        profitMargin,
        topProfitableMedicines,
      };

      set({ profitReport: report, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
