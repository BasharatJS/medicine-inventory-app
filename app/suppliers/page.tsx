'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SupplierList from '@/components/suppliers/SupplierList';

export default function SuppliersPage() {
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

  // Only Owner and Pharmacist can access suppliers
  if (user.role === 'CASHIER') {
    router.push('/dashboard');
    return null;
  }

  return (
    <DashboardLayout>
      <SupplierList />
    </DashboardLayout>
  );
}
