'use client';

import { useExpiryStore } from '@/lib/store/expiryStore';
import { useTheme } from '@/lib/contexts/ThemeContext';
import ExpiryBadge from './ExpiryBadge';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';

interface ExpiryListProps {
  filter: number;
}

export default function ExpiryList({ filter }: ExpiryListProps) {
  const { expiringBatches, markAsRemoved } = useExpiryStore();
  const { theme, themeName } = useTheme();

  const getDaysRemaining = (expiryDate: any) => {
    const expiry = expiryDate?.toDate ? expiryDate.toDate() : new Date(expiryDate);
    const now = new Date();
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const filteredBatches = expiringBatches.filter(batch => {
    const days = getDaysRemaining(batch.expiryDate);
    if (filter === 0) return days < 0;
    return days >= 0 && days <= filter;
  });

  const handleMarkAsRemoved = async (batchId: string) => {
    if (confirm('Mark this batch as removed/disposed?')) {
      await markAsRemoved(batchId);
    }
  };

  // Helper function to get table divider color based on theme
  const getDividerColor = () => {
    switch (themeName) {
      case 'dark':
        return 'divide-gray-600';
      case 'green':
        return 'divide-emerald-200';
      case 'purple':
        return 'divide-purple-200';
      case 'amber':
        return 'divide-amber-200';
      default:
        return 'divide-slate-200';
    }
  };

  if (filteredBatches.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className={`w-16 h-16 mx-auto ${themeName === 'dark' ? 'text-emerald-400' : 'text-emerald-500'} mb-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className={`${theme.content.text} font-medium`}>No medicines found</p>
        <p className={`text-sm ${theme.content.textSecondary} mt-1`}>
          {filter === 0 ? 'No expired medicines' : `No medicines expiring in ${filter} days`}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className={`${themeName === 'dark' ? 'bg-gray-700' : themeName === 'green' ? 'bg-emerald-100' : themeName === 'purple' ? 'bg-purple-100' : themeName === 'amber' ? 'bg-amber-100' : 'bg-slate-50'}`}>
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Medicine</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Batch</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Quantity</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Expiry Date</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Status</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Actions</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${getDividerColor()}`}>
          {filteredBatches.map((batch) => {
            const daysRemaining = getDaysRemaining(batch.expiryDate);
            return (
              <tr key={batch.id} className={`${themeName === 'dark' ? 'hover:bg-gray-700' : themeName === 'green' ? 'hover:bg-emerald-50' : themeName === 'purple' ? 'hover:bg-purple-50' : themeName === 'amber' ? 'hover:bg-amber-50' : 'hover:bg-slate-50'}`}>
                <td className="px-6 py-4">
                  <div className={`font-medium ${theme.content.text}`}>{batch.medicineName}</div>
                </td>
                <td className={`px-6 py-4 ${theme.content.textSecondary}`}>{batch.batchNumber}</td>
                <td className="px-6 py-4">
                  <Badge variant={batch.quantity > 0 ? 'info' : 'danger'}>
                    {batch.quantity} units
                  </Badge>
                </td>
                <td className={`px-6 py-4 text-sm ${theme.content.textSecondary}`}>
                  {new Date(batch.expiryDate.toDate()).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <ExpiryBadge daysRemaining={daysRemaining} />
                </td>
                <td className="px-6 py-4">
                  {daysRemaining < 0 && batch.quantity > 0 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleMarkAsRemoved(batch.id)}
                    >
                      Mark as Removed
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
