'use client';

import { useState } from 'react';
import { useBillingStore } from '@/lib/store/billingStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useCustomerStore } from '@/lib/store/customerStore';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';
import Badge from '@/components/shared/Badge';

interface PaymentSectionProps {
  onSaleComplete?: (sale: any) => void;
}

// Payment section: Search customer, select payment method, complete sale
export default function PaymentSection({ onSaleComplete }: PaymentSectionProps) {
  const { user } = useAuthStore();
  const { cart, cartTotal, processSale, isLoading, error } = useBillingStore();
  const { searchCustomerByPhone } = useCustomerStore();
  // Local state: Payment method, customer details, search status
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [customerDetails, setCustomerDetails] = useState({
    customerId: '',
    name: '',
    phone: '',
    prescriptionNo: '',
    loyaltyPoints: 0,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [customerFound, setCustomerFound] = useState(false);

  // Search customer by phone number (validate: min 10 digits)
  const handleSearchCustomer = async () => {
    if (!customerDetails.phone || customerDetails.phone.length < 10) {
      return;
    }

    setIsSearching(true);
    const customer = await searchCustomerByPhone(customerDetails.phone);

    if (customer) {
      setCustomerDetails({
        customerId: customer.id,
        name: customer.name,
        phone: customer.phone,
        prescriptionNo: customerDetails.prescriptionNo,
        loyaltyPoints: customer.loyaltyPoints || 0,
      });
      setCustomerFound(true);
    } else {
      setCustomerFound(false);
      setCustomerDetails({
        ...customerDetails,
        customerId: '',
        name: '',
        loyaltyPoints: 0,
      });
    }
    setIsSearching(false);
  };

  // Process sale: Create sale, update stock, update customer stats, clear cart
  const handleProcessSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    const saleData = {
      customerId: customerDetails.customerId || null,
      customerName: customerDetails.name || 'Walk-in Customer',
      customerPhone: customerDetails.phone || null,
      prescriptionNo: customerDetails.prescriptionNo,
      paymentMethod,
      userId: user?.id || '',
      userName: user?.name || '',
    };

    const sale = await processSale(saleData);
    if (sale && onSaleComplete) {
      onSaleComplete(sale);
      setCustomerDetails({ customerId: '', name: '', phone: '', prescriptionNo: '', loyaltyPoints: 0 });
      setCustomerFound(false);
    }
  };

  const paymentMethods = [
    { value: 'CASH', label: 'Cash', icon: '💵' },
    { value: 'UPI', label: 'UPI', icon: '📱' },
    { value: 'CARD', label: 'Card', icon: '💳' },
  ];

  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Payment</h2>

      {/* UI: Show error alert if sale processing fails */}
      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="space-y-4">
        {/* UI: Customer search by phone (optional for linking sale to customer) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Customer Details (Optional)</label>
          <div className="flex gap-2">
            <Input
              placeholder="Phone Number"
              type="tel"
              value={customerDetails.phone}
              onChange={(e) => {
                setCustomerDetails({ ...customerDetails, phone: e.target.value });
                setCustomerFound(false);
              }}
              disabled={isLoading}
            />
            <Button
              variant="secondary"
              onClick={handleSearchCustomer}
              isLoading={isSearching}
              disabled={isLoading || !customerDetails.phone || customerDetails.phone.length < 10}
            >
              Search
            </Button>
          </div>
        </div>

        {/* UI: Show customer found card with loyalty points */}
        {customerFound && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-emerald-900">{customerDetails.name}</p>
                <p className="text-sm text-emerald-700">Existing Customer</p>
              </div>
              <Badge variant="success">
                {customerDetails.loyaltyPoints} pts
              </Badge>
            </div>
          </div>
        )}

        {/* UI: Show name input for walk-in customer if phone entered but not found */}
        {!customerFound && customerDetails.phone && customerDetails.phone.length >= 10 && (
          <Input
            placeholder="Customer Name (Optional for walk-in)"
            value={customerDetails.name}
            onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
            disabled={isLoading}
          />
        )}

        <Input
          placeholder="Prescription Number"
          value={customerDetails.prescriptionNo}
          onChange={(e) => setCustomerDetails({ ...customerDetails, prescriptionNo: e.target.value })}
          disabled={isLoading}
        />

        {/* UI: Payment method selection (CASH/UPI/CARD) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.value}
                onClick={() => setPaymentMethod(method.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  paymentMethod === method.value
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                disabled={isLoading}
              >
                <div className="text-2xl mb-1">{method.icon}</div>
                <div className="text-sm font-medium">{method.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* UI: Amount to collect and complete sale button */}
        <div className="pt-4 border-t border-slate-200">
          <div className="bg-slate-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Amount to Collect:</span>
              <span className="text-2xl font-bold text-emerald-600">
                ₹{Math.round(cartTotal.grandTotal)}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleProcessSale}
            isLoading={isLoading}
            disabled={cart.length === 0}
          >
            Complete Sale
          </Button>
        </div>
      </div>
    </Card>
  );
}
