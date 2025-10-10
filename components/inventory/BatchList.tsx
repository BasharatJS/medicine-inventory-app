'use client';

import { useEffect, useState } from 'react';
import { useBatchStore } from '@/lib/store/batchStore';
import AddBatchForm from './AddBatchForm';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Modal from '@/components/shared/Modal';

interface BatchListProps {
  medicineId: string;
}

export default function BatchList({ medicineId }: BatchListProps) {
  const { batches, fetchBatchesByMedicine, isLoading } = useBatchStore();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchBatchesByMedicine(medicineId);
  }, [medicineId, fetchBatchesByMedicine]);

  const getDaysRemaining = (expiryDate: any) => {
    const expiry = expiryDate?.toDate ? expiryDate.toDate() : new Date(expiryDate);
    const now = new Date();
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getExpiryBadge = (daysRemaining: number) => {
    if (daysRemaining < 0) return <Badge variant="danger">Expired</Badge>;
    if (daysRemaining <= 30) return <Badge variant="danger">{daysRemaining} days</Badge>;
    if (daysRemaining <= 60) return <Badge variant="warning">{daysRemaining} days</Badge>;
    if (daysRemaining <= 90) return <Badge variant="warning">{daysRemaining} days</Badge>;
    return <Badge variant="success">{daysRemaining} days</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Batches</h2>
        <Button onClick={() => setShowAddModal(true)} variant="primary">
          Add New Batch
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : batches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-600">No batches found. Add your first batch to manage stock.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Batch Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">MRP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Purchase Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {batches.map((batch) => {
                const daysRemaining = getDaysRemaining(batch.expiryDate);
                return (
                  <tr key={batch.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{batch.batchNumber}</td>
                    <td className="px-6 py-4 text-slate-600">{batch.quantity}</td>
                    <td className="px-6 py-4 text-slate-600">₹{batch.mrp}</td>
                    <td className="px-6 py-4 text-slate-600">₹{batch.purchasePrice}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-600">
                          {new Date(batch.expiryDate.toDate()).toLocaleDateString()}
                        </span>
                        {getExpiryBadge(daysRemaining)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{batch.supplierName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Batch"
      >
        <AddBatchForm
          medicineId={medicineId}
          onSuccess={() => {
            setShowAddModal(false);
            fetchBatchesByMedicine(medicineId);
          }}
        />
      </Modal>
    </div>
  );
}
