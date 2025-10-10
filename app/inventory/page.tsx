'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MedicineList from '@/components/inventory/MedicineList';

export default function InventoryPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null;
  }

  // Cashier cannot access inventory
  if (user.role === 'CASHIER') {
    router.push('/dashboard');
    return null;
  }

  return (
    <DashboardLayout>
      <MedicineList />
    </DashboardLayout>
  );
}
