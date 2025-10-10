'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useCustomerStore } from '@/lib/store/customerStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CustomerDetails from '@/components/customers/CustomerDetails';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function CustomerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuthStore();
  const { currentCustomer, fetchCustomerById, isLoading } = useCustomerStore();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      fetchCustomerById(params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (authLoading || !user) {
    return null;
  }

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : currentCustomer ? (
        <CustomerDetails customer={currentCustomer} />
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-600">Customer not found</p>
        </div>
      )}
    </DashboardLayout>
  );
}
