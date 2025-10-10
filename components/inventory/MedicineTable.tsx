'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Medicine } from '@/lib/types';
import Badge from '@/components/shared/Badge';

interface MedicineTableProps {
  medicines: Medicine[];
}

export default function MedicineTable({ medicines }: MedicineTableProps) {
  const router = useRouter();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const getStockBadge = (stock: number, minStock: number) => {
    if (stock === 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (stock <= minStock) return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Medicine</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">MRP</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {medicines.map((medicine) => (
            <tr
              key={medicine.id}
              className="hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => setExpandedRow(expandedRow === medicine.id ? null : medicine.id)}
            >
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-slate-900">{medicine.name}</div>
                  <div className="text-sm text-slate-500">{medicine.genericName}</div>
                  <div className="text-xs text-slate-400">{medicine.manufacturer}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge variant="info">{medicine.category}</Badge>
              </td>
              <td className="px-6 py-4">
                <div>
                  <div className="font-semibold text-slate-900">{medicine.totalStock || 0}</div>
                  {getStockBadge(medicine.totalStock || 0, medicine.minStockQty)}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{medicine.rackLocation}</td>
              <td className="px-6 py-4 font-medium text-slate-900">₹{medicine.mrp}</td>
              <td className="px-6 py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/inventory/${medicine.id}`);
                  }}
                  className="text-sky-600 hover:text-sky-700 font-medium text-sm"
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
