'use client';

import { useState, useEffect } from 'react';
import { useMedicineStore } from '@/lib/store/medicineStore';
import { useBatchStore } from '@/lib/store/batchStore';
import { useBillingStore } from '@/lib/store/billingStore';
import { useTheme } from '@/lib/contexts/ThemeContext';
import SearchBar from '@/components/inventory/SearchBar';
import Badge from '@/components/shared/Badge';

// Medicine search component for POS: Search medicine and add batch to cart (FEFO)
export default function MedicineSearch() {
  const { medicines, fetchMedicines } = useMedicineStore();
  const { batches, fetchBatchesByMedicine } = useBatchStore();
  const { addToCart } = useBillingStore();
  const { theme, themeName } = useTheme();
  // Local state: Search term, dropdown visibility, selected medicine ID
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);

  // useEffect: Fetch all medicines on component mount
  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  // useEffect: Fetch batches when a medicine is selected
  useEffect(() => {
    if (selectedMedicine) {
      fetchBatchesByMedicine(selectedMedicine);
    }
  }, [selectedMedicine, fetchBatchesByMedicine]);

  // Filter medicines by search term (name or generic name), limit to 5 results
  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  // Handle medicine selection: Set selected medicine and hide dropdown
  const handleSelectMedicine = (medicineId: string) => {
    setSelectedMedicine(medicineId);
    setShowResults(false);
  };

  // Add selected batch to cart with default quantity=1 and GST=12%
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
      {/* UI: Search input for medicine name/generic name */}
      <div className="relative">
        <SearchBar
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setShowResults(value.length > 0);
          }}
          placeholder="Search medicine by name or generic name..."
        />

        {/* UI: Dropdown showing filtered medicine results */}
        {showResults && filteredMedicines.length > 0 && (
          <div className={`absolute z-10 w-full mt-2 ${theme.content.cardBg} border ${theme.content.cardBorder} rounded-lg shadow-lg max-h-80 overflow-y-auto`}>
            {filteredMedicines.map((medicine) => (
              <button
                key={medicine.id}
                onClick={() => handleSelectMedicine(medicine.id)}
                className={`w-full p-4 text-left ${themeName === 'dark' ? 'hover:bg-gray-700' : themeName === 'green' ? 'hover:bg-emerald-50' : themeName === 'purple' ? 'hover:bg-purple-50' : themeName === 'amber' ? 'hover:bg-amber-50' : 'hover:bg-slate-50'} transition-colors border-b ${theme.content.cardBorder} last:border-0`}
              >
                <div className={`font-medium ${theme.content.text}`}>{medicine.name}</div>
                <div className={`text-sm ${theme.content.textSecondary}`}>{medicine.genericName}</div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="info">{medicine.category}</Badge>
                  <span className="text-sm font-semibold text-emerald-600">₹{medicine.mrp}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* UI: Batch selection (FEFO - First Expiry First Out) sorted by expiry date */}
      {selectedMedicine && batches.length > 0 && (
        <div className={`${themeName === 'dark' ? 'bg-gray-700' : themeName === 'green' ? 'bg-emerald-50' : themeName === 'purple' ? 'bg-purple-50' : themeName === 'amber' ? 'bg-amber-50' : 'bg-slate-50'} p-4 rounded-lg`}>
          <h3 className={`font-semibold ${theme.content.text} mb-3`}>Select Batch (FEFO - First Expiry First Out)</h3>
          <div className="space-y-2">
            {/* Filter batches with quantity > 0, sort by expiry date (earliest first) */}
            {batches
              .filter(b => b.quantity > 0)
              .sort((a, b) => a.expiryDate.toDate().getTime() - b.expiryDate.toDate().getTime())
              .map((batch) => {
                const medicine = medicines.find(m => m.id === selectedMedicine);
                return (
                  <button
                    key={batch.id}
                    onClick={() => medicine && handleAddBatchToCart(batch, medicine)}
                    className={`w-full p-3 ${theme.content.cardBg} rounded-lg border ${theme.content.cardBorder} ${themeName === 'dark' ? 'hover:border-gray-500 hover:bg-gray-600' : themeName === 'green' ? 'hover:border-emerald-500 hover:bg-emerald-100' : themeName === 'purple' ? 'hover:border-purple-500 hover:bg-purple-100' : themeName === 'amber' ? 'hover:border-amber-500 hover:bg-amber-100' : 'hover:border-slate-500 hover:bg-slate-100'} transition-colors text-left`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${theme.content.text}`}>Batch: {batch.batchNumber}</p>
                        <p className={`text-sm ${theme.content.textSecondary}`}>
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
