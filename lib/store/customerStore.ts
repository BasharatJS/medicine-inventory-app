// Import Zustand for state management
import { create } from 'zustand';
// Import Firestore functions for database operations
import { collection, addDoc, updateDoc, doc, getDocs, getDoc, query, where, orderBy, Timestamp, increment } from 'firebase/firestore';
// Import Firebase configuration
import { db } from '@/lib/firebase/config';
// Import Firestore collection names
import { COLLECTIONS } from '@/lib/firebase/collections';
// Import Customer type definitions
import { Customer, CustomerPurchaseHistory } from '@/lib/types';

// Define the structure of customer state
interface CustomerState {
  customers: Customer[]; // List of all customers
  currentCustomer: Customer | null; // Currently selected customer
  purchaseHistory: CustomerPurchaseHistory[]; // Purchase history list
  isLoading: boolean; // Loading state for customer operations
  isPurchaseHistoryLoading: boolean; // Loading state for purchase history
  error: string | null; // Error message if any
  fetchCustomers: () => Promise<void>; // Fetch all active customers
  fetchCustomerById: (id: string) => Promise<void>; // Fetch single customer
  fetchPurchaseHistory: (customerId: string) => Promise<void>; // Fetch purchase history
  addCustomer: (data: any) => Promise<boolean>; // Add new customer
  updateCustomer: (id: string, data: any) => Promise<boolean>; // Update customer
  searchCustomerByPhone: (phone: string) => Promise<Customer | null>; // Search by phone
  addLoyaltyPoints: (customerId: string, points: number) => Promise<boolean>; // Add points
}

// Create Zustand store for customer management
export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [], // Initial: empty array
  currentCustomer: null, // Initial: no customer selected
  purchaseHistory: [], // Initial: empty history
  isLoading: false, // Initial: not loading
  isPurchaseHistoryLoading: false, // Initial: not loading history
  error: null, // Initial: no error

  // Function to fetch all active customers from Firestore
  fetchCustomers: async () => {
    try {
      set({ isLoading: true, error: null }); // Set loading state
      // Firestore API: Query customers where isActive=true, sorted by name
      const q = query(
        collection(db, COLLECTIONS.CUSTOMERS),
        where('isActive', '==', true), // Filter active customers only
        orderBy('name', 'asc') // Sort alphabetically by name
      );
      const snapshot = await getDocs(q); // Execute Firestore query
      // Map Firestore documents to Customer objects
      const customers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];

      set({ customers, isLoading: false }); // Update state with customers
    } catch (error: any) {
      set({ error: error.message, isLoading: false }); // Handle error
    }
  },

  // Function to fetch single customer by ID
  fetchCustomerById: async (id: string) => {
    try {
      set({ isLoading: true, error: null }); // Set loading state
      // Firestore API: Get customer document by ID
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Customer found, set as current customer
        const customer = { id: docSnap.id, ...docSnap.data() } as Customer;
        set({ currentCustomer: customer, isLoading: false });
      } else {
        // Customer not found
        set({ error: 'Customer not found', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false }); // Handle error
    }
  },

  // Function to fetch customer's purchase history from sales
  fetchPurchaseHistory: async (customerId: string) => {
    try {
      set({ isPurchaseHistoryLoading: true, error: null }); // Set loading state

      // Firestore API: Get customer document to find phone number
      const customerDoc = await getDoc(doc(db, COLLECTIONS.CUSTOMERS, customerId));

      if (!customerDoc.exists()) {
        // Customer not found, return empty history
        set({ purchaseHistory: [], isPurchaseHistoryLoading: false });
        return;
      }

      const customerData = customerDoc.data();
      const customerPhone = customerData.phone; // Extract phone for query

      // Firestore API: Query sales by customer phone (no orderBy to avoid index)
      const q = query(
        collection(db, COLLECTIONS.SALES),
        where('customerPhone', '==', customerPhone) // Filter by phone number
      );
      const snapshot = await getDocs(q); // Execute query

      // Sort in memory instead of Firestore orderBy (avoids composite index)
      const history = snapshot.docs
        .map(doc => {
          const data = doc.data();
          // Transform sale document to purchase history format
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

      set({ purchaseHistory: history, isPurchaseHistoryLoading: false }); // Update state
    } catch (error: any) {
      console.error('Error fetching purchase history:', error);
      // If error (like no sales), return empty array
      set({ purchaseHistory: [], isPurchaseHistoryLoading: false, error: null });
    }
  },

  // Function to add new customer to database
  addCustomer: async (data: any) => {
    try {
      set({ isLoading: true, error: null }); // Set loading state

      // Prepare customer data with default values
      const customerData = {
        ...data,
        totalPurchases: 0, // Initialize purchase count to 0
        totalSpent: 0, // Initialize total spent to 0
        loyaltyPoints: 0, // Initialize loyalty points to 0
        isActive: true, // Mark customer as active
        createdAt: Timestamp.now(), // Set creation timestamp
        updatedAt: Timestamp.now(), // Set update timestamp
      };

      // Firestore API: Add new customer document to collection
      await addDoc(collection(db, COLLECTIONS.CUSTOMERS), customerData);
      await get().fetchCustomers(); // Refresh customer list
      set({ isLoading: false }); // Clear loading state
      return true; // Success
    } catch (error: any) {
      set({ error: error.message, isLoading: false }); // Handle error
      return false; // Failure
    }
  },

  // Function to update existing customer details
  updateCustomer: async (id: string, data: any) => {
    try {
      set({ isLoading: true, error: null }); // Set loading state

      const updateData = { ...data, updatedAt: Timestamp.now() }; // Add timestamp
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, id);
      // Firestore API: Update customer document
      await updateDoc(docRef, updateData);
      await get().fetchCustomers(); // Refresh customer list
      set({ isLoading: false }); // Clear loading state
      return true; // Success
    } catch (error: any) {
      set({ error: error.message, isLoading: false }); // Handle error
      return false; // Failure
    }
  },

  // Function to search customer by phone number (used in billing)
  searchCustomerByPhone: async (phone: string) => {
    try {
      // Firestore API: Query customers by phone number
      const q = query(
        collection(db, COLLECTIONS.CUSTOMERS),
        where('phone', '==', phone), // Filter by phone
        where('isActive', '==', true) // Only active customers
      );
      const snapshot = await getDocs(q); // Execute query

      if (!snapshot.empty) {
        // Customer found, return first match
        const customer = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Customer;
        return customer;
      }
      return null; // Customer not found
    } catch (error: any) {
      set({ error: error.message }); // Handle error
      return null;
    }
  },

  // Function to add loyalty points to customer (used after sale)
  addLoyaltyPoints: async (customerId: string, points: number) => {
    try {
      const docRef = doc(db, COLLECTIONS.CUSTOMERS, customerId);
      // Firestore API: Atomically increment loyalty points
      await updateDoc(docRef, {
        loyaltyPoints: increment(points), // Atomic increment operation
        updatedAt: Timestamp.now(), // Update timestamp
      });
      return true; // Success
    } catch (error: any) {
      set({ error: error.message }); // Handle error
      return false; // Failure
    }
  },
}));
