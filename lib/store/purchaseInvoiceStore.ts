import { create } from 'zustand';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import { PurchaseInvoice, PurchaseInvoiceItem } from '@/lib/types';

interface PurchaseInvoiceStore {
  invoices: PurchaseInvoice[];
  currentInvoice: PurchaseInvoice | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchInvoices: () => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<void>;
  createInvoice: (invoiceData: Omit<PurchaseInvoice, 'id' | 'createdAt' | 'updatedAt'>, imageFile?: File) => Promise<string | null>;
  updateInvoice: (id: string, updates: Partial<PurchaseInvoice>) => Promise<boolean>;
  confirmInvoice: (id: string) => Promise<boolean>;
  deleteInvoice: (id: string) => Promise<boolean>;
  setCurrentInvoice: (invoice: PurchaseInvoice | null) => void;
  clearError: () => void;
}

export const usePurchaseInvoiceStore = create<PurchaseInvoiceStore>((set, get) => ({
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  error: null,

  fetchInvoices: async () => {
    set({ isLoading: true, error: null });
    try {
      const q = query(
        collection(db, 'purchaseInvoices'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const invoices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PurchaseInvoice[];

      set({ invoices, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchInvoiceById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'purchaseInvoices', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const invoice = { id: docSnap.id, ...docSnap.data() } as PurchaseInvoice;
        set({ currentInvoice: invoice, isLoading: false });
      } else {
        set({ error: 'Invoice not found', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createInvoice: async (invoiceData, imageFile) => {
    set({ isLoading: true, error: null });
    try {
      let invoiceImageUrl: string | undefined;

      // Upload invoice image if provided
      if (imageFile) {
        const storageRef = ref(storage, `invoices/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        invoiceImageUrl = await getDownloadURL(storageRef);
      }

      const docRef = await addDoc(collection(db, 'purchaseInvoices'), {
        ...invoiceData,
        invoiceImageUrl,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      set({ isLoading: false });
      return docRef.id;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  updateInvoice: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'purchaseInvoices', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  confirmInvoice: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const batch = writeBatch(db);

      // Get the invoice
      const invoiceRef = doc(db, 'purchaseInvoices', id);
      const invoiceSnap = await getDoc(invoiceRef);

      if (!invoiceSnap.exists()) {
        throw new Error('Invoice not found');
      }

      const invoice = invoiceSnap.data() as PurchaseInvoice;

      // Update invoice status
      batch.update(invoiceRef, {
        status: 'CONFIRMED',
        updatedAt: Timestamp.now(),
      });

      // Create batches and update/create medicines for each item
      for (const item of invoice.items) {
        // Check if medicine exists or create new one
        let medicineId = item.medicineId;

        if (item.isNewMedicine && !medicineId) {
          // Create new medicine
          const medicineRef = doc(collection(db, 'medicines'));
          batch.set(medicineRef, {
            name: item.medicineName,
            genericName: item.genericName || '',
            manufacturer: item.manufacturer || '',
            category: item.category || 'Other',
            mrp: item.mrp,
            purchasePrice: item.purchasePrice,
            rackLocation: item.rackLocation || 'N/A',
            minStockQty: 10,
            totalStock: 0,
            isActive: true,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
          medicineId = medicineRef.id;
        }

        if (medicineId) {
          // Create batch
          const batchRef = doc(collection(db, 'batches'));
          batch.set(batchRef, {
            batchNumber: item.batchNumber,
            medicineId: medicineId,
            medicineName: item.medicineName,
            quantity: item.quantity,
            mrp: item.mrp,
            purchasePrice: item.purchasePrice,
            manufacturingDate: item.manufacturingDate,
            expiryDate: item.expiryDate,
            supplierName: invoice.supplierName,
            purchaseDate: invoice.invoiceDate,
            isExpired: false,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });

          // Update medicine total stock
          const medicineRef = doc(db, 'medicines', medicineId);
          const medicineSnap = await getDoc(medicineRef);
          if (medicineSnap.exists()) {
            const currentStock = medicineSnap.data().totalStock || 0;
            batch.update(medicineRef, {
              totalStock: currentStock + item.quantity,
              updatedAt: Timestamp.now(),
            });
          }
        }
      }

      // Update supplier outstanding amount
      if (invoice.supplierId) {
        const supplierRef = doc(db, 'suppliers', invoice.supplierId);
        const supplierSnap = await getDoc(supplierRef);
        if (supplierSnap.exists()) {
          const currentOutstanding = supplierSnap.data().outstandingAmount || 0;
          const currentTotal = supplierSnap.data().totalPurchaseAmount || 0;
          batch.update(supplierRef, {
            outstandingAmount: currentOutstanding + invoice.totalAmount,
            totalPurchaseAmount: currentTotal + invoice.totalAmount,
            totalOrders: (supplierSnap.data().totalOrders || 0) + 1,
            lastOrderDate: invoice.invoiceDate,
            updatedAt: Timestamp.now(),
          });
        }
      }

      await batch.commit();

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  deleteInvoice: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'purchaseInvoices', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const invoice = docSnap.data() as PurchaseInvoice;
        if (invoice.status === 'CONFIRMED') {
          throw new Error('Cannot delete confirmed invoice');
        }
        await updateDoc(docRef, { status: 'CANCELLED' as any });
      }

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  setCurrentInvoice: (invoice) => {
    set({ currentInvoice: invoice });
  },

  clearError: () => {
    set({ error: null });
  },
}));
