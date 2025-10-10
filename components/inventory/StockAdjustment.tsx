'use client';

import { useState } from 'react';
import { useBatchStore } from '@/lib/store/batchStore';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';

interface StockAdjustmentProps {
  batchId: string;
  currentQuantity: number;
  onSuccess?: () => void;
}

export default function StockAdjustment({ batchId, currentQuantity, onSuccess }: StockAdjustmentProps) {
  const { adjustStock, isLoading, error } = useBatchStore();
  const [formData, setFormData] = useState({
    adjustmentType: 'add',
    quantity: '',
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const adjustment = parseInt(formData.quantity);
    const newQuantity = formData.adjustmentType === 'add'
      ? currentQuantity + adjustment
      : currentQuantity - adjustment;

    if (newQuantity < 0) {
      alert('Cannot reduce stock below zero');
      return;
    }

    const success = await adjustStock(batchId, newQuantity, formData.reason);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="text-sm text-slate-600">Current Stock: <span className="font-bold text-slate-900">{currentQuantity}</span></p>
      </div>

      <Select
        label="Adjustment Type"
        value={formData.adjustmentType}
        onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value })}
        options={[
          { value: 'add', label: 'Add Stock' },
          { value: 'remove', label: 'Remove Stock' },
        ]}
        required
        disabled={isLoading}
      />

      <Input
        label="Quantity"
        type="number"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        required
        disabled={isLoading}
      />

      <Input
        label="Reason"
        value={formData.reason}
        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        placeholder="e.g., Damaged, Expired, Returned"
        required
        disabled={isLoading}
      />

      <div className="bg-sky-50 p-4 rounded-lg">
        <p className="text-sm text-slate-600">
          New Stock: <span className="font-bold text-sky-600">
            {formData.quantity ? (
              formData.adjustmentType === 'add'
                ? currentQuantity + parseInt(formData.quantity)
                : currentQuantity - parseInt(formData.quantity)
            ) : currentQuantity}
          </span>
        </p>
      </div>

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        Adjust Stock
      </Button>
    </form>
  );
}
