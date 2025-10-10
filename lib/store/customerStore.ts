import { create } from 'zustand';
import { collection, addDoc, updateDoc, doc, getDocs, getDoc, query, where, orderBy, Timestamp, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Customer, CustomerPurchaseHistory } from '@/lib/types';

interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  purchaseHistory: CustomerPurchaseHistory[];
  isLoading: boolean;
  isPurchaseHistoryLoading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  fetchCustomerById: (id: string) => Promise<void>;
  fetchPurchaseHistory: (customerId: string) => Promise<void>;
  addCustomer: (data: any) => Promise<boolean>;
  updateCustomer: (id: string, data: any) => Promise<boolean>;
  searchCustomerByPhone: (phone: string) => Promise<Customer | null>;
  addLoyaltyPoints: (customerId: string, points: number) => Promise<boolean>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  currentCustomer: null,
  purchaseHistory: [],
  isLoading: false,
  isPurchaseHistoryLoading: false,
  error: null,

  fetchCustomers: async () => {
    try {
      set({ isLoading: true, error: null });
      const q = query(
        collection(db, COLLECTIONS.CUSTOMERS),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      const customers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];

      set({ customers, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCustomerById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const customer = { id: docSnap.id, ...docSnap.data() } as Customer;
        set({ currentCustomer: customer, isLoading: false });
      } else {
        set({ error: 'Customer not found', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPurchaseHistory: async (customerId: string) => {
    try {
      set({ isPurchaseHistoryLoading: true, error: null });

      // Get customer to find their phone number
      const customerDoc = await getDoc(doc(db, COLLECTIONS.CUSTOMERS, customerId));

      if (!customerDoc.exists()) {
        set({ purchaseHistory: [], isPurchaseHistoryLoading: false });
        return;
      }

      const customerData = customerDoc.data();
      const customerPhone = customerData.phone;

      // Query sales by customer phone number (without orderBy to avoid index requirement)
      const q = query(
        collection(db, COLLECTIONS.SALES),
        where('customerPhone', '==', customerPhone)
      );
      const snapshot = await getDocs(q);

      // Sort in memory instead of using Firestore orderBy
      const history = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            customerId,
            saleId: doc.id,
            invoiceNumber: data.invoiceNumber,
            amount: data.grandTotal,
            purchaseDate: data.createdAt,
            items: data.items,
          };
        })
        .sort((a, b) => {
          // Sort by date descending (newest first)
          return b.purchaseDate.toMillis() - a.purchaseDate.toMillis();
        }) as CustomerPurchaseHistory[];

      set({ purchaseHistory: history, isPurchaseHistoryLoading: false });
    } catch (error: any) {
      console.error('Error fetching purchase history:', error);
      // If there's an error (like no matching sales), just return empty array
      set({ purchaseHistory: [], isPurchaseHistoryLoading: false, error: null });
    }
  },

  addCustomer: async (data: any) => {
    try {
      set({ isLoading: true, error: null });

      const customerData = {
        ...data,
        totalPurchases: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, COLLECTIONS.CUSTOMERS), customerData);
      await get().fetchCustomers();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  updateCustomer: async (id: string, data: any) => {
    try {
      set({ isLoading: true, error: null });

      const updateData = { ...data, updatedAt: Timestamp.now() };
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, id);
      await updateDoc(docRef, updateData);
      await get().fetchCustomers();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  searchCustomerByPhone: async (phone: string) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.CUSTOMERS),
        where('phone', '==', phone),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const customer = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Customer;
        return customer;
      }
      return null;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  addLoyaltyPoints: async (customerId: string, points: number) => {
    try {
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, customerId);
      await updateDoc(docRef, {
        loyaltyPoints: increment(points),
        updatedAt: Timestamp.now(),
      });
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  },
}));
