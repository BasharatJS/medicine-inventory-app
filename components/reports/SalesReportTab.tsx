'use client';

import { useState } from 'react';
import { useReportStore } from '@/lib/store/reportStore';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SalesReportTab() {
  const { salesReport, generateSalesReport, isLoading } = useReportStore();
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of month
    to: new Date().toISOString().split('T')[0], // Today
  });

  const handleGenerate = () => {
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    endDate.setHours(23, 59, 59, 999);
    generateSalesReport(startDate, endDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <Input
            label="From Date"
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
        </div>
        <div className="flex-1">
          <Input
            label="To Date"
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>
        <Button onClick={handleGenerate} isLoading={isLoading} className="w-full sm:w-auto">
          Generate Report
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : salesReport ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
              <p className="text-emerald-100 text-sm">Total Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">₹{Math.round(salesReport.totalRevenue).toLocaleString()}</p>
            </Card>

            <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
              <p className="text-sky-100 text-sm">Total Transactions</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">{salesReport.totalTransactions}</p>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
              <p className="text-purple-100 text-sm">Avg. Order Value</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">₹{Math.round(salesReport.averageOrderValue)}</p>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
              <p className="text-amber-100 text-sm">Total Profit</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">₹{Math.round(salesReport.totalProfit).toLocaleString()}</p>
            </Card>
          </div>

          <Card>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Top Selling Medicines</h3>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {salesReport.topSellingMedicines.map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-lg p-4">
                  <p className="font-semibold text-slate-900 mb-2">{item.medicineName}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500">Quantity Sold</p>
                      <p className="font-medium text-slate-900">{item.quantitySold}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Revenue</p>
                      <p className="font-bold text-emerald-600">₹{Math.round(item.revenue).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Medicine</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Qty Sold</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {salesReport.topSellingMedicines.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-slate-900">{item.medicineName}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">{item.quantitySold}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-600">
                        ₹{Math.round(item.revenue).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Sales by Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {salesReport.salesByPaymentMethod.map((method, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
                  <p className="text-sm text-slate-600 font-medium">{method.method}</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    ₹{Math.round(method.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {method.count} transactions • {method.percentage.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-600">Click "Generate Report" to view sales analytics</p>
        </div>
      )}
    </div>
  );
}
