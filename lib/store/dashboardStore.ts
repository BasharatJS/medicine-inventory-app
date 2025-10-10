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

  fetchMetrics: async () => {
    try {
      set({ isLoading: true, error: null });

      // Fetch total medicines
      const medicinesSnapshot = await getDocs(
        query(collection(db, COLLECTIONS.MEDICINES), where('isActive', '==', true))
      );
      const totalMedicines = medicinesSnapshot.size;

      // Calculate low stock items
      let lowStockItems = 0;
      let totalStockValue = 0;

      medicinesSnapshot.forEach(doc => {
        const data = doc.data();
        if ((data.totalStock || 0) <= data.minStockQty) {
          lowStockItems++;
        }
        if (data.purchasePrice && data.totalStock) {
          totalStockValue += data.purchasePrice * data.totalStock;
        }
      });

      // Fetch expiring batches (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const batchesSnapshot = await getDocs(collection(db, COLLECTIONS.BATCHES));
      let expiringSoon = 0;

      batchesSnapshot.forEach(doc => {
        const data = doc.data();
        const expiryDate = data.expiryDate.toDate();
        if (expiryDate <= thirtyDaysFromNow && expiryDate >= new Date() && data.quantity > 0) {
          expiringSoon++;
        }
      });

      // Fetch today's sales
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const salesSnapshot = await getDocs(
        query(
          collection(db, COLLECTIONS.SALES),
          where('createdAt', '>=', Timestamp.fromDate(today))
        )
      );
      const todaysSales = salesSnapshot.size;

      // Calculate today's revenue and profit
      let todaysRevenue = 0;
      let todaysProfit = 0;

      salesSnapshot.forEach(doc => {
        const data = doc.data();
        todaysRevenue += data.grandTotal || 0;

        // Calculate profit for each sale
        if (data.items && Array.isArray(data.items)) {
          data.items.forEach((item: any) => {
            const itemProfit = (item.price - (item.purchasePrice || 0)) * item.quantity;
            todaysProfit += itemProfit;
          });
        }
      });

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
