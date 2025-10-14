'use client';

import { useEffect, useState } from 'react';
import { useSupplierStore } from '@/lib/store/supplierStore';
import { Supplier } from '@/lib/types';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import AddPurchaseOrderForm from './AddPurchaseOrderForm';
import AddPaymentForm from './AddPaymentForm';

interface SupplierDetailsProps {
  supplier: Supplier;
}

export default function SupplierDetails({ supplier }: SupplierDetailsProps) {
  const { purchaseOrders, payments, fetchPurchaseOrders, fetchSupplierPayments, isOrdersLoading } = useSupplierStore();
  const [showPOModal, setShowPOModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchPurchaseOrders(supplier.id);
    fetchSupplierPayments(supplier.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier.id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{supplier.name}</h1>
          <p className="text-slate-600 mt-1">{supplier.companyName}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => setShowPOModal(true)} variant="primary" className="w-full sm:w-auto">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Create Purchase Order
          </Button>
          <Button onClick={() => setShowPaymentModal(true)} variant="success" className="w-full sm:w-auto">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Record Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100">
          <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact
          </h3>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-slate-900">{supplier.phone}</p>
            {supplier.email && <p className="text-slate-600 text-xs break-all">{supplier.email}</p>}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100">
          <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Total Orders
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-sky-600">{supplier.totalOrders}</p>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
          <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Total Purchase
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
            ₹{supplier.totalPurchaseAmount.toLocaleString()}
          </p>
        </Card>

        <Card className={`${supplier.outstandingAmount > 0 ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100' : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100'} border`}>
          <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Outstanding
          </h3>
          <p className={`text-2xl sm:text-3xl font-bold ${supplier.outstandingAmount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            ₹{supplier.outstandingAmount.toLocaleString()}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4">Purchase Orders</h2>

        {isOrdersLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : purchaseOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600">No purchase orders</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {purchaseOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 border border-sky-100 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium mb-1">Order #</p>
                      <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                    </div>
                    <Badge variant="info">{order.items.length} items</Badge>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Date:</span>
                      <span className="font-medium text-slate-900">
                        {new Date(order.orderDate.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Amount:</span>
                      <span className="font-bold text-sky-600">
                        ₹{Math.round(order.totalAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-sky-200">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Status</p>
                      <Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'PENDING' ? 'warning' : 'info'}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Payment</p>
                      <Badge variant={order.paymentStatus === 'PAID' ? 'success' : order.paymentStatus === 'UNPAID' ? 'danger' : 'warning'}>
                        {order.paymentStatus}
                      </Badge>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {purchaseOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(order.orderDate.toDate()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="info">{order.items.length} items</Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold text-sky-600">
                        ₹{Math.round(order.totalAmount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'PENDING' ? 'warning' : 'info'}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={order.paymentStatus === 'PAID' ? 'success' : order.paymentStatus === 'UNPAID' ? 'danger' : 'warning'}>
                          {order.paymentStatus}
                        </Badge>
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
        isOpen={showPOModal}
        onClose={() => setShowPOModal(false)}
        title="Create Purchase Order"
        size="lg"
      >
        <AddPurchaseOrderForm
          supplierId={supplier.id}
          supplierName={supplier.name}
          onSuccess={() => {
            setShowPOModal(false);
            fetchPurchaseOrders(supplier.id);
          }}
        />
      </Modal>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Payment"
      >
        <AddPaymentForm
          supplierId={supplier.id}
          supplierName={supplier.name}
          onSuccess={() => {
            setShowPaymentModal(false);
            fetchSupplierPayments(supplier.id);
            fetchPurchaseOrders(supplier.id);
          }}
        />
      </Modal>
    </div>
  );
}
