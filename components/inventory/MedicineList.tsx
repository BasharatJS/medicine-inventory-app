'use client';

import { useEffect, useState } from 'react';
import { useMedicineStore } from '@/lib/store/medicineStore';
import { useTheme } from '@/lib/contexts/ThemeContext';
import MedicineTable from './MedicineTable';
import MedicineCard from './MedicineCard';
import SearchBar from './SearchBar';
import Button from '@/components/shared/Button';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function MedicineList() {
  const router = useRouter();
  const { medicines, fetchMedicines, isLoading } = useMedicineStore();
  const { theme, themeName } = useTheme();
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

  // Get filter colors based on theme
  const getFilterColors = () => {
    switch (themeName) {
      case 'green':
        return 'focus:ring-emerald-500 focus:border-emerald-500';
      case 'purple':
        return 'focus:ring-purple-500 focus:border-purple-500';
      case 'amber':
        return 'focus:ring-amber-500 focus:border-amber-500';
      case 'dark':
        return 'focus:ring-gray-500 focus:border-gray-500';
      default: // light
        return 'focus:ring-slate-500 focus:border-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${theme.content.text}`}>Medicine Inventory</h1>
          <p className={`${theme.content.textSecondary} mt-1`}>{medicines.length} medicines in stock</p>
        </div>
        <Button onClick={() => router.push('/inventory/add')} variant="primary" className="w-full sm:w-auto">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Medicine
        </Button>
      </div>

      <div className={`${theme.content.cardBg} rounded-xl shadow-sm border ${theme.content.cardBorder} p-4 sm:p-6`}>
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
            className={`px-4 py-2.5 border ${theme.content.cardBorder} rounded-lg focus:ring-2 ${getFilterColors()} h-[42px] text-sm ${theme.content.text} font-medium ${theme.content.cardBg}`}
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
            <p className={theme.content.textSecondary}>No medicines found</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredMedicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  onClick={() => router.push(`/inventory/${medicine.id}`)}
                />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <MedicineTable medicines={filteredMedicines} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
