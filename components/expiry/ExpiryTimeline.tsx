'use client';

import { useEffect } from 'react';
import { useExpiryStore } from '@/lib/store/expiryStore';
import ExpiryBadge from './ExpiryBadge';

export default function ExpiryTimeline() {
  const { expiringBatches, fetchExpiringBatches } = useExpiryStore();

  useEffect(() => {
    fetchExpiringBatches(90);
  }, [fetchExpiringBatches]);

  const getDaysRemaining = (expiryDate: any) => {
    const expiry = expiryDate?.toDate ? expiryDate.toDate() : new Date(expiryDate);
    const now = new Date();
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const sortedBatches = [...expiringBatches].sort((a, b) => {
    const daysA = getDaysRemaining(a.expiryDate);
    const daysB = getDaysRemaining(b.expiryDate);
    return daysA - daysB;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Expiry Timeline</h3>
      <div className="space-y-3">
        {sortedBatches.map((batch, index) => {
          const daysRemaining = getDaysRemaining(batch.expiryDate);
          return (
            <div key={batch.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-24">
                <ExpiryBadge daysRemaining={daysRemaining} />
              </div>
              <div className="flex-1 border-l-4 border-slate-200 pl-4 py-2">
                <p className="font-medium text-slate-900">{batch.medicineName}</p>
                <p className="text-sm text-slate-600">
                  Batch {batch.batchNumber} • {batch.quantity} units
                </p>
                <p className="text-xs text-slate-500">
                  Expires: {new Date(batch.expiryDate.toDate()).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
