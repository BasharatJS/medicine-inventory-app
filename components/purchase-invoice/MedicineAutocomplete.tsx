'use client';

import { useState, useEffect, useRef } from 'react';
import { useMedicineStore } from '@/lib/store/medicineStore';
import { Medicine } from '@/lib/types';

interface MedicineAutocompleteProps {
  value: string;
  onSelect: (medicine: Medicine | null) => void;
  onInputChange: (value: string) => void;
  disabled?: boolean;
}

export default function MedicineAutocomplete({
  value,
  onSelect,
  onInputChange,
  disabled = false,
}: MedicineAutocompleteProps) {
  const { medicines, fetchMedicines } = useMedicineStore();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  useEffect(() => {
    if (value.trim() === '') {
      setFilteredMedicines([]);
      return;
    }

    const searchTerm = value.toLowerCase();
    const filtered = medicines.filter(
      (med) =>
        med.name.toLowerCase().includes(searchTerm) ||
        med.genericName.toLowerCase().includes(searchTerm) ||
        med.manufacturer.toLowerCase().includes(searchTerm)
    ).slice(0, 10); // Limit to 10 suggestions

    setFilteredMedicines(filtered);
  }, [value, medicines]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onInputChange(newValue);
    setShowSuggestions(true);
  };

  const handleSelect = (medicine: Medicine) => {
    onSelect(medicine);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (filteredMedicines.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        disabled={disabled}
        placeholder="Type to search medicine..."
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed text-sm"
      />

      {showSuggestions && filteredMedicines.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredMedicines.map((medicine) => (
            <div
              key={medicine.id}
              onClick={() => handleSelect(medicine)}
              className="px-3 py-2 hover:bg-sky-50 cursor-pointer border-b border-slate-100 last:border-b-0"
            >
              <div className="font-medium text-slate-800 text-sm">{medicine.name}</div>
              <div className="text-xs text-slate-600">
                {medicine.genericName} | {medicine.manufacturer}
              </div>
              <div className="text-xs text-slate-500">
                MRP: ₹{medicine.mrp} | Purchase: ₹{medicine.purchasePrice}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && value.trim() !== '' && filteredMedicines.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg p-3 text-sm text-slate-600">
          No existing medicine found. This will be added as a new medicine.
        </div>
      )}
    </div>
  );
}
