import { create } from 'zustand';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Batch } from '@/lib/types';

interface BatchState {
  batches: Batch[];
  isLoading: boolean;
  error: string | null;
  fetchBatchesByMedicine: (medicineId: string) => Promise<void>;
  addBatch: (data: any) => Promise<boolean>;
  adjustStock: (batchId: string, newQuantity: number, reason: string) => Promise<boolean>;
}

export const useBatchStore = create<BatchState>((set, get) => ({
  batches: [],
  isLoading: false,
  error: null,

  fetchBatchesByMedicine: async (medicineId: string) => {
    try {
      set({ isLoading: true, error: null });
      const q = query(
        collection(db, COLLECTIONS.BATCHES),
        where('medicineId', '==', medicineId),
        orderBy('expiryDate', 'asc')
      );
      const snapshot = await getDocs(q);
      const batches = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Batch[];

      set({ batches, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addBatch: async (data: any) => {
    try {
      set({ isLoading: true, error: null });

      const batchData = {
        ...data,
        isExpired: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, COLLECTIONS.BATCHES), batchData);

      // Update medicine total stock - recalculate from all batches
      const batchesSnapshot = await getDocs(
        query(collection(db, COLLECTIONS.BATCHES), where('medicineId', '==', data.medicineId))
      );
      const totalStock = batchesSnapshot.docs.reduce((sum, doc) => sum + doc.data().quantity, 0);

      const medicineRef = doc(db, COLLECTIONS.MEDICINES, data.medicineId);
      await updateDoc(medicineRef, { totalStock, updatedAt: Timestamp.now() });

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  adjustStock: async (batchId: string, newQuantity: number, reason: string) => {
    try {
      set({ isLoading: true, error: null });

      const batchRef = doc(db, COLLECTIONS.BATCHES, batchId);
      await updateDoc(batchRef, {
        quantity: newQuantity,
        updatedAt: Timestamp.now(),
      });

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
}));
