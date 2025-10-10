import { create } from 'zustand';
import { collection, addDoc, updateDoc, doc, getDocs, getDoc, query, where, orderBy, Timestamp, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Supplier, PurchaseOrder, SupplierPayment } from '@/lib/types';

interface SupplierState {
  suppliers: Supplier[];
  currentSupplier: Supplier | null;
  purchaseOrders: PurchaseOrder[];
  payments: SupplierPayment[];
  isLoading: boolean;
  isOrdersLoading: boolean;
  isPaymentsLoading: boolean;
  error: string | null;
  fetchSuppliers: () => Promise<void>;
  fetchSupplierById: (id: string) => Promise<void>;
  fetchPurchaseOrders: (supplierId?: string) => Promise<void>;
  fetchSupplierPayments: (supplierId: string) => Promise<void>;
  addSupplier: (data: any) => Promise<boolean>;
  updateSupplier: (id: string, data: any) => Promise<boolean>;
  addPurchaseOrder: (data: any) => Promise<boolean>;
  updatePurchaseOrderStatus: (id: string, status: string, actualDeliveryDate?: Date) => Promise<boolean>;
  addSupplierPayment: (data: any) => Promise<boolean>;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  currentSupplier: null,
  purchaseOrders: [],
  payments: [],
  isLoading: false,
  isOrdersLoading: false,
  isPaymentsLoading: false,
  error: null,

  fetchSuppliers: async () => {
    try {
      set({ isLoading: true, error: null });
      const q = query(
        collection(db, COLLECTIONS.SUPPLIERS),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      const suppliers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Supplier[];

      set({ suppliers, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSupplierById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const docRef = doc(db, COLLECTIONS.SUPPLIERS, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const supplier = { id: docSnap.id, ...docSnap.data() } as Supplier;
        set({ currentSupplier: supplier, isLoading: false });
      } else {
        set({ error: 'Supplier not found', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPurchaseOrders: async (supplierId?: string) => {
    try {
      set({ isOrdersLoading: true, error: null });
      let q;

      if (supplierId) {
        q = query(
          collection(db, COLLECTIONS.PURCHASE_ORDERS),
          where('supplierId', '==', supplierId),
          orderBy('orderDate', 'desc')
        );
      } else {
        q = query(
          collection(db, COLLECTIONS.PURCHASE_ORDERS),
          orderBy('orderDate', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PurchaseOrder[];

      set({ purchaseOrders: orders, isOrdersLoading: false });
    } catch (error: any) {
      set({ error: error.message, isOrdersLoading: false });
    }
  },

  fetchSupplierPayments: async (supplierId: string) => {
    try {
      set({ isPaymentsLoading: true, error: null });
      const q = query(
        collection(db, COLLECTIONS.SUPPLIER_PAYMENTS),
        where('supplierId', '==', supplierId),
        orderBy('paymentDate', 'desc')
      );
      const snapshot = await getDocs(q);
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SupplierPayment[];

      set({ payments, isPaymentsLoading: false });
    } catch (error: any) {
      set({ error: error.message, isPaymentsLoading: false });
    }
  },

  addSupplier: async (data: any) => {
    try {
      set({ isLoading: true, error: null });

      const supplierData = {
        ...data,
        totalOrders: 0,
        totalPurchaseAmount: 0,
        outstandingAmount: 0,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, COLLECTIONS.SUPPLIERS), supplierData);
      await get().fetchSuppliers();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  updateSupplier: async (id: string, data: any) => {
    try {
      set({ isLoading: true, error: null });

      const updateData = { ...data, updatedAt: Timestamp.now() };
      const docRef = doc(db, COLLECTIONS.SUPPLIERS, id);
      await updateDoc(docRef, updateData);
      await get().fetchSuppliers();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  addPurchaseOrder: async (data: any) => {
    try {
      set({ isLoading: true, error: null });

      const orderNumber = `PO${Date.now()}`;
      const orderData = {
        orderNumber,
        ...data,
        status: 'PENDING',
        paidAmount: 0,
        paymentStatus: 'UNPAID',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, COLLECTIONS.PURCHASE_ORDERS), orderData);

      // Update supplier stats
      const supplierRef = doc(db, COLLECTIONS.SUPPLIERS, data.supplierId);
      await updateDoc(supplierRef, {
        totalOrders: increment(1),
        totalPurchaseAmount: increment(data.totalAmount),
        outstandingAmount: increment(data.totalAmount),
        lastOrderDate: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  updatePurchaseOrderStatus: async (id: string, status: string, actualDeliveryDate?: Date) => {
    try {
      set({ isLoading: true, error: null });

      const updateData: any = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (actualDeliveryDate) {
        updateData.actualDeliveryDate = Timestamp.fromDate(actualDeliveryDate);
      }

      const docRef = doc(db, COLLECTIONS.PURCHASE_ORDERS, id);
      await updateDoc(docRef, updateData);

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  addSupplierPayment: async (data: any) => {
    try {
      set({ isLoading: true, error: null });

      const paymentData = {
        ...data,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, COLLECTIONS.SUPPLIER_PAYMENTS), paymentData);

      // Update supplier outstanding amount
      const supplierRef = doc(db, COLLECTIONS.SUPPLIERS, data.supplierId);
      await updateDoc(supplierRef, {
        outstandingAmount: increment(-data.amount),
        updatedAt: Timestamp.now(),
      });

      // Update purchase order if linked
      if (data.purchaseOrderId) {
        const poRef = doc(db, COLLECTIONS.PURCHASE_ORDERS, data.purchaseOrderId);
        const poDoc = await getDoc(poRef);

        if (poDoc.exists()) {
          const poData = poDoc.data();
          const newPaidAmount = (poData.paidAmount || 0) + data.amount;
          const totalAmount = poData.totalAmount;

          let paymentStatus = 'UNPAID';
          if (newPaidAmount >= totalAmount) {
            paymentStatus = 'PAID';
          } else if (newPaidAmount > 0) {
            paymentStatus = 'PARTIAL';
          }

          await updateDoc(poRef, {
            paidAmount: newPaidAmount,
            paymentStatus,
            updatedAt: Timestamp.now(),
          });
        }
      }

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
}));
