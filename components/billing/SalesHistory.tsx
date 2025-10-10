'use client';

import { useEffect, useState } from 'react';
import { useBillingStore } from '@/lib/store/billingStore';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import InvoicePreview from './InvoicePreview';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SalesHistory() {
  const { sales, fetchSales, isLoading } = useBillingStore();
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt.toDate()).toISOString().split('T')[0];
    return saleDate >= dateFilter.from && saleDate <= dateFilter.to;
  });

  const handleViewInvoice = (sale: any) => {
    setSelectedSale(sale);
    setShowInvoice(true);
  };

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.grandTotal, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Sales History</h1>
        <p className="text-slate-600 mt-1">View and manage past transactions</p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
            <input
              type="date"
              value={dateFilter.from}
              onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
            <input
              type="date"
              value={dateFilter.to}
              onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl mb-6">
          <p className="text-emerald-100 text-sm font-medium">Total Sales (Selected Period)</p>
          <p className="text-3xl font-bold mt-2">₹{Math.round(totalSales).toLocaleString()}</p>
          <p className="text-sm mt-2">{filteredSales.length} transactions</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No sales found for the selected period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{sale.invoiceNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(sale.createdAt.toDate()).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{sale.customerName}</td>
                    <td className="px-6 py-4">
                      <Badge variant="info">{sale.items.length} items</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">{sale.paymentMethod}</Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
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
