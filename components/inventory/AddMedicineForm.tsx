'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMedicineStore } from '@/lib/store/medicineStore';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';
import Card from '@/components/shared/Card';

// Form to add new medicine to inventory with image upload
export default function AddMedicineForm() {
  const router = useRouter();
  const { addMedicine, isLoading, error } = useMedicineStore();
  // Local state: Image file and form data
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    category: 'Tablet',
    dosageForm: '',
    strength: '',
    mrp: '',
    purchasePrice: '',
    hsnCode: '',
    rackLocation: '',
    minStockQty: '10',
  });

  const categories = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drop', 'Powder', 'Other'];

  // Submit form: Parse numbers, upload image, create medicine, redirect to inventory
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const medicineData = {
      ...formData,
      mrp: parseFloat(formData.mrp),
      purchasePrice: parseFloat(formData.purchasePrice),
      minStockQty: parseInt(formData.minStockQty),
    };

    const success = await addMedicine(medicineData, imageFile);
    if (success) {
      router.push('/inventory');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        {/* UI: Show error alert if medicine creation fails */}
        {error && <Alert type="error" message={error} className="mb-6" />}

        {/* UI: Medicine details form grid (2 columns on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Medicine Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={isLoading}
          />

          <Input
            label="Generic/Salt Name *"
            value={formData.genericName}
            onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
            required
            disabled={isLoading}
          />

          <Input
            label="Manufacturer/Company *"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            required
            disabled={isLoading}
          />

          <Select
            label="Category *"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categories.map(cat => ({ value: cat, label: cat }))}
            required
            disabled={isLoading}
          />

          <Input
            label="Dosage Form"
            value={formData.dosageForm}
            onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
            placeholder="e.g., Film-coated tablet"
            disabled={isLoading}
          />

          <Input
            label="Strength"
            value={formData.strength}
            onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
            placeholder="e.g., 500mg"
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
            label="HSN Code"
            value={formData.hsnCode}
            onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
            placeholder="For GST"
            disabled={isLoading}
          />

          <Input
            label="Rack/Shelf Location *"
            value={formData.rackLocation}
            onChange={(e) => setFormData({ ...formData, rackLocation: e.target.value })}
            placeholder="e.g., A-12"
            required
            disabled={isLoading}
          />

          <Input
            label="Minimum Stock Quantity *"
            type="number"
            value={formData.minStockQty}
            onChange={(e) => setFormData({ ...formData, minStockQty: e.target.value })}
            required
            disabled={isLoading}
          />

          {/* UI: Image upload field (optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Medicine Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* UI: Form action buttons (Cancel / Add Medicine) */}
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/inventory')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Add Medicine
          </Button>
        </div>
      </Card>
    </form>
  );
}
