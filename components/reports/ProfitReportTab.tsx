'use client';

import { useState } from 'react';
import { useReportStore } from '@/lib/store/reportStore';
import { useAuthStore } from '@/lib/store/authStore';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Alert from '@/components/shared/Alert';

export default function ProfitReportTab() {
  const { user } = useAuthStore();
  const { profitReport, generateProfitReport, isLoading } = useReportStore();
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  // Only Owner can view profit reports
  if (user?.role !== 'OWNER') {
    return <Alert type="warning" message="Only Owner can view profit reports" />;
  }

  const handleGenerate = () => {
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    endDate.setHours(23, 59, 59, 999);
    generateProfitReport(startDate, endDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <Input
          label="From Date"
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
        />
        <Input
          label="To Date"
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
        />
        <Button onClick={handleGenerate} isLoading={isLoading}>
          Generate Report
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : profitReport ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white">
              <p className="text-sky-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">₹{Math.round(profitReport.totalRevenue).toLocaleString()}</p>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <p className="text-red-100 text-sm">Total Cost</p>
              <p className="text-3xl font-bold mt-2">₹{Math.round(profitReport.totalCost).toLocaleString()}</p>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <p className="text-emerald-100 text-sm">Gross Profit</p>
              <p className="text-3xl font-bold mt-2">₹{Math.round(profitReport.grossProfit).toLocaleString()}</p>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <p className="text-purple-100 text-sm">Profit Margin</p>
              <p className="text-3xl font-bold mt-2">{profitReport.profitMargin.toFixed(1)}%</p>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Most Profitable Medicines</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Medicine</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Revenue</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Cost</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Profit</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {profitReport.topProfitableMedicines.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-slate-900">{item.medicineName}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        ₹{Math.round(item.revenue).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">
                        ₹{Math.round(item.cost).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-600">
                        ₹{Math.round(item.profit).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-purple-600">
                        {item.profitMargin.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-600">Click "Generate Report" to view profit analysis</p>
        </div>
      )}
    </div>
  );
}
