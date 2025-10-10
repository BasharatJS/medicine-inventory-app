'use client';

import { useEffect, useState } from 'react';
import { useMedicineStore } from '@/lib/store/medicineStore';
import MedicineTable from './MedicineTable';
import SearchBar from './SearchBar';
import Button from '@/components/shared/Button';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function MedicineList() {
  const router = useRouter();
  const { medicines, fetchMedicines, isLoading } = useMedicineStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(medicines.map(m => m.category)))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Medicine Inventory</h1>
          <p className="text-slate-600 mt-1">{medicines.length} medicines in stock</p>
        </div>
        <Button onClick={() => router.push('/inventory/add')} variant="primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Medicine
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by medicine name, generic name, or manufacturer..."
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 h-[42px] text-sm text-slate-900 font-medium"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No medicines found</p>
          </div>
        ) : (
          <MedicineTable medicines={filteredMedicines} />
        )}
      </div>
    </div>
  );
}
