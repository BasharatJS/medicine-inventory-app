// Import Zustand for state management
import { create } from 'zustand';
// Import Firestore functions for database operations
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where, Timestamp, orderBy } from 'firebase/firestore';
// Import Firebase Storage functions for image upload
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// Import Firebase configuration
import { db, storage } from '@/lib/firebase/config';
// Import Firestore collection names
import { COLLECTIONS } from '@/lib/firebase/collections';
// Import Medicine type definition
import { Medicine } from '@/lib/types';

// Define the structure of medicine state
interface MedicineState {
  medicines: Medicine[]; // List of all medicines
  currentMedicine: Medicine | null; // Currently selected medicine
  isLoading: boolean; // Loading state
  error: string | null; // Error message
  fetchMedicines: () => Promise<void>; // Fetch all active medicines
  fetchMedicineById: (id: string) => Promise<void>; // Fetch single medicine
  addMedicine: (data: any, imageFile?: File | null) => Promise<boolean>; // Add new medicine
  updateMedicine: (id: string, data: any, imageFile?: File | null) => Promise<boolean>; // Update medicine
  deleteMedicine: (id: string) => Promise<boolean>; // Soft delete medicine
}

// Create Zustand store for medicine inventory management
export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: [], // Initial: empty medicine list
  currentMedicine: null, // Initial: no medicine selected
  isLoading: false, // Initial: not loading
  error: null, // Initial: no error

  // Function to fetch all active medicines from database
  fetchMedicines: async () => {
    try {
      set({ isLoading: true, error: null }); // Set loading state
      // Firestore API: Query medicines where isActive=true, sorted by name
      const q = query(
        collection(db, COLLECTIONS.MEDICINES),
        where('isActive', '==', true), // Filter only active medicines
        orderBy('name', 'asc') // Sort alphabetically
      );
      const snapshot = await getDocs(q); // Execute query
      // Map Firestore documents to Medicine objects
      const medicines = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Medicine[];

      set({ medicines, isLoading: false }); // Update state
    } catch (error: any) {
      set({ error: error.message, isLoading: false }); // Handle error
    }
  },

  // Function to fetch single medicine by ID
  fetchMedicineById: async (id: string) => {
    try {
      set({ isLoading: true, error: null }); // Set loading state
      // Firestore API: Get medicine document by ID
      const docRef = doc(db, COLLECTIONS.MEDICINES, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Medicine found, set as current medicine
        const medicine = { id: docSnap.id, ...docSnap.data() } as Medicine;
        set({ currentMedicine: medicine, isLoading: false });
      } else {
        // Medicine not found
        set({ error: 'Medicine not found', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false }); // Handle error
    }
  },

  // Function to add new medicine with optional image upload
  addMedicine: async (data: any, imageFile?: File | null) => {
    try {
      set({ isLoading: true, error: null }); // Set loading state

      let imageUrl = ''; // Initialize image URL
      if (imageFile) {
        // Firebase Storage API: Upload medicine image
        const imageRef = ref(storage, `medicines/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile); // Upload file
        imageUrl = await getDownloadURL(imageRef); // Get download URL
      }

      // Prepare medicine data with defaults
      const medicineData = {
        ...data,
        imageUrl, // Image URL from storage
        totalStock: 0, // Initialize stock to 0 (updated when batches added)
        isActive: true, // Mark as active
        createdAt: Timestamp.now(), // Set creation time
        updatedAt: Timestamp.now(), // Set update time
      };

      // Firestore API: Add new medicine document
      await addDoc(collection(db, COLLECTIONS.MEDICINES), medicineData);
      await get().fetchMedicines(); // Refresh medicine list
      set({ isLoading: false }); // Clear loading
      return true; // Success
    } catch (error: any) {
      set({ error: error.message, isLoading: false }); // Handle error
      return false; // Failure
    }
  },

  // Function to update existing medicine with optional new image
  updateMedicine: async (id: string, data: any, imageFile?: File | null) => {
    try {
      set({ isLoading: true, error: null }); // Set loading state

      let updateData = { ...data, updatedAt: Timestamp.now() }; // Add timestamp

      if (imageFile) {
        // Firebase Storage API: Upload new medicine image
        const imageRef = ref(storage, `medicines/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile); // Upload file
        const imageUrl = await getDownloadURL(imageRef); // Get URL
        updateData.imageUrl = imageUrl; // Add to update data
      }

      // Firestore API: Update medicine document
      const docRef = doc(db, COLLECTIONS.MEDICINES, id);
      await updateDoc(docRef, updateData);
      await get().fetchMedicines(); // Refresh list
      set({ isLoading: false }); // Clear loading
      return true; // Success
    } catch (error: any) {
      set({ error: error.message, isLoading: false }); // Handle error
      return false; // Failure
    }
  },

  // Function to soft delete medicine (set isActive = false)
  deleteMedicine: async (id: string) => {
    try {
      set({ isLoading: true, error: null }); // Set loading state
      // Firestore API: Update medicine to inactive (soft delete)
      const docRef = doc(db, COLLECTIONS.MEDICINES, id);
      await updateDoc(docRef, { isActive: false, updatedAt: Timestamp.now() });
      await get().fetchMedicines(); // Refresh list
      set({ isLoading: false }); // Clear loading
      return true; // Success
    } catch (error: any) {
      set({ error: error.message, isLoading: false }); // Handle error
      return false; // Failure
    }
  },
}));
