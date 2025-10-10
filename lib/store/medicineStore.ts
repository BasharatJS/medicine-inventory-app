import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where, Timestamp, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Medicine } from '@/lib/types';

interface MedicineState {
  medicines: Medicine[];
  currentMedicine: Medicine | null;
  isLoading: boolean;
  error: string | null;
  fetchMedicines: () => Promise<void>;
  fetchMedicineById: (id: string) => Promise<void>;
  addMedicine: (data: any, imageFile?: File | null) => Promise<boolean>;
  updateMedicine: (id: string, data: any, imageFile?: File | null) => Promise<boolean>;
  deleteMedicine: (id: string) => Promise<boolean>;
}

export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: [],
  currentMedicine: null,
  isLoading: false,
  error: null,

  fetchMedicines: async () => {
    try {
      set({ isLoading: true, error: null });
      const q = query(
        collection(db, COLLECTIONS.MEDICINES),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      const medicines = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Medicine[];

      set({ medicines, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMedicineById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const docRef = doc(db, COLLECTIONS.MEDICINES, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const medicine = { id: docSnap.id, ...docSnap.data() } as Medicine;
        set({ currentMedicine: medicine, isLoading: false });
      } else {
        set({ error: 'Medicine not found', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addMedicine: async (data: any, imageFile?: File | null) => {
    try {
      set({ isLoading: true, error: null });

      let imageUrl = '';
      if (imageFile) {
        const imageRef = ref(storage, `medicines/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const medicineData = {
        ...data,
        imageUrl,
        totalStock: 0,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, COLLECTIONS.MEDICINES), medicineData);
      await get().fetchMedicines();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  updateMedicine: async (id: string, data: any, imageFile?: File | null) => {
    try {
      set({ isLoading: true, error: null });

      let updateData = { ...data, updatedAt: Timestamp.now() };

      if (imageFile) {
        const imageRef = ref(storage, `medicines/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);
        updateData.imageUrl = imageUrl;
      }

      const docRef = doc(db, COLLECTIONS.MEDICINES, id);
      await updateDoc(docRef, updateData);
      await get().fetchMedicines();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  deleteMedicine: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const docRef = doc(db, COLLECTIONS.MEDICINES, id);
      await updateDoc(docRef, { isActive: false, updatedAt: Timestamp.now() });
      await get().fetchMedicines();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
}));
