'use client';

import Button from '@/components/shared/Button';

interface InvoicePreviewProps {
  sale: any;
}

export default function InvoicePreview({ sale }: InvoicePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="print:block" id="invoice">
        <div className="text-center border-b-2 border-slate-300 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-slate-900">MediCare Pharmacy</h1>
          <p className="text-sm text-slate-600">123 Medical Street, Healthcare City</p>
          <p className="text-sm text-slate-600">Phone: +91 12345 67890 | GST: 29ABCDE1234F1Z5</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-slate-600">Invoice No:</p>
            <p className="font-semibold">{sale.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Date:</p>
            <p className="font-semibold">{new Date(sale.createdAt.toDate()).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Customer:</p>
            <p className="font-semibold">{sale.customerName}</p>
            {sale.customerPhone && <p className="text-sm">{sale.customerPhone}</p>}
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Payment Method:</p>
            <p className="font-semibold">{sale.paymentMethod}</p>
          </div>
        </div>

        <table className="w-full mb-6">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Medicine</th>
              <th className="px-4 py-2 text-center text-sm font-semibold">Qty</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">Price</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">Disc</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">GST</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 text-sm">{item.medicineName}</td>
                <td className="px-4 py-2 text-center text-sm">{item.quantity}</td>
                <td className="px-4 py-2 text-right text-sm">₹{item.unitPrice}</td>
                <td className="px-4 py-2 text-right text-sm">{item.discount}%</td>
                <td className="px-4 py-2 text-right text-sm">{item.gstRate}%</td>
                <td className="px-4 py-2 text-right text-sm font-semibold">₹{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-medium">₹{sale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Discount:</span>
              <span className="font-medium text-emerald-600">-₹{sale.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">GST:</span>
              <span className="font-medium">₹{sale.gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Round Off:</span>
              <span className="font-medium">₹{sale.roundOff.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 border-slate-300 pt-2">
              <span>Grand Total:</span>
              <span className="text-sky-600">₹{Math.round(sale.grandTotal)}</span>
            </div>
          </div>
        </div>

        <div className="text-center border-t border-slate-300 pt-4 text-sm text-slate-600">
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
