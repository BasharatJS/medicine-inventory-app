'use client';

import { useState } from 'react';
import { useSupplierStore } from '@/lib/store/supplierStore';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';
import { useAuthStore } from '@/lib/store/authStore';

interface AddPurchaseOrderFormProps {
  supplierId: string;
  supplierName: string;
  onSuccess?: () => void;
}

export default function AddPurchaseOrderForm({ supplierId, supplierName, onSuccess }: AddPurchaseOrderFormProps) {
  const { user } = useAuthStore();
  const { addPurchaseOrder, isLoading, error } = useSupplierStore();
  const [formData, setFormData] = useState({
    expectedDeliveryDate: '',
    totalAmount: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      supplierId,
      supplierName,
      orderDate: new Date(),
      expectedDeliveryDate: formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate) : undefined,
      items: [], // Simplified - in production would have medicine selection
      subtotal: parseFloat(formData.totalAmount),
      gstAmount: parseFloat(formData.totalAmount) * 0.12,
      totalAmount: parseFloat(formData.totalAmount) * 1.12,
      notes: formData.notes || undefined,
      userId: user?.id || '',
      userName: user?.name || '',
    };

    const success = await addPurchaseOrder(orderData);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <Input
        label="Expected Delivery Date"
        type="date"
        value={formData.expectedDeliveryDate}
        onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
        disabled={isLoading}
      />

      <Input
        label="Total Amount (Before GST) *"
        type="number"
        step="0.01"
        value={formData.totalAmount}
        onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
        required
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
          Create Order
        </Button>
      </div>
    </form>
  );
}
