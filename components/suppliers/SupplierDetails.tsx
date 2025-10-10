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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{supplier.name}</h1>
          <p className="text-slate-600 mt-1">{supplier.companyName}</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setShowPOModal(true)} variant="primary">
            Create Purchase Order
          </Button>
          <Button onClick={() => setShowPaymentModal(true)} variant="success">
            Record Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Contact</h3>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-slate-900">{supplier.phone}</p>
            {supplier.email && <p className="text-slate-600">{supplier.email}</p>}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-sky-600">{supplier.totalOrders}</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Total Purchase</h3>
          <p className="text-3xl font-bold text-emerald-600">
            ₹{supplier.totalPurchaseAmount.toLocaleString()}
          </p>
        </Card>

        <Card className={supplier.outstandingAmount > 0 ? 'bg-red-50' : 'bg-emerald-50'}>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Outstanding</h3>
          <p className={`text-3xl font-bold ${supplier.outstandingAmount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            ₹{supplier.outstandingAmount.toLocaleString()}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Purchase Orders</h2>

        {isOrdersLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : purchaseOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600">No purchase orders</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
