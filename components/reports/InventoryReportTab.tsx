'use client';

import { useEffect } from 'react';
import { useReportStore } from '@/lib/store/reportStore';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function InventoryReportTab() {
  const { inventoryReport, generateInventoryReport, isLoading } = useReportStore();

  useEffect(() => {
    generateInventoryReport();
  }, [generateInventoryReport]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => generateInventoryReport()} isLoading={isLoading}>
          Refresh Report
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : inventoryReport ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
              <p className="text-sky-100 text-sm">Total Medicines</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">{inventoryReport.totalMedicines}</p>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
              <p className="text-emerald-100 text-sm">Total Stock Value</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">₹{Math.round(inventoryReport.totalStockValue).toLocaleString()}</p>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
              <p className="text-amber-100 text-sm">Low Stock Items</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">{inventoryReport.lowStockItems}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <Card className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
              <p className="text-sm text-slate-600 font-medium">Out of Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600 mt-2">{inventoryReport.outOfStockItems}</p>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
              <p className="text-sm text-slate-600 font-medium">Expired Items</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600 mt-2">{inventoryReport.expiredItems}</p>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <p className="text-sm text-slate-600 font-medium">Expiring in 30 Days</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-2">{inventoryReport.expiringIn30Days}</p>
            </Card>
          </div>

          <Card>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Stock by Category</h3>
            <div className="space-y-3">
              {inventoryReport.stockByCategory.map((category, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-lg">
                  <div>
                    <p className="font-semibold text-slate-900">{category.category}</p>
                    <p className="text-xs sm:text-sm text-slate-600">{category.itemCount} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 text-sm sm:text-base">₹{Math.round(category.stockValue).toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{category.percentage.toFixed(1)}%</p>
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
