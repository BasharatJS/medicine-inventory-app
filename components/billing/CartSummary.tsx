'use client';

import { useBillingStore } from '@/lib/store/billingStore';
import { useTheme } from '@/lib/contexts/ThemeContext';
import Card from '@/components/shared/Card';

interface CartSummaryProps {
  canApplyDiscount?: boolean;
}

// Cart summary component: Display cart totals (subtotal, discount, GST, grand total)
export default function CartSummary({ canApplyDiscount = false }: CartSummaryProps) {
  const { cart, cartTotal } = useBillingStore();
  const { theme, themeName } = useTheme();

  // UI: Show empty message if no items in cart
  if (cart.length === 0) {
    return (
      <Card>
        <h2 className={`text-xl font-semibold ${theme.content.text} mb-4`}>Summary</h2>
        <p className={`${theme.content.textSecondary} text-center py-8`}>No items in cart</p>
      </Card>
    );
  }

  // Calculate round-off amount (difference between rounded and actual total)
  const roundOff = Math.round(cartTotal.grandTotal) - cartTotal.grandTotal;

  return (
    <Card>
      <h2 className={`text-xl font-semibold ${theme.content.text} mb-4`}>Summary</h2>

      {/* UI: Display cart totals breakdown */}
      <div className="space-y-3">
        <div className={`flex justify-between ${theme.content.textSecondary}`}>
          <span>Subtotal:</span>
          <span className="font-medium">₹{cartTotal.subtotal.toFixed(2)}</span>
        </div>

        {cartTotal.totalDiscount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Total Discount:</span>
            <span className="font-medium">-₹{cartTotal.totalDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className={`flex justify-between ${theme.content.textSecondary}`}>
          <span>GST:</span>
          <span className="font-medium">₹{cartTotal.gstAmount.toFixed(2)}</span>
        </div>

        <div className={`flex justify-between ${theme.content.textSecondary} text-sm`}>
          <span>Round Off:</span>
          <span className={roundOff >= 0 ? 'text-emerald-600' : 'text-red-600'}>
            {roundOff >= 0 ? '+' : ''}₹{roundOff.toFixed(2)}
          </span>
        </div>

        <div className={`pt-3 border-t-2 ${theme.content.cardBorder}`}>
          <div className="flex justify-between items-center">
            <span className={`text-lg font-bold ${theme.content.text}`}>Grand Total:</span>
            <span className={`text-2xl font-bold ${themeName === 'dark' ? 'text-emerald-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-sky-600'}`}>
              ₹{Math.round(cartTotal.grandTotal)}
            </span>
          </div>
        </div>

        <div className={`pt-3 border-t ${theme.content.cardBorder} text-sm ${theme.content.textSecondary} space-y-1`}>
          <div className="flex justify-between">
            <span>Items:</span>
            <span className="font-medium">{cart.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Quantity:</span>
            <span className="font-medium">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
