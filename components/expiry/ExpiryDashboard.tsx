'use client';

import { useEffect, useState } from 'react';
import { useExpiryStore } from '@/lib/store/expiryStore';
import ExpiryList from './ExpiryList';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function ExpiryDashboard() {
  const { fetchExpiringBatches, isLoading } = useExpiryStore();
  const [activeFilter, setActiveFilter] = useState<number>(30);

  useEffect(() => {
    fetchExpiringBatches(activeFilter);
  }, [activeFilter, fetchExpiringBatches]);

  const filters = [
    { label: 'Expired', value: 0, color: 'from-red-500 to-red-600' },
    { label: '30 Days', value: 30, color: 'from-orange-500 to-orange-600' },
    { label: '60 Days', value: 60, color: 'from-amber-500 to-amber-600' },
    { label: '90 Days', value: 90, color: 'from-yellow-500 to-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Expiry Management</h1>
        <p className="text-slate-600 mt-1">Monitor and manage expiring medicines</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`p-4 rounded-xl text-white transition-all ${
              activeFilter === filter.value
                ? `bg-gradient-to-br ${filter.color} scale-105 shadow-lg`
                : 'bg-slate-400 hover:bg-slate-500'
            }`}
          >
            <p className="font-semibold">{filter.label}</p>
            <p className="text-sm opacity-90">
              {filter.value === 0 ? 'Already expired' : `Expiring in ${filter.value} days`}
            </p>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <Card>
          <ExpiryList filter={activeFilter} />
        </Card>
      )}
    </div>
  );
}
