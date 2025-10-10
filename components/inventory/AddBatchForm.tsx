'use client';

import { useState } from 'react';
import { useBatchStore } from '@/lib/store/batchStore';
import { useMedicineStore } from '@/lib/store/medicineStore';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';

interface AddBatchFormProps {
  medicineId: string;
  onSuccess?: () => void;
}

export default function AddBatchForm({ medicineId, onSuccess }: AddBatchFormProps) {
  const { addBatch, isLoading, error } = useBatchStore();
  const { currentMedicine } = useMedicineStore();
  const [formData, setFormData] = useState({
    batchNumber: '',
    quantity: '',
    mrp: currentMedicine?.mrp.toString() || '',
    purchasePrice: currentMedicine?.purchasePrice?.toString() || '',
    manufacturingDate: '',
    expiryDate: '',
    supplierName: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const batchData = {
      batchNumber: formData.batchNumber,
      medicineId,
      medicineName: currentMedicine?.name || '',
      quantity: parseInt(formData.quantity),
      mrp: parseFloat(formData.mrp),
      purchasePrice: parseFloat(formData.purchasePrice),
      manufacturingDate: new Date(formData.manufacturingDate),
      expiryDate: new Date(formData.expiryDate),
      supplierName: formData.supplierName,
      purchaseDate: new Date(formData.purchaseDate),
    };

    const success = await addBatch(batchData);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Batch Number *"
          value={formData.batchNumber}
          onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="Quantity *"
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="MRP (₹) *"
          type="number"
          step="0.01"
          value={formData.mrp}
          onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="Purchase Price (₹) *"
          type="number"
          step="0.01"
          value={formData.purchasePrice}
          onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="Manufacturing Date *"
          type="date"
          value={formData.manufacturingDate}
          onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="Expiry Date *"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="Supplier Name *"
          value={formData.supplierName}
          onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="Purchase Date *"
          type="date"
          value={formData.purchaseDate}
          onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Add Batch
        </Button>
      </div>
    </form>
  );
}
