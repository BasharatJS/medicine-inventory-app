'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useMedicineStore } from '@/lib/store/medicineStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EditMedicineForm from '@/components/inventory/EditMedicineForm';
import BatchList from '@/components/inventory/BatchList';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function MedicineDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuthStore();
  const { currentMedicine, fetchMedicineById, isLoading } = useMedicineStore();
  const [activeTab, setActiveTab] = useState<'details' | 'batches'>('details');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      fetchMedicineById(params.id);
    }
  }, [params.id, fetchMedicineById]);

  if (authLoading || !user) {
    return null;
  }

  if (user.role === 'CASHIER') {
    router.push('/dashboard');
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : currentMedicine ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-800">{currentMedicine.name}</h1>
              <p className="text-slate-600 mt-1">{currentMedicine.genericName}</p>
            </div>

            <div className="border-b border-slate-200 mb-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-4 px-2 border-b-2 transition-colors ${
                    activeTab === 'details'
                      ? 'border-sky-500 text-sky-600 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Medicine Details
                </button>
                <button
                  onClick={() => setActiveTab('batches')}
                  className={`pb-4 px-2 border-b-2 transition-colors ${
                    activeTab === 'batches'
                      ? 'border-sky-500 text-sky-600 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Batch Management
                </button>
              </div>
            </div>

            {activeTab === 'details' ? (
              <EditMedicineForm medicine={currentMedicine} />
            ) : (
              <BatchList medicineId={currentMedicine.id} />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">Medicine not found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
