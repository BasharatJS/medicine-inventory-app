'use client';

import { useEffect, useState } from 'react';
import { useBillingStore } from '@/lib/store/billingStore';
import { useTheme } from '@/lib/contexts/ThemeContext';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import InvoicePreview from './InvoicePreview';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

type QuickFilterType = 'today' | 'last7days' | 'last30days' | 'alltime' | 'custom';

export default function SalesHistory() {
  const { sales, fetchSales, isLoading } = useBillingStore();
  const { theme, themeName } = useTheme();
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [activeFilter, setActiveFilter] = useState<QuickFilterType>('today');
  const [dateFilter, setDateFilter] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleQuickFilter = (filterType: QuickFilterType) => {
    setActiveFilter(filterType);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    switch (filterType) {
      case 'today':
        setDateFilter({ from: todayStr, to: todayStr });
        break;
      case 'last7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        setDateFilter({
          from: sevenDaysAgo.toISOString().split('T')[0],
          to: todayStr
        });
        break;
      case 'last30days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        setDateFilter({
          from: thirtyDaysAgo.toISOString().split('T')[0],
          to: todayStr
        });
        break;
      case 'alltime':
        // Set to very old date to get all sales
        setDateFilter({
          from: '2020-01-01',
          to: todayStr
        });
        break;
    }
  };

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt.toDate()).toISOString().split('T')[0];
    return saleDate >= dateFilter.from && saleDate <= dateFilter.to;
  });

  const handleViewInvoice = (sale: any) => {
    setSelectedSale(sale);
    setShowInvoice(true);
  };

  // Helper function to get table divider color based on theme
  const getDividerColor = () => {
    switch (themeName) {
      case 'dark':
        return 'divide-gray-600';
      case 'green':
        return 'divide-emerald-200';
      case 'purple':
        return 'divide-purple-200';
      case 'amber':
        return 'divide-amber-200';
      default:
        return 'divide-slate-200';
    }
  };

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.grandTotal, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl sm:text-3xl font-bold ${theme.content.text}`}>Sales History</h1>
        <p className={`${theme.content.textSecondary} mt-1`}>View and manage past transactions</p>
      </div>

      <Card>
        {/* Quick Filter Buttons */}
        <div className="mb-6">
          <label className={`block text-sm font-medium ${theme.content.text} mb-3`}>Quick Filters</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => handleQuickFilter('today')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                activeFilter === 'today'
                  ? themeName === 'dark'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : themeName === 'green'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : themeName === 'purple'
                    ? 'bg-purple-600 text-white shadow-md'
                    : themeName === 'amber'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-sky-600 text-white shadow-md'
                  : themeName === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : themeName === 'green'
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : themeName === 'purple'
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : themeName === 'amber'
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📅 Today
            </button>
            <button
              onClick={() => handleQuickFilter('last7days')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                activeFilter === 'last7days'
                  ? themeName === 'dark'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : themeName === 'green'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : themeName === 'purple'
                    ? 'bg-purple-600 text-white shadow-md'
                    : themeName === 'amber'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-sky-600 text-white shadow-md'
                  : themeName === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : themeName === 'green'
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : themeName === 'purple'
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : themeName === 'amber'
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📊 Last 7 Days
            </button>
            <button
              onClick={() => handleQuickFilter('last30days')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                activeFilter === 'last30days'
                  ? themeName === 'dark'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : themeName === 'green'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : themeName === 'purple'
                    ? 'bg-purple-600 text-white shadow-md'
                    : themeName === 'amber'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-sky-600 text-white shadow-md'
                  : themeName === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : themeName === 'green'
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : themeName === 'purple'
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : themeName === 'amber'
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📈 Last 30 Days
            </button>
            <button
              onClick={() => handleQuickFilter('alltime')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                activeFilter === 'alltime'
                  ? themeName === 'dark'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : themeName === 'green'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : themeName === 'purple'
                    ? 'bg-purple-600 text-white shadow-md'
                    : themeName === 'amber'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-sky-600 text-white shadow-md'
                  : themeName === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : themeName === 'green'
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : themeName === 'purple'
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : themeName === 'amber'
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🌍 All Time
            </button>
          </div>
        </div>

        {/* Custom Date Range */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className={`block text-sm font-medium ${theme.content.text}`}>Custom Date Range</label>
            {activeFilter !== 'custom' && (
              <button
                onClick={() => setActiveFilter('custom')}
                className={`text-sm font-medium ${themeName === 'dark' ? 'text-emerald-400 hover:text-emerald-300' : themeName === 'green' ? 'text-emerald-600 hover:text-emerald-700' : themeName === 'purple' ? 'text-purple-600 hover:text-purple-700' : themeName === 'amber' ? 'text-amber-600 hover:text-amber-700' : 'text-sky-600 hover:text-sky-700'}`}
              >
                Use Custom Range
              </button>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className={`block text-xs ${theme.content.textSecondary} mb-1`}>From Date</label>
              <input
                type="date"
                value={dateFilter.from}
                onChange={(e) => {
                  setDateFilter({ ...dateFilter, from: e.target.value });
                  setActiveFilter('custom');
                }}
                className={`w-full px-4 py-2 border ${theme.content.cardBorder} ${theme.content.cardBg} ${theme.content.text} rounded-lg focus:ring-2 ${themeName === 'dark' ? 'focus:ring-emerald-500 focus:border-emerald-500' : themeName === 'green' ? 'focus:ring-emerald-500 focus:border-emerald-500' : themeName === 'purple' ? 'focus:ring-purple-500 focus:border-purple-500' : themeName === 'amber' ? 'focus:ring-amber-500 focus:border-amber-500' : 'focus:ring-sky-500 focus:border-sky-500'}`}
              />
            </div>
            <div className="flex-1">
              <label className={`block text-xs ${theme.content.textSecondary} mb-1`}>To Date</label>
              <input
                type="date"
                value={dateFilter.to}
                onChange={(e) => {
                  setDateFilter({ ...dateFilter, to: e.target.value });
                  setActiveFilter('custom');
                }}
                className={`w-full px-4 py-2 border ${theme.content.cardBorder} ${theme.content.cardBg} ${theme.content.text} rounded-lg focus:ring-2 ${themeName === 'dark' ? 'focus:ring-emerald-500 focus:border-emerald-500' : themeName === 'green' ? 'focus:ring-emerald-500 focus:border-emerald-500' : themeName === 'purple' ? 'focus:ring-purple-500 focus:border-purple-500' : themeName === 'amber' ? 'focus:ring-amber-500 focus:border-amber-500' : 'focus:ring-sky-500 focus:border-sky-500'}`}
              />
            </div>
          </div>
        </div>

        <div className={`${themeName === 'dark' ? 'bg-gradient-to-br from-emerald-700 to-emerald-800' : themeName === 'green' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : themeName === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : themeName === 'amber' ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-emerald-500 to-emerald-600'} text-white p-6 rounded-xl mb-6`}>
          <p className={`${themeName === 'dark' ? 'text-emerald-200' : themeName === 'green' ? 'text-emerald-100' : themeName === 'purple' ? 'text-purple-100' : themeName === 'amber' ? 'text-amber-100' : 'text-emerald-100'} text-sm font-medium`}>Total Sales (Selected Period)</p>
          <p className="text-3xl font-bold mt-2">₹{Math.round(totalSales).toLocaleString()}</p>
          <p className="text-sm mt-2">{filteredSales.length} transactions</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center py-12">
            <p className={theme.content.textSecondary}>No sales found for the selected period</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredSales.map((sale) => (
                <div
                  key={sale.id}
                  className={`${themeName === 'dark' ? 'bg-gray-700 border-gray-600' : themeName === 'green' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200' : themeName === 'purple' ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200' : themeName === 'amber' ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'} border rounded-xl p-4 hover:shadow-md transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className={`text-xs ${theme.content.textSecondary} uppercase font-medium mb-1`}>Invoice</p>
                      <p className={`font-semibold ${theme.content.text}`}>{sale.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${theme.content.textSecondary} mb-1`}>Date</p>
                      <p className={`text-xs ${theme.content.textSecondary}`}>
                        {new Date(sale.createdAt.toDate()).toLocaleDateString()}
                      </p>
                      <p className={`text-xs ${theme.content.textSecondary}`}>
                        {new Date(sale.createdAt.toDate()).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between items-center">
                      <span className={theme.content.textSecondary}>Customer:</span>
                      <span className={`font-medium ${theme.content.text}`}>{sale.customerName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.content.textSecondary}>Items:</span>
                      <Badge variant="info">{sale.items.length} items</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.content.textSecondary}>Payment:</span>
                      <Badge variant="success">{sale.paymentMethod}</Badge>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between pt-3 border-t ${theme.content.cardBorder}`}>
                    <div>
                      <p className={`text-xs ${theme.content.textSecondary} mb-1`}>Total Amount</p>
                      <p className={`text-xl font-bold ${themeName === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ₹{Math.round(sale.grandTotal).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewInvoice(sale)}
                    >
                      View Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className={`${themeName === 'dark' ? 'bg-gray-700' : themeName === 'green' ? 'bg-emerald-100' : themeName === 'purple' ? 'bg-purple-100' : themeName === 'amber' ? 'bg-amber-100' : 'bg-slate-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Invoice</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Date</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Customer</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Items</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Payment</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Amount</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${getDividerColor()}`}>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className={`${themeName === 'dark' ? 'hover:bg-gray-700' : themeName === 'green' ? 'hover:bg-emerald-50' : themeName === 'purple' ? 'hover:bg-purple-50' : themeName === 'amber' ? 'hover:bg-amber-50' : 'hover:bg-slate-50'}`}>
                      <td className={`px-6 py-4 font-medium ${theme.content.text}`}>{sale.invoiceNumber}</td>
                      <td className={`px-6 py-4 text-sm ${theme.content.textSecondary}`}>
                        {new Date(sale.createdAt.toDate()).toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 text-sm ${theme.content.textSecondary}`}>{sale.customerName}</td>
                      <td className="px-6 py-4">
                        <Badge variant="info">{sale.items.length} items</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="success">{sale.paymentMethod}</Badge>
                      </td>
                      <td className={`px-6 py-4 font-semibold ${themeName === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ₹{Math.round(sale.grandTotal)}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleViewInvoice(sale)}
                        >
                          View Invoice
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      <Modal
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
        title="Invoice"
        size="lg"
      >
        {selectedSale && <InvoicePreview sale={selectedSale} />}
      </Modal>
    </div>
  );
}
