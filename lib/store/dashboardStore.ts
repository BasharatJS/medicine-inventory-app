// Zustand store for dashboard metrics and statistics
import { create } from 'zustand';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { DashboardMetrics, Activity } from '@/lib/types';

interface DashboardState {
  metrics: DashboardMetrics;
  recentActivities: Activity[];
  isLoading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  fetchRecentActivities: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: {
    totalMedicines: 0,
    lowStockItems: 0,
    expiringSoon: 0,
    todaysSales: 0,
    totalStockValue: 0,
    todaysRevenue: 0,
    todaysProfit: 0,
  },
  recentActivities: [],
  isLoading: false,
  error: null,

  // Firestore API: Calculate and fetch dashboard metrics (sales, stock, profit)
  fetchMetrics: async () => {
    try {
      set({ isLoading: true, error: null });

      // Query active medicines
      const medicinesSnapshot = await getDocs(
        query(collection(db, COLLECTIONS.MEDICINES), where('isActive', '==', true))
      );
      const totalMedicines = medicinesSnapshot.size;

      // Calculate low stock items and total inventory value
      let lowStockItems = 0;
      let totalStockValue = 0;

      medicinesSnapshot.forEach(doc => {
        const data = doc.data();
        // Check if stock is below minimum threshold
        if ((data.totalStock || 0) <= data.minStockQty) {
          lowStockItems++;
        }
        // Calculate inventory value (purchasePrice × totalStock)
        if (data.purchasePrice && data.totalStock) {
          totalStockValue += data.purchasePrice * data.totalStock;
        }
      });

      // Count batches expiring within 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const batchesSnapshot = await getDocs(collection(db, COLLECTIONS.BATCHES));
      let expiringSoon = 0;

      batchesSnapshot.forEach(doc => {
        const data = doc.data();
        const expiryDate = data.expiryDate.toDate();
        // Check if expiring within 30 days and has stock
        if (expiryDate <= thirtyDaysFromNow && expiryDate >= new Date() && data.quantity > 0) {
          expiringSoon++;
        }
      });

      // Query today's sales (from 00:00:00 today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const salesSnapshot = await getDocs(
        query(
          collection(db, COLLECTIONS.SALES),
          where('createdAt', '>=', Timestamp.fromDate(today))
        )
      );
      const todaysSales = salesSnapshot.size;

      // Calculate today's revenue, cost and profit (matches reportStore logic)
      let todaysRevenue = 0;
      let todaysCost = 0;

      salesSnapshot.forEach(doc => {
        const data = doc.data();
        // Revenue = sum of grandTotal
        todaysRevenue += data.grandTotal || 0;

        // Cost = sum of (purchasePrice × quantity) for each item
        if (data.items && Array.isArray(data.items)) {
          data.items.forEach((item: any) => {
            const itemCost = (item.purchasePrice || 0) * item.quantity;
            todaysCost += itemCost;
          });
        }
      });

      // Profit = Revenue - Cost
      const todaysProfit = todaysRevenue - todaysCost;

      // Update metrics state
      set({
        metrics: {
          totalMedicines,
          lowStockItems,
          expiringSoon,
          todaysSales,
          totalStockValue,
          todaysRevenue,
          todaysProfit,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Firestore API: Fetch recent activities (last 10 sales)
  fetchRecentActivities: async () => {
    try {
      set({ isLoading: true, error: null });

      const salesSnapshot = await getDocs(
        query(
          collection(db, COLLECTIONS.SALES),
          orderBy('createdAt', 'desc'),
          limit(10)
        )
      );

      const activities: Activity[] = salesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: 'sale',
          description: `Sale to ${data.customerName} - Invoice ${data.invoiceNumber}`,
          userId: data.userId,
          userName: data.userName,
          amount: data.grandTotal,
          createdAt: data.createdAt,
        };
      });

      set({ recentActivities: activities, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
