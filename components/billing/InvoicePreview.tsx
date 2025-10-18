'use client';

import { useTheme } from '@/lib/contexts/ThemeContext';
import Button from '@/components/shared/Button';

interface InvoicePreviewProps {
  sale: any;
}

export default function InvoicePreview({ sale }: InvoicePreviewProps) {
  const { theme, themeName } = useTheme();
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="print:block" id="invoice">
        <div className={`text-center border-b-2 ${theme.content.cardBorder} pb-4 mb-4`}>
          <h1 className={`text-2xl font-bold ${theme.content.text}`}>MediCare Pharmacy</h1>
          <p className={`text-sm ${theme.content.textSecondary}`}>123 Medical Street, Healthcare City</p>
          <p className={`text-sm ${theme.content.textSecondary}`}>Phone: +91 12345 67890 | GST: 29ABCDE1234F1Z5</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className={`text-sm ${theme.content.textSecondary}`}>Invoice No:</p>
            <p className={`font-semibold ${theme.content.text}`}>{sale.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className={`text-sm ${theme.content.textSecondary}`}>Date:</p>
            <p className={`font-semibold ${theme.content.text}`}>{new Date(sale.createdAt.toDate()).toLocaleString()}</p>
          </div>
          <div>
            <p className={`text-sm ${theme.content.textSecondary}`}>Customer:</p>
            <p className={`font-semibold ${theme.content.text}`}>{sale.customerName}</p>
            {sale.customerPhone && <p className={`text-sm ${theme.content.text}`}>{sale.customerPhone}</p>}
          </div>
          <div className="text-right">
            <p className={`text-sm ${theme.content.textSecondary}`}>Payment Method:</p>
            <p className={`font-semibold ${theme.content.text}`}>{sale.paymentMethod}</p>
          </div>
        </div>

        <table className="w-full mb-6">
          <thead className={`${themeName === 'dark' ? 'bg-gray-700' : themeName === 'green' ? 'bg-emerald-100' : themeName === 'purple' ? 'bg-purple-100' : themeName === 'amber' ? 'bg-amber-100' : 'bg-slate-100'}`}>
            <tr>
              <th className={`px-4 py-2 text-left text-sm font-semibold ${theme.content.text}`}>Medicine</th>
              <th className={`px-4 py-2 text-center text-sm font-semibold ${theme.content.text}`}>Qty</th>
              <th className={`px-4 py-2 text-right text-sm font-semibold ${theme.content.text}`}>Price</th>
              <th className={`px-4 py-2 text-right text-sm font-semibold ${theme.content.text}`}>Disc</th>
              <th className={`px-4 py-2 text-right text-sm font-semibold ${theme.content.text}`}>GST</th>
              <th className={`px-4 py-2 text-right text-sm font-semibold ${theme.content.text}`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item: any, index: number) => (
              <tr key={index} className={`border-b ${theme.content.cardBorder}`}>
                <td className={`px-4 py-2 text-sm ${theme.content.text}`}>{item.medicineName}</td>
                <td className={`px-4 py-2 text-center text-sm ${theme.content.text}`}>{item.quantity}</td>
                <td className={`px-4 py-2 text-right text-sm ${theme.content.text}`}>₹{item.unitPrice}</td>
                <td className={`px-4 py-2 text-right text-sm ${theme.content.text}`}>{item.discount}%</td>
                <td className={`px-4 py-2 text-right text-sm ${theme.content.text}`}>{item.gstRate}%</td>
                <td className={`px-4 py-2 text-right text-sm font-semibold ${theme.content.text}`}>₹{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className={theme.content.textSecondary}>Subtotal:</span>
              <span className={`font-medium ${theme.content.text}`}>₹{sale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={theme.content.textSecondary}>Discount:</span>
              <span className="font-medium text-emerald-600">-₹{sale.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={theme.content.textSecondary}>GST:</span>
              <span className={`font-medium ${theme.content.text}`}>₹{sale.gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={theme.content.textSecondary}>Round Off:</span>
              <span className={`font-medium ${theme.content.text}`}>₹{sale.roundOff.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between text-lg font-bold border-t-2 ${theme.content.cardBorder} pt-2`}>
              <span className={theme.content.text}>Grand Total:</span>
              <span className={`${themeName === 'dark' ? 'text-emerald-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-sky-600'}`}>₹{Math.round(sale.grandTotal)}</span>
            </div>
          </div>
        </div>

        <div className={`text-center border-t ${theme.content.cardBorder} pt-4 text-sm ${theme.content.textSecondary}`}>
          <p>Thank you for your purchase!</p>
          <p className="text-xs mt-2">This is a computer-generated invoice. Sold by: {sale.userName}</p>
        </div>
      </div>

      <div className="print:hidden flex justify-end space-x-4">
        <Button variant="primary" onClick={handlePrint}>
          Print Invoice
        </Button>
      </div>
    </div>
  );
}
