import { create } from 'zustand';
import { collection, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Batch } from '@/lib/types';

interface ExpiryState {
  expiringBatches: Batch[];
  isLoading: boolean;
  error: string | null;
  fetchExpiringBatches: (daysAhead: number) => Promise<void>;
  markAsRemoved: (batchId: string) => Promise<boolean>;
}

export const useExpiryStore = create<ExpiryState>((set, get) => ({
  expiringBatches: [],
  isLoading: false,
  error: null,

  // Fetch batches expiring within specified days (0=expired, 30=within 30 days, etc.)
  fetchExpiringBatches: async (daysAhead: number) => {
    try {
      set({ isLoading: true, error: null });

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysAhead);

      const snapshot = await getDocs(collection(db, COLLECTIONS.BATCHES));

      const batches = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }) as Batch)
        .filter(batch => {
          const expiryDate = batch.expiryDate.toDate();
          if (daysAhead === 0) {
            // For expired items
            return expiryDate < new Date();
          } else {
            // For items expiring within daysAhead
            return expiryDate >= new Date() && expiryDate <= targetDate;
          }
        })
        .sort((a, b) => a.expiryDate.toDate().getTime() - b.expiryDate.toDate().getTime());

      set({ expiringBatches: batches, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Mark expired batch as removed by setting quantity to 0 and isExpired flag
  markAsRemoved: async (batchId: string) => {
    try {
      set({ isLoading: true, error: null });

      const batchRef = doc(db, COLLECTIONS.BATCHES, batchId);
      await updateDoc(batchRef, {
        quantity: 0,
        isExpired: true,
        updatedAt: Timestamp.now(),
      });

      // Refresh the list
      const { expiringBatches } = get();
      const currentFilter = expiringBatches.length > 0 ? 30 : 0;
      await get().fetchExpiringBatches(currentFilter);

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
}));
