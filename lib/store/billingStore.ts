import { create } from 'zustand';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Sale, CartItem, CartTotal } from '@/lib/types';

interface BillingState {
  cart: CartItem[];
  cartTotal: CartTotal;
  sales: Sale[];
  isLoading: boolean;
  error: string | null;
  addToCart: (item: CartItem) => void;
  updateCartItem: (batchId: string, updates: Partial<CartItem>) => void;
  removeFromCart: (batchId: string) => void;
  clearCart: () => void;
  calculateTotal: () => void;
  processSale: (saleData: any) => Promise<Sale | null>;
  fetchSales: () => Promise<void>;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  cart: [],
  cartTotal: {
    subtotal: 0,
    totalDiscount: 0,
    gstAmount: 0,
    grandTotal: 0,
  },
  sales: [],
  isLoading: false,
  error: null,

  addToCart: (item: CartItem) => {
    const { cart } = get();
    const existingItem = cart.find(i => i.batchId === item.batchId);

    if (existingItem) {
      set({
        cart: cart.map(i =>
          i.batchId === item.batchId
            ? { ...i, quantity: Math.min(i.quantity + 1, i.availableStock) }
            : i
        ),
      });
    } else {
      set({ cart: [...cart, item] });
    }

    get().calculateTotal();
  },

  updateCartItem: (batchId: string, updates: Partial<CartItem>) => {
    const { cart } = get();
    set({
      cart: cart.map(item =>
        item.batchId === batchId ? { ...item, ...updates } : item
      ),
    });
    get().calculateTotal();
  },

  removeFromCart: (batchId: string) => {
    const { cart } = get();
    set({ cart: cart.filter(item => item.batchId !== batchId) });
    get().calculateTotal();
  },

  clearCart: () => {
    set({ cart: [], cartTotal: { subtotal: 0, totalDiscount: 0, gstAmount: 0, grandTotal: 0 } });
  },

  calculateTotal: () => {
    const { cart } = get();

    let subtotal = 0;
    let totalDiscount = 0;
    let gstAmount = 0;

    cart.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemDiscount = (itemSubtotal * item.discount) / 100;
      const afterDiscount = itemSubtotal - itemDiscount;
      const itemGst = (afterDiscount * item.gstRate) / 100;

      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
      gstAmount += itemGst;
    });

    const grandTotal = subtotal - totalDiscount + gstAmount;

    set({
      cartTotal: {
        subtotal,
        totalDiscount,
        gstAmount,
        grandTotal,
      },
    });
  },

  processSale: async (saleData: any) => {
    try {
      set({ isLoading: true, error: null });
      const { cart, cartTotal } = get();

      if (cart.length === 0) {
        throw new Error('Cart is empty');
      }

      // Generate invoice number
      const invoiceNumber = `INV${Date.now()}`;

      const saleItems = cart.map(item => {
        const itemSubtotal = item.quantity * item.unitPrice;
        const itemDiscount = (itemSubtotal * item.discount) / 100;
        const afterDiscount = itemSubtotal - itemDiscount;
        const itemGst = (afterDiscount * item.gstRate) / 100;

        return {
          batchId: item.batchId,
          medicineName: item.medicineName,
          batchNumber: item.batchNumber,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          purchasePrice: item.purchasePrice || 0,
          discount: item.discount,
          gstRate: item.gstRate,
          total: afterDiscount + itemGst,
        };
      });

      const roundOff = Math.round(cartTotal.grandTotal) - cartTotal.grandTotal;

      const sale = {
        invoiceNumber,
        ...saleData,
        subtotal: cartTotal.subtotal,
        discount: cartTotal.totalDiscount,
        gstAmount: cartTotal.gstAmount,
        roundOff,
        grandTotal: cartTotal.grandTotal,
        items: saleItems,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.SALES), sale);

      // Update batch quantities
      for (const item of cart) {
        const batchRef = doc(db, COLLECTIONS.BATCHES, item.batchId);
        await updateDoc(batchRef, {
          quantity: increment(-item.quantity),
          updatedAt: Timestamp.now(),
        });

        // Get medicine ID from batch
        const batchDoc = await getDoc(batchRef);
        if (batchDoc.exists()) {
          const medicineId = batchDoc.data().medicineId;
          const medicineRef = doc(db, COLLECTIONS.MEDICINES, medicineId);
          await updateDoc(medicineRef, {
            totalStock: increment(-item.quantity),
            updatedAt: Timestamp.now(),
          });
        }
      }

      // Update customer stats if customer exists
      if (saleData.customerId) {
        const customerRef = doc(db, COLLECTIONS.CUSTOMERS, saleData.customerId);

        // Calculate loyalty points (10% of grand total as points)
        const loyaltyPointsEarned = Math.floor(cartTotal.grandTotal / 10);

        await updateDoc(customerRef, {
          totalPurchases: increment(1),
          totalSpent: increment(cartTotal.grandTotal),
          loyaltyPoints: increment(loyaltyPointsEarned),
          lastVisit: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }

      set({ isLoading: false });
      return { id: docRef.id, ...sale } as Sale;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  fetchSales: async () => {
    try {
      set({ isLoading: true, error: null });
      const q = query(
        collection(db, COLLECTIONS.SALES),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const sales = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Sale[];

      set({ sales, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
