'use client';

import { useState } from 'react';
import { useSupplierStore } from '@/lib/store/supplierStore';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';

interface AddSupplierFormProps {
  onSuccess?: () => void;
}

export default function AddSupplierForm({ onSuccess }: AddSupplierFormProps) {
  const { addSupplier, isLoading, error } = useSupplierStore();
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: '',
    drugLicense: '',
    contactPerson: '',
    contactPersonPhone: '',
    paymentTerms: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const supplierData = {
      ...formData,
      email: formData.email || undefined,
      gstNumber: formData.gstNumber || undefined,
      drugLicense: formData.drugLicense || undefined,
      paymentTerms: formData.paymentTerms || undefined,
    };

    const success = await addSupplier(supplierData);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Supplier Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="Company Name *"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="Phone Number *"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isLoading}
        />

        <Input
          label="GST Number"
          value={formData.gstNumber}
          onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
          disabled={isLoading}
        />

        <Input
          label="Drug License"
          value={formData.drugLicense}
          onChange={(e) => setFormData({ ...formData, drugLicense: e.target.value })}
          disabled={isLoading}
        />

        <Input
          label="Contact Person *"
          value={formData.contactPerson}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="Contact Person Phone *"
          type="tel"
          value={formData.contactPersonPhone}
          onChange={(e) => setFormData({ ...formData, contactPersonPhone: e.target.value })}
          required
          disabled={isLoading}
        />

        <Input
          label="Payment Terms"
          value={formData.paymentTerms}
          onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
          placeholder="e.g., Net 30, Net 60"
          disabled={isLoading}
        />
      </div>

      <Input
        label="Address *"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        required
        disabled={isLoading}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Add Supplier
        </Button>
      </div>
    </form>
  );
}
