'use client';

import { useState } from 'react';
import { useSupplierStore } from '@/lib/store/supplierStore';
import { useAuthStore } from '@/lib/store/authStore';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';

interface AddPaymentFormProps {
  supplierId: string;
  supplierName: string;
  onSuccess?: () => void;
}

export default function AddPaymentForm({ supplierId, supplierName, onSuccess }: AddPaymentFormProps) {
  const { user } = useAuthStore();
  const { addSupplierPayment, isLoading, error } = useSupplierStore();
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    referenceNumber: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentData = {
      supplierId,
      supplierName,
      amount: parseFloat(formData.amount),
      paymentDate: new Date(),
      paymentMethod: formData.paymentMethod,
      referenceNumber: formData.referenceNumber || undefined,
      notes: formData.notes || undefined,
      userId: user?.id || '',
      userName: user?.name || '',
    };

    const success = await addSupplierPayment(paymentData);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <Input
        label="Amount *"
        type="number"
        step="0.01"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        required
        disabled={isLoading}
      />

      <Select
        label="Payment Method *"
        value={formData.paymentMethod}
        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
        options={[
          { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
          { value: 'CASH', label: 'Cash' },
          { value: 'CHEQUE', label: 'Cheque' },
          { value: 'UPI', label: 'UPI' },
        ]}
        required
        disabled={isLoading}
      />

      <Input
        label="Reference Number"
        value={formData.referenceNumber}
        onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
        placeholder="Transaction ID / Cheque Number"
        disabled={isLoading}
      />

      <Input
        label="Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        disabled={isLoading}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Record Payment
        </Button>
      </div>
    </form>
  );
}
