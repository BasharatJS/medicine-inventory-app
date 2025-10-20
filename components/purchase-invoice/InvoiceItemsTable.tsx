'use client';

import { useState } from 'react';
import { PurchaseInvoiceItem, Medicine } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import MedicineAutocomplete from './MedicineAutocomplete';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';

interface InvoiceItemsTableProps {
  items: Partial<PurchaseInvoiceItem>[];
  onUpdateItems: (items: Partial<PurchaseInvoiceItem>[]) => void;
}

export default function InvoiceItemsTable({ items, onUpdateItems }: InvoiceItemsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drop', 'Powder', 'Other'];

  const addNewRow = () => {
    const newItem: Partial<PurchaseInvoiceItem> = {
      tempId: `temp-${Date.now()}`,
      medicineName: '',
      genericName: '',
      manufacturer: '',
      category: 'Tablet',
      batchNumber: '',
      quantity: 1,
      mrp: 0,
      purchasePrice: 0,
      manufacturingDate: Timestamp.now(),
      expiryDate: Timestamp.now(),
      gstRate: 12,
      total: 0,
      isNewMedicine: false,
      rackLocation: '',
    };
    onUpdateItems([...items, newItem]);
    setEditingId(newItem.tempId!);
  };

  const updateItem = (tempId: string, updates: Partial<PurchaseInvoiceItem>) => {
    const updatedItems = items.map((item) => {
      if (item.tempId === tempId) {
        const updated = { ...item, ...updates };
        // Recalculate total
        if (updated.quantity && updated.purchasePrice) {
          updated.total = updated.quantity * updated.purchasePrice;
        }
        return updated;
      }
      return item;
    });
    onUpdateItems(updatedItems);
  };

  const deleteItem = (tempId: string) => {
    onUpdateItems(items.filter((item) => item.tempId !== tempId));
  };

  const handleMedicineSelect = (tempId: string, medicine: Medicine | null) => {
    if (medicine) {
      updateItem(tempId, {
        medicineId: medicine.id,
        medicineName: medicine.name,
        genericName: medicine.genericName,
        manufacturer: medicine.manufacturer,
        category: medicine.category,
        mrp: medicine.mrp,
        purchasePrice: medicine.purchasePrice || 0,
        isNewMedicine: false,
        rackLocation: medicine.rackLocation,
      });
    }
  };

  const formatDate = (timestamp?: Timestamp): string => {
    if (!timestamp) return '';
    return timestamp.toDate().toISOString().split('T')[0];
  };

  const parseDate = (dateStr: string): Timestamp => {
    return Timestamp.fromDate(new Date(dateStr));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Invoice Items ({items.length})</h3>
        <Button type="button" variant="primary" onClick={addNewRow}>
          + Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-4">No items added yet</p>
          <Button type="button" variant="primary" onClick={addNewRow}>
            + Add First Item
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-300 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  #
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider min-w-[200px]">
                  Medicine Name *
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider min-w-[150px]">
                  Generic Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Manufacturer
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Batch No *
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Qty *
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  MRP *
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Purchase Price *
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Mfg Date
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Exp Date *
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  GST %
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Rack
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {items.map((item, index) => (
                <tr key={item.tempId} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-sm text-slate-800">{index + 1}</td>

                  <td className="px-3 py-2">
                    <MedicineAutocomplete
                      value={item.medicineName || ''}
                      onSelect={(medicine) => handleMedicineSelect(item.tempId!, medicine)}
                      onInputChange={(value) => updateItem(item.tempId!, {
                        medicineName: value,
                        isNewMedicine: true // Mark as new if typing manually
                      })}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.genericName || ''}
                      onChange={(e) => updateItem(item.tempId!, { genericName: e.target.value })}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-sky-500"
                      placeholder="Generic name"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.manufacturer || ''}
                      onChange={(e) => updateItem(item.tempId!, { manufacturer: e.target.value })}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-sky-500"
                      placeholder="Manufacturer"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <select
                      value={item.category || 'Other'}
                      onChange={(e) => updateItem(item.tempId!, { category: e.target.value })}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-sky-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.batchNumber || ''}
                      onChange={(e) => updateItem(item.tempId!, { batchNumber: e.target.value })}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-sky-500"
                      placeholder="Batch"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(item.tempId!, { quantity: parseInt(e.target.value) || 0 })}
                      className="w-20 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-sky-500"
                      min="1"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.mrp || ''}
                      onChange={(e) => updateItem(item.tempId!, { mrp: parseFloat(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-sky-500"
                      min="0"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.purchasePrice || ''}
                      onChange={(e) => updateItem(item.tempId!, { purchasePrice: parseFloat(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-sky-500"
                      min="0"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={formatDate(item.manufacturingDate)}
                      onChange={(e) => updateItem(item.tempId!, { manufacturingDate: parseDate(e.target.value) })}
                      className="w-36 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-sky-500"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={formatDate(item.expiryDate)}
                      onChange={(e) => updateItem(item.tempId!, { expiryDate: parseDate(e.target.value) })}
                      className="w-36 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-sky-500"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.gstRate || 12}
                      onChange={(e) => updateItem(item.tempId!, { gstRate: parseFloat(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-sky-500"
                      min="0"
                      max="28"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.rackLocation || ''}
                      onChange={(e) => updateItem(item.tempId!, { rackLocation: e.target.value })}
                      className="w-20 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-sky-500"
                      placeholder="A-1"
                    />
                  </td>

                  <td className="px-3 py-2 text-sm font-medium text-slate-800">
                    ₹{(item.total || 0).toFixed(2)}
                  </td>

                  <td className="px-3 py-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => deleteItem(item.tempId!)}
                    >
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length > 0 && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600">Total Items</p>
              <p className="text-lg font-semibold text-slate-800">{items.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Quantity</p>
              <p className="text-lg font-semibold text-slate-800">
                {items.reduce((sum, item) => sum + (item.quantity || 0), 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Subtotal (Before GST)</p>
              <p className="text-lg font-semibold text-slate-800">
                ₹{items.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">New Medicines</p>
              <p className="text-lg font-semibold text-orange-600">
                {items.filter(item => item.isNewMedicine).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
