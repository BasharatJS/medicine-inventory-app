'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { usePurchaseInvoiceStore } from '@/lib/store/purchaseInvoiceStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function PurchaseInvoiceListPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const { invoices, fetchInvoices, confirmInvoice, isLoading } = usePurchaseInvoiceStore();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  if (authLoading || !user) {
    return null;
  }

  if (user.role === 'CASHIER') {
    router.push('/dashboard');
    return null;
  }

  const handleConfirmInvoice = async (id: string) => {
    if (confirm('Are you sure you want to confirm this invoice? This will update stock and cannot be undone.')) {
      const success = await confirmInvoice(id);
      if (success) {
        alert('Invoice confirmed and stock updated successfully!');
        fetchInvoices();
      }
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-IN');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      DRAFT: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-slate-100 text-slate-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Purchase Invoices</h1>
            <p className="text-slate-600 mt-1">View and manage all purchase invoices</p>
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={() => router.push('/purchase-invoice')}
          >
            + Create New Invoice
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : invoices.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No purchase invoices found</p>
              <Button
                type="button"
                variant="primary"
                onClick={() => router.push('/purchase-invoice')}
              >
                Create First Invoice
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Invoice No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Invoice Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {invoice.supplierName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatDate(invoice.invoiceDate)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {invoice.items.length} items
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                        ₹{invoice.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {invoice.userName}
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        {invoice.status === 'DRAFT' && (
                          <Button
                            type="button"
                            variant="primary"
                            onClick={() => handleConfirmInvoice(invoice.id)}
                          >
                            Confirm
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            // View details - could implement a detail view page
                            alert('Detail view coming soon!');
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
