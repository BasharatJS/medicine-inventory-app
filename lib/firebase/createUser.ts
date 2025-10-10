// Helper function to create user document in Firestore
// Run this once from browser console or create a setup page

import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';

export async function createUserDocument(
  uid: string,
  email: string,
  name: string,
  role: 'OWNER' | 'PHARMACIST' | 'CASHIER'
) {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);

    await setDoc(userRef, {
      email,
      name,
      role,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log('User document created successfully!');
    return true;
  } catch (error) {
    console.error('Error creating user document:', error);
    return false;
  }
}

// Example usage:
// createUserDocument('your-uid-here', 'basharat@gmail.com', 'Mohammad Basharat', 'OWNER');
