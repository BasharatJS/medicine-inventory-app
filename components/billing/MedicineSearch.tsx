'use client';

import { useState, useEffect } from 'react';
import { useMedicineStore } from '@/lib/store/medicineStore';
import { useBatchStore } from '@/lib/store/batchStore';
import { useBillingStore } from '@/lib/store/billingStore';
import SearchBar from '@/components/inventory/SearchBar';
import Badge from '@/components/shared/Badge';

export default function MedicineSearch() {
  const { medicines, fetchMedicines } = useMedicineStore();
  const { batches, fetchBatchesByMedicine } = useBatchStore();
  const { addToCart } = useBillingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  useEffect(() => {
    if (selectedMedicine) {
      fetchBatchesByMedicine(selectedMedicine);
    }
  }, [selectedMedicine, fetchBatchesByMedicine]);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const handleSelectMedicine = (medicineId: string) => {
    setSelectedMedicine(medicineId);
    setShowResults(false);
  };

  const handleAddBatchToCart = (batch: any, medicine: any) => {
    addToCart({
      batchId: batch.id,
      medicineName: medicine.name,
      batchNumber: batch.batchNumber,
      quantity: 1,
      unitPrice: batch.mrp,
      purchasePrice: batch.purchasePrice || medicine.purchasePrice || 0,
      discount: 0,
      gstRate: 12, // Default GST rate
      availableStock: batch.quantity,
    });
    setSearchTerm('');
    setSelectedMedicine(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchBar
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setShowResults(value.length > 0);
          }}
          placeholder="Search medicine by name or generic name..."
        />

        {showResults && filteredMedicines.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {filteredMedicines.map((medicine) => (
              <button
                key={medicine.id}
                onClick={() => handleSelectMedicine(medicine.id)}
                className="w-full p-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
              >
                <div className="font-medium text-slate-900">{medicine.name}</div>
                <div className="text-sm text-slate-600">{medicine.genericName}</div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="info">{medicine.category}</Badge>
                  <span className="text-sm font-semibold text-emerald-600">₹{medicine.mrp}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedMedicine && batches.length > 0 && (
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-800 mb-3">Select Batch (FEFO - First Expiry First Out)</h3>
          <div className="space-y-2">
            {batches
              .filter(b => b.quantity > 0)
              .sort((a, b) => a.expiryDate.toDate().getTime() - b.expiryDate.toDate().getTime())
              .map((batch) => {
                const medicine = medicines.find(m => m.id === selectedMedicine);
                return (
                  <button
                    key={batch.id}
                    onClick={() => medicine && handleAddBatchToCart(batch, medicine)}
                    className="w-full p-3 bg-white rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Batch: {batch.batchNumber}</p>
                        <p className="text-sm text-slate-600">
                          Stock: {batch.quantity} • Expiry: {new Date(batch.expiryDate.toDate()).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-600">₹{batch.mrp}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
