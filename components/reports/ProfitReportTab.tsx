'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useReportStore } from '@/lib/store/reportStore';
import { useAuthStore } from '@/lib/store/authStore';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Alert from '@/components/shared/Alert';

export default function ProfitReportTab() {
  const { theme, themeName } = useTheme();
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1 min-w-0">
          <Input
            label="From Date"
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            label="To Date"
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>
        <Button onClick={handleGenerate} isLoading={isLoading} className="w-full sm:w-auto whitespace-nowrap text-sm sm:text-base">
          Generate Report
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : profitReport ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border shadow-lg`}>
              <p className={`${theme.content.textSecondary} text-sm`}>Total Revenue</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${themeName === 'dark' ? 'text-sky-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-sky-600'}`}>₹{Math.round(profitReport.totalRevenue).toLocaleString()}</p>
            </Card>

            <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border shadow-lg`}>
              <p className={`${theme.content.textSecondary} text-sm`}>Total Cost</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${themeName === 'dark' ? 'text-red-400' : 'text-red-600'}`}>₹{Math.round(profitReport.totalCost).toLocaleString()}</p>
            </Card>

            <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border shadow-lg`}>
              <p className={`${theme.content.textSecondary} text-sm`}>Gross Profit</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${themeName === 'dark' ? 'text-emerald-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-emerald-600'}`}>₹{Math.round(profitReport.grossProfit).toLocaleString()}</p>
            </Card>

            <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border shadow-lg`}>
              <p className={`${theme.content.textSecondary} text-sm`}>Profit Margin</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${themeName === 'dark' ? 'text-purple-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-purple-600'}`}>{profitReport.profitMargin.toFixed(1)}%</p>
            </Card>
          </div>

          <Card className={`${themeName === 'dark' ? 'bg-gray-800 border-gray-700' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border`}>
            <h3 className={`text-base sm:text-lg font-semibold ${theme.content.text} mb-4`}>Most Profitable Medicines</h3>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {profitReport.topProfitableMedicines.map((item, idx) => (
                <div key={idx} className={`${themeName === 'dark' ? 'bg-gray-700 border-gray-600' : themeName === 'green' ? 'bg-emerald-50 border-emerald-200' : themeName === 'purple' ? 'bg-purple-50 border-purple-200' : themeName === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-purple-50 border-purple-100'} border rounded-lg p-4`}>
                  <p className={`font-semibold ${theme.content.text} mb-3`}>{item.medicineName}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className={`text-xs ${theme.content.textSecondary}`}>Revenue</p>
                      <p className={`font-medium ${theme.content.text}`}>₹{Math.round(item.revenue).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme.content.textSecondary}`}>Cost</p>
                      <p className={`font-medium ${themeName === 'dark' ? 'text-red-400' : 'text-red-600'}`}>₹{Math.round(item.cost).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme.content.textSecondary}`}>Profit</p>
                      <p className={`font-bold ${themeName === 'dark' ? 'text-emerald-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-emerald-600'}`}>₹{Math.round(item.profit).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme.content.textSecondary}`}>Margin</p>
                      <p className={`font-bold ${themeName === 'dark' ? 'text-purple-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-purple-600'}`}>{item.profitMargin.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className={`${themeName === 'dark' ? 'bg-gray-700/50' : themeName === 'green' ? 'bg-emerald-50' : themeName === 'purple' ? 'bg-purple-50' : themeName === 'amber' ? 'bg-amber-50' : 'bg-slate-50'}`}>
                  <tr>
                    <th className={`px-4 py-2 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Medicine</th>
                    <th className={`px-4 py-2 text-right text-xs font-medium ${theme.content.textSecondary} uppercase`}>Revenue</th>
                    <th className={`px-4 py-2 text-right text-xs font-medium ${theme.content.textSecondary} uppercase`}>Cost</th>
                    <th className={`px-4 py-2 text-right text-xs font-medium ${theme.content.textSecondary} uppercase`}>Profit</th>
                    <th className={`px-4 py-2 text-right text-xs font-medium ${theme.content.textSecondary} uppercase`}>Margin</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${themeName === 'dark' ? 'divide-gray-700' : themeName === 'green' ? 'divide-emerald-200' : themeName === 'purple' ? 'divide-purple-200' : themeName === 'amber' ? 'divide-amber-200' : 'divide-slate-200'}`}>
                  {profitReport.topProfitableMedicines.map((item, idx) => (
                    <tr key={idx}>
                      <td className={`px-4 py-3 text-sm ${theme.content.text}`}>{item.medicineName}</td>
                      <td className={`px-4 py-3 text-sm text-right font-medium ${theme.content.text}`}>
                        ₹{Math.round(item.revenue).toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right ${themeName === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                        ₹{Math.round(item.cost).toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-semibold ${themeName === 'dark' ? 'text-emerald-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        ₹{Math.round(item.profit).toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-medium ${themeName === 'dark' ? 'text-purple-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-purple-600'}`}>
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
          <p className={theme.content.textSecondary}>Click "Generate Report" to view profit analysis</p>
        </div>
      )}
    </div>
  );
}
