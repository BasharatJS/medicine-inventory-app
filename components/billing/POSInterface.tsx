'use client';

import { useState } from 'react';
import { useBillingStore } from '@/lib/store/billingStore';
import { useAuthStore } from '@/lib/store/authStore';
import MedicineSearch from './MedicineSearch';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import PaymentSection from './PaymentSection';
import InvoicePreview from './InvoicePreview';
import Card from '@/components/shared/Card';
import Modal from '@/components/shared/Modal';

export default function POSInterface() {
  const { user } = useAuthStore();
  const { cart, clearCart } = useBillingStore();
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);

  const handleSaleComplete = (sale: any) => {
    setLastSale(sale);
    setShowInvoice(true);
    clearCart();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Point of Sale</h1>
        <p className="text-slate-600 mt-1">Process sales and generate invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Search Medicine</h2>
            <MedicineSearch />
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Cart Items ({cart.length})
            </h2>
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-slate-600">Cart is empty</p>
                <p className="text-sm text-slate-500 mt-1">Search and add medicines to start billing</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <CartItem key={item.batchId} item={item} />
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <CartSummary canApplyDiscount={user?.role === 'OWNER' || user?.role === 'PHARMACIST'} />
          <PaymentSection onSaleComplete={handleSaleComplete} />
        </div>
      </div>

      <Modal
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
        title="Invoice"
        size="lg"
      >
        {lastSale && <InvoicePreview sale={lastSale} />}
      </Modal>
    </div>
  );
}
