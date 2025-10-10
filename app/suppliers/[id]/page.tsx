'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useSupplierStore } from '@/lib/store/supplierStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SupplierDetails from '@/components/suppliers/SupplierDetails';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SupplierDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuthStore();
  const { currentSupplier, fetchSupplierById, isLoading } = useSupplierStore();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      fetchSupplierById(params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (authLoading || !user) {
    return null;
  }

  if (user.role === 'CASHIER') {
    router.push('/dashboard');
    return null;
  }

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : currentSupplier ? (
        <SupplierDetails supplier={currentSupplier} />
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-600">Supplier not found</p>
        </div>
      )}
    </DashboardLayout>
  );
}
