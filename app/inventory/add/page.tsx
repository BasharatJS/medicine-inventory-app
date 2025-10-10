'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AddMedicineForm from '@/components/inventory/AddMedicineForm';

export default function AddMedicinePage() {
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

  // Only Owner and Pharmacist can add medicines
  if (user.role === 'CASHIER') {
    router.push('/dashboard');
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Add New Medicine</h1>
        <AddMedicineForm />
      </div>
    </DashboardLayout>
  );
}
