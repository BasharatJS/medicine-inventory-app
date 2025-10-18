'use client';

import { useEffect } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useReportStore } from '@/lib/store/reportStore';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function InventoryReportTab() {
  const { theme, themeName } = useTheme();
  const { inventoryReport, generateInventoryReport, isLoading } = useReportStore();

  useEffect(() => {
    generateInventoryReport();
  }, [generateInventoryReport]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => generateInventoryReport()} isLoading={isLoading} className="w-full sm:w-auto text-sm sm:text-base">
          Refresh Report
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : inventoryReport ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border shadow-lg`}>
              <p className={`${theme.content.textSecondary} text-sm`}>Total Medicines</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${themeName === 'dark' ? 'text-sky-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-sky-600'}`}>{inventoryReport.totalMedicines}</p>
            </Card>

            <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border shadow-lg`}>
              <p className={`${theme.content.textSecondary} text-sm`}>Total Stock Value</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${themeName === 'dark' ? 'text-emerald-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-emerald-600'}`}>₹{Math.round(inventoryReport.totalStockValue).toLocaleString()}</p>
            </Card>

            <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border shadow-lg`}>
              <p className={`${theme.content.textSecondary} text-sm`}>Low Stock Items</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${themeName === 'dark' ? 'text-amber-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-amber-600'}`}>{inventoryReport.lowStockItems}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border shadow-lg`}>
              <p className={`text-sm ${theme.content.textSecondary} font-medium`}>Out of Stock</p>
              <p className={`text-xl sm:text-2xl font-bold ${themeName === 'dark' ? 'text-red-400' : 'text-red-600'} mt-2`}>{inventoryReport.outOfStockItems}</p>
            </Card>

            <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border shadow-lg`}>
              <p className={`text-sm ${theme.content.textSecondary} font-medium`}>Expired Items</p>
              <p className={`text-xl sm:text-2xl font-bold ${themeName === 'dark' ? 'text-red-400' : 'text-red-600'} mt-2`}>{inventoryReport.expiredItems}</p>
            </Card>

            <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border shadow-lg`}>
              <p className={`text-sm ${theme.content.textSecondary} font-medium`}>Expiring in 30 Days</p>
              <p className={`text-xl sm:text-2xl font-bold ${themeName === 'dark' ? 'text-amber-400' : 'text-amber-600'} mt-2`}>{inventoryReport.expiringIn30Days}</p>
            </Card>
          </div>

          <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border`}>
            <h3 className={`text-base sm:text-lg font-semibold ${theme.content.text} mb-4`}>Stock by Category</h3>
            <div className="space-y-3">
              {inventoryReport.stockByCategory.map((category, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 sm:p-4 ${themeName === 'dark' ? 'bg-gray-700 border-gray-600' : themeName === 'green' ? 'bg-emerald-50 border-emerald-200' : themeName === 'purple' ? 'bg-purple-50 border-purple-200' : themeName === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-100'} border rounded-lg`}>
                  <div>
                    <p className={`font-semibold ${theme.content.text}`}>{category.category}</p>
                    <p className={`text-xs sm:text-sm ${theme.content.textSecondary}`}>{category.itemCount} items</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm sm:text-base ${themeName === 'dark' ? 'text-emerald-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-emerald-600'}`}>₹{Math.round(category.stockValue).toLocaleString()}</p>
                    <p className={`text-xs ${theme.content.textSecondary}`}>{category.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
