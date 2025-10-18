'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Medicine } from '@/lib/types';
import { useTheme } from '@/lib/contexts/ThemeContext';
import Badge from '@/components/shared/Badge';

interface MedicineTableProps {
  medicines: Medicine[];
}

export default function MedicineTable({ medicines }: MedicineTableProps) {
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const getStockBadge = (stock: number, minStock: number) => {
    if (stock === 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (stock <= minStock) return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
  };

  // Get table header background based on theme
  const getHeaderBg = () => {
    switch (themeName) {
      case 'green':
        return 'bg-emerald-50';
      case 'purple':
        return 'bg-purple-50';
      case 'amber':
        return 'bg-amber-50';
      case 'dark':
        return 'bg-gray-700';
      default: // light
        return 'bg-slate-50';
    }
  };

  // Get hover background based on theme
  const getHoverBg = () => {
    switch (themeName) {
      case 'green':
        return 'hover:bg-emerald-50';
      case 'purple':
        return 'hover:bg-purple-50';
      case 'amber':
        return 'hover:bg-amber-50';
      case 'dark':
        return 'hover:bg-gray-700';
      default: // light
        return 'hover:bg-slate-50';
    }
  };

  // Get button color based on theme
  const getButtonColor = () => {
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

  // Get divider color based on theme
  const getDividerColor = () => {
    switch (themeName) {
      case 'green':
        return 'divide-emerald-200';
      case 'purple':
        return 'divide-purple-200';
      case 'amber':
        return 'divide-amber-200';
      case 'dark':
        return 'divide-gray-700';
      default: // light
        return 'divide-slate-200';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className={getHeaderBg()}>
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase tracking-wider`}>Medicine</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase tracking-wider`}>Category</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase tracking-wider`}>Stock</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase tracking-wider`}>Location</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase tracking-wider`}>MRP</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase tracking-wider`}>Actions</th>
          </tr>
        </thead>
        <tbody className={`${theme.content.cardBg} divide-y ${getDividerColor()}`}>
          {medicines.map((medicine) => (
            <tr
              key={medicine.id}
              className={`${getHoverBg()} cursor-pointer transition-colors`}
              onClick={() => setExpandedRow(expandedRow === medicine.id ? null : medicine.id)}
            >
              <td className="px-6 py-4">
                <div>
                  <div className={`font-medium ${theme.content.text}`}>{medicine.name}</div>
                  <div className={`text-sm ${theme.content.textSecondary}`}>{medicine.genericName}</div>
                  <div className={`text-xs ${theme.content.textSecondary} opacity-75`}>{medicine.manufacturer}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge variant="info">{medicine.category}</Badge>
              </td>
              <td className="px-6 py-4">
                <div>
                  <div className={`font-semibold ${theme.content.text}`}>{medicine.totalStock || 0}</div>
                  {getStockBadge(medicine.totalStock || 0, medicine.minStockQty)}
                </div>
              </td>
              <td className={`px-6 py-4 text-sm ${theme.content.textSecondary}`}>{medicine.rackLocation}</td>
              <td className={`px-6 py-4 font-medium ${theme.content.text}`}>₹{medicine.mrp}</td>
              <td className="px-6 py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/inventory/${medicine.id}`);
                  }}
                  className={`${getButtonColor()} font-medium text-sm cursor-pointer hover:underline transition-all`}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
