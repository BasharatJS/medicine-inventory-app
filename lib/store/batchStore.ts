// Zustand store for batch management (medicine stock by batch number)
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

  // Firestore API: Fetch all batches for a medicine, sorted by expiry date
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

  // Firestore API: Add new batch and recalculate medicine totalStock
  addBatch: async (data: any) => {
    try {
      set({ isLoading: true, error: null });

      const batchData = {
        ...data,
        isExpired: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Create batch document
      await addDoc(collection(db, COLLECTIONS.BATCHES), batchData);

      // Recalculate medicine total stock from all batches
      const batchesSnapshot = await getDocs(
        query(collection(db, COLLECTIONS.BATCHES), where('medicineId', '==', data.medicineId))
      );
      const totalStock = batchesSnapshot.docs.reduce((sum, doc) => sum + doc.data().quantity, 0);

      // Update medicine totalStock
      const medicineRef = doc(db, COLLECTIONS.MEDICINES, data.medicineId);
      await updateDoc(medicineRef, { totalStock, updatedAt: Timestamp.now() });

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  // Firestore API: Adjust batch quantity and recalculate medicine totalStock
  adjustStock: async (batchId: string, newQuantity: number, reason: string) => {
    try {
      set({ isLoading: true, error: null });

      const batchRef = doc(db, COLLECTIONS.BATCHES, batchId);

      // Get batch data to find medicineId
      const batchesSnapshot = await getDocs(collection(db, COLLECTIONS.BATCHES));
      const batchDoc = batchesSnapshot.docs.find(doc => doc.id === batchId);

      if (!batchDoc) {
        set({ error: 'Batch not found', isLoading: false });
        return false;
      }

      const medicineId = batchDoc.data().medicineId;

      // Update batch quantity
      await updateDoc(batchRef, {
        quantity: newQuantity,
        updatedAt: Timestamp.now(),
      });

      // Recalculate medicine total stock from all batches
      const medicineBatchesSnapshot = await getDocs(
        query(collection(db, COLLECTIONS.BATCHES), where('medicineId', '==', medicineId))
      );
      const totalStock = medicineBatchesSnapshot.docs.reduce((sum, doc) => {
        // Use updated quantity for the adjusted batch
        const quantity = doc.id === batchId ? newQuantity : doc.data().quantity;
        return sum + quantity;
      }, 0);

      // Update medicine totalStock
      const medicineRef = doc(db, COLLECTIONS.MEDICINES, medicineId);
      await updateDoc(medicineRef, { totalStock, updatedAt: Timestamp.now() });

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
}));
