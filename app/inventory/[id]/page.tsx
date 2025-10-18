'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useMedicineStore } from '@/lib/store/medicineStore';
import { useTheme } from '@/lib/contexts/ThemeContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EditMedicineForm from '@/components/inventory/EditMedicineForm';
import BatchList from '@/components/inventory/BatchList';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function MedicineDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuthStore();
  const { currentMedicine, fetchMedicineById, isLoading } = useMedicineStore();
  const { theme, themeName } = useTheme();
  const [activeTab, setActiveTab] = useState<'details' | 'batches'>('details');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const medicineId = params.id;
    if (medicineId && typeof medicineId === 'string') {
      fetchMedicineById(medicineId);
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

  // Get tab colors based on theme
  const getActiveTabColor = () => {
    switch (themeName) {
      case 'green':
        return 'border-emerald-500 text-emerald-600';
      case 'purple':
        return 'border-purple-500 text-purple-600';
      case 'amber':
        return 'border-amber-500 text-amber-600';
      case 'dark':
        return 'border-gray-400 text-gray-300';
      default: // light
        return 'border-slate-500 text-slate-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : currentMedicine ? (
          <>
            {/* Back Button */}
            <button
              onClick={() => router.push('/inventory')}
              className={`flex items-center gap-2 mb-4 ${theme.content.textSecondary} hover:${theme.content.text} transition-colors cursor-pointer`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium hidden sm:inline">Back to Inventory</span>
            </button>

            <div className="mb-6">
              <h1 className={`text-3xl font-bold ${theme.content.text}`}>{currentMedicine.name}</h1>
              <p className={`${theme.content.textSecondary} mt-1`}>{currentMedicine.genericName}</p>
            </div>

            <div className={`border-b ${theme.content.cardBorder} mb-6`}>
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-4 px-2 border-b-2 transition-colors ${
                    activeTab === 'details'
                      ? `${getActiveTabColor()} font-semibold`
                      : `border-transparent ${theme.content.textSecondary} hover:${theme.content.text}`
                  }`}
                >
                  Medicine Details
                </button>
                <button
                  onClick={() => setActiveTab('batches')}
                  className={`pb-4 px-2 border-b-2 transition-colors ${
                    activeTab === 'batches'
                      ? `${getActiveTabColor()} font-semibold`
                      : `border-transparent ${theme.content.textSecondary} hover:${theme.content.text}`
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
            <p className={theme.content.textSecondary}>Medicine not found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
