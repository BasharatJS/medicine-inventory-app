'use client';

import { useBillingStore } from '@/lib/store/billingStore';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { CartItem as CartItemType } from '@/lib/types';

interface CartItemProps {
  item: CartItemType;
}

// Cart item component: Display and edit cart item (quantity, discount, price calculation)
export default function CartItem({ item }: CartItemProps) {
  const { updateCartItem, removeFromCart } = useBillingStore();
  const { theme, themeName } = useTheme();

  // Update cart item quantity (validate: > 0 and <= availableStock)
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.availableStock) {
      updateCartItem(item.batchId, { quantity: newQuantity });
    }
  };

  // Update cart item discount percentage (validate: 0-100%)
  const handleDiscountChange = (newDiscount: number) => {
    if (newDiscount >= 0 && newDiscount <= 100) {
      updateCartItem(item.batchId, { discount: newDiscount });
    }
  };

  // Calculate item totals: subtotal → discount → GST → final total
  const subtotal = item.quantity * item.unitPrice;
  const discountAmount = (subtotal * item.discount) / 100;
  const afterDiscount = subtotal - discountAmount;
  const gstAmount = (afterDiscount * item.gstRate) / 100;
  const total = afterDiscount + gstAmount;

  return (
    <div className={`p-4 ${themeName === 'dark' ? 'bg-gray-700' : themeName === 'green' ? 'bg-emerald-50' : themeName === 'purple' ? 'bg-purple-50' : themeName === 'amber' ? 'bg-amber-50' : 'bg-slate-50'} rounded-lg`}>
      {/* UI: Medicine name, batch number, and remove button */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`font-semibold ${theme.content.text}`}>{item.medicineName}</h3>
          <p className={`text-sm ${theme.content.textSecondary}`}>Batch: {item.batchNumber}</p>
        </div>
        <button
          onClick={() => removeFromCart(item.batchId)}
          className="text-red-600 hover:text-red-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* UI: Editable fields - Quantity, Unit Price (readonly), Discount */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className={`text-xs ${theme.content.textSecondary} block mb-1`}>Quantity</label>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            min="1"
            max={item.availableStock}
            className={`w-full px-3 py-1.5 border ${theme.content.cardBorder} ${theme.content.cardBg} ${theme.content.text} rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
          />
          <p className={`text-xs ${theme.content.textSecondary} mt-1`}>Max: {item.availableStock}</p>
        </div>

        <div>
          <label className={`text-xs ${theme.content.textSecondary} block mb-1`}>Unit Price</label>
          <p className={`px-3 py-1.5 ${themeName === 'dark' ? 'bg-gray-600' : themeName === 'green' ? 'bg-emerald-100' : themeName === 'purple' ? 'bg-purple-100' : themeName === 'amber' ? 'bg-amber-100' : 'bg-slate-100'} rounded-lg text-sm font-medium ${theme.content.text}`}>₹{item.unitPrice}</p>
        </div>

        <div>
          <label className={`text-xs ${theme.content.textSecondary} block mb-1`}>Discount (%)</label>
          <input
            type="number"
            value={item.discount}
            onChange={(e) => handleDiscountChange(parseFloat(e.target.value))}
            min="0"
            max="100"
            step="0.1"
            className={`w-full px-3 py-1.5 border ${theme.content.cardBorder} ${theme.content.cardBg} ${theme.content.text} rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
          />
        </div>
      </div>

      {/* UI: Price breakdown - Subtotal, Discount, GST, Total */}
      <div className={`border-t ${theme.content.cardBorder} pt-3 space-y-1 text-sm`}>
        <div className={`flex justify-between ${theme.content.textSecondary}`}>
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {item.discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount ({item.discount}%):</span>
            <span>-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className={`flex justify-between ${theme.content.textSecondary}`}>
          <span>GST ({item.gstRate}%):</span>
          <span>₹{gstAmount.toFixed(2)}</span>
        </div>
        <div className={`flex justify-between font-bold ${theme.content.text} pt-2 border-t ${theme.content.cardBorder}`}>
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
