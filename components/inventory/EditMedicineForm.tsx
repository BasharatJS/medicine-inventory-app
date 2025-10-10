'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMedicineStore } from '@/lib/store/medicineStore';
import { Medicine } from '@/lib/types';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';
import Card from '@/components/shared/Card';

interface EditMedicineFormProps {
  medicine: Medicine;
}

export default function EditMedicineForm({ medicine }: EditMedicineFormProps) {
  const router = useRouter();
  const { updateMedicine, deleteMedicine, isLoading, error } = useMedicineStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: medicine.name,
    genericName: medicine.genericName,
    manufacturer: medicine.manufacturer,
    category: medicine.category,
    dosageForm: medicine.dosageForm || '',
    strength: medicine.strength || '',
    mrp: medicine.mrp.toString(),
    purchasePrice: medicine.purchasePrice?.toString() || '',
    hsnCode: medicine.hsnCode || '',
    rackLocation: medicine.rackLocation,
    minStockQty: medicine.minStockQty.toString(),
  });

  const categories = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drop', 'Powder', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const medicineData = {
      ...formData,
      mrp: parseFloat(formData.mrp),
      purchasePrice: parseFloat(formData.purchasePrice),
      minStockQty: parseInt(formData.minStockQty),
    };

    const success = await updateMedicine(medicine.id, medicineData, imageFile);
    if (success) {
      router.push('/inventory');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this medicine? This action cannot be undone.')) {
      const success = await deleteMedicine(medicine.id);
      if (success) {
        router.push('/inventory');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        {error && <Alert type="error" message={error} className="mb-6" />}

        {medicine.imageUrl && (
          <div className="mb-6">
            <img src={medicine.imageUrl} alt={medicine.name} className="w-32 h-32 object-cover rounded-lg" />
          </div>
        )}

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
            disabled={isLoading}
          />

          <Input
            label="Strength"
            value={formData.strength}
            onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
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
            disabled={isLoading}
          />

          <Input
            label="Rack/Shelf Location *"
            value={formData.rackLocation}
            onChange={(e) => setFormData({ ...formData, rackLocation: e.target.value })}
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Update Medicine Image
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

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Medicine
          </Button>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/inventory')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Update Medicine
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
}
