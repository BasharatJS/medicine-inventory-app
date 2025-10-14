// Client-side component for Next.js
'use client';

// Import React hooks for state and side effects
import { useEffect, useState } from 'react';
// Import batch store for fetching and managing batches
import { useBatchStore } from '@/lib/store/batchStore';
// Import form component for adding new batches
import AddBatchForm from './AddBatchForm';
// Import shared UI components
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Modal from '@/components/shared/Modal';

// Props interface: medicineId to fetch batches for specific medicine
interface BatchListProps {
  medicineId: string; // ID of medicine to show batches for
}

// Component: Displays list of batches for a medicine with add batch functionality
export default function BatchList({ medicineId }: BatchListProps) {
  // Get batches data and functions from Zustand store
  const { batches, fetchBatchesByMedicine, isLoading } = useBatchStore();
  // Local state for controlling add batch modal visibility
  const [showAddModal, setShowAddModal] = useState(false);

  // Effect: Fetch batches when component mounts or medicineId changes
  useEffect(() => {
    if (medicineId) {
      // API call via store: Fetch batches for this medicine
      fetchBatchesByMedicine(medicineId);
    }
    // Disable exhaustive-deps to prevent infinite loop (fetchBatchesByMedicine is stable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicineId]);

  // Helper function: Calculate days remaining until expiry
  const getDaysRemaining = (expiryDate: any) => {
    // Convert Firestore Timestamp to Date if needed
    const expiry = expiryDate?.toDate ? expiryDate.toDate() : new Date(expiryDate);
    const now = new Date();
    // Calculate difference in days and round up
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Helper function: Return appropriate badge based on days remaining
  const getExpiryBadge = (daysRemaining: number) => {
    if (daysRemaining < 0) return <Badge variant="danger">Expired</Badge>; // Already expired
    if (daysRemaining <= 30) return <Badge variant="danger">{daysRemaining} days</Badge>; // Critical: <30 days
    if (daysRemaining <= 60) return <Badge variant="warning">{daysRemaining} days</Badge>; // Warning: 30-60 days
    if (daysRemaining <= 90) return <Badge variant="warning">{daysRemaining} days</Badge>; // Caution: 60-90 days
    return <Badge variant="success">{daysRemaining} days</Badge>; // Safe: >90 days
  };

  // UI Render: Main component layout
  return (
    <div className="space-y-6">
      {/* Header: Title and Add Batch button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Batches</h2>
        {/* Button: Opens modal to add new batch */}
        <Button onClick={() => setShowAddModal(true)} variant="primary">
          Add New Batch
        </Button>
      </div>

      {/* Conditional Rendering: Loading state */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : batches.length === 0 ? (
        /* Empty State: No batches found */
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-600">No batches found. Add your first batch to manage stock.</p>
        </div>
      ) : (
        /* Table: Display all batches with details */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            {/* Table Header: Column names */}
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
            {/* Table Body: Map through batches array */}
            <tbody className="divide-y divide-slate-200">
              {batches.map((batch) => {
                // Calculate days remaining for expiry badge
                const daysRemaining = getDaysRemaining(batch.expiryDate);
                return (
                  <tr key={batch.id} className="hover:bg-slate-50">
                    {/* Display batch number */}
                    <td className="px-6 py-4 font-medium text-slate-900">{batch.batchNumber}</td>
                    {/* Display quantity in stock */}
                    <td className="px-6 py-4 text-slate-600">{batch.quantity}</td>
                    {/* Display maximum retail price */}
                    <td className="px-6 py-4 text-slate-600">₹{batch.mrp}</td>
                    {/* Display purchase/cost price */}
                    <td className="px-6 py-4 text-slate-600">₹{batch.purchasePrice}</td>
                    {/* Display expiry date with color-coded badge */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-600">
                          {new Date(batch.expiryDate.toDate()).toLocaleDateString()}
                        </span>
                        {/* Badge: Shows expiry status (expired/warning/safe) */}
                        {getExpiryBadge(daysRemaining)}
                      </div>
                    </td>
                    {/* Display supplier name */}
                    <td className="px-6 py-4 text-slate-600">{batch.supplierName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Add new batch form */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Batch"
      >
        {/* Form Component: Handles batch creation */}
        <AddBatchForm
          medicineId={medicineId}
          onSuccess={() => {
            setShowAddModal(false); // Close modal on success
            fetchBatchesByMedicine(medicineId); // Refresh batch list
          }}
        />
      </Modal>
    </div>
  );
}
