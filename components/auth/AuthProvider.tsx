'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

// Auth provider: Initialize Firebase auth listener on app mount
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initAuth } = useAuthStore();

  // useEffect: Start listening to Firebase auth state changes on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <>{children}</>;
}
