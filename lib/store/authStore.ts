// Import Zustand for state management
import { create } from 'zustand';
// Import Firebase authentication functions
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
// Import Firestore functions for database operations
import { doc, getDoc } from 'firebase/firestore';
// Import Firebase configuration
import { auth, db } from '@/lib/firebase/config';
// Import Firestore collection names
import { COLLECTIONS } from '@/lib/firebase/collections';
// Import User type definition
import { User } from '@/lib/types';

// Define the structure of authentication state
interface AuthState {
  user: User | null; // Currently logged in user
  isLoading: boolean; // Loading state for auth operations
  error: string | null; // Error message if any
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>; // Login function
  logout: () => Promise<void>; // Logout function
  initAuth: () => void; // Initialize authentication listener
}

// Create Zustand store for authentication management
export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Initial state: no user logged in
  isLoading: true, // Initial state: loading
  error: null, // Initial state: no error

  // Function to login user with email and password
  login: async (email: string, password: string, rememberMe = false) => {
    try {
      set({ isLoading: true, error: null }); // Set loading state

      // Firebase API call: Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Firestore API call: Get user document from 'users' collection
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid));

      // Check if user profile exists in Firestore
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      // Get user data from Firestore document
      const userData = { id: userDoc.id, ...userDoc.data() } as User;

      // Check if user account is active
      if (!userData.isActive) {
        throw new Error('Your account has been deactivated. Please contact administrator.');
      }

      // Update state with user data
      set({ user: userData, isLoading: false });
      return true; // Login successful
    } catch (error: any) {
      set({ error: error.message, isLoading: false }); // Set error state
      return false; // Login failed
    }
  },

  // Function to logout user
  logout: async () => {
    try {
      // Firebase API call: Sign out current user
      await signOut(auth);
      // Clear user state
      set({ user: null, error: null });
    } catch (error: any) {
      set({ error: error.message }); // Set error if logout fails
    }
  },

  // Function to initialize authentication state listener
  initAuth: () => {
    // Firebase API call: Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Firestore API call: Get user profile from database
          const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));
          if (userDoc.exists()) {
            // User profile found, set user state
            const userData = { id: userDoc.id, ...userDoc.data() } as User;
            set({ user: userData, isLoading: false });
          } else {
            // User profile not found, clear state
            set({ user: null, isLoading: false });
          }
        } catch (error) {
          // Error fetching user profile, clear state
          set({ user: null, isLoading: false });
        }
      } else {
        // User is signed out, clear state
        set({ user: null, isLoading: false });
      }
    });

    return unsubscribe; // Return unsubscribe function to cleanup
  },
}));
