'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExpiryStore } from '@/lib/store/expiryStore';
import { useTheme } from '@/lib/contexts/ThemeContext';
import Card from '@/components/shared/Card';
import ExpiryBadge from '@/components/expiry/ExpiryBadge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function ExpiryAlerts() {
  const router = useRouter();
  const { expiringBatches, fetchExpiringBatches, isLoading } = useExpiryStore();
  const { theme, themeName } = useTheme();

  useEffect(() => {
    fetchExpiringBatches(30); // Fetch batches expiring in 30 days
  }, [fetchExpiringBatches]);

  const getDaysRemaining = (expiryDate: any) => {
    const expiry = expiryDate?.toDate ? expiryDate.toDate() : new Date(expiryDate);
    const now = new Date();
    const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Get button colors based on theme
  const getButtonColors = () => {
    switch (themeName) {
      case 'green':
        return 'text-emerald-600 hover:text-emerald-700';
      case 'purple':
        return 'text-purple-600 hover:text-purple-700';
      case 'amber':
        return 'text-amber-600 hover:text-amber-700';
      case 'dark':
        return 'text-gray-300 hover:text-white';
      default: // light
        return 'text-slate-600 hover:text-slate-700';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold ${theme.content.text}`}>Expiry Alerts</h2>
        <button
          onClick={() => router.push('/expiry')}
          className={`text-sm ${getButtonColors()} font-medium`}
        >
          View All
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : expiringBatches.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-emerald-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className={`${theme.content.text} font-medium`}>All Clear!</p>
          <p className={`text-sm ${theme.content.textSecondary} mt-1`}>No medicines expiring soon</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {expiringBatches.map((batch) => {
            const daysRemaining = getDaysRemaining(batch.expiryDate);
            return (
              <div key={batch.id} className={`p-3 rounded-lg border ${theme.content.cardBorder} hover:border-opacity-70 transition-colors`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-medium ${theme.content.text} text-sm`}>{batch.medicineName}</h3>
                  <ExpiryBadge daysRemaining={daysRemaining} />
                </div>
                <div className={`text-xs ${theme.content.textSecondary} space-y-1`}>
                  <p>Batch: {batch.batchNumber}</p>
                  <p>Qty: {batch.quantity} units</p>
                  <p>Expiry: {new Date(batch.expiryDate.toDate()).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
