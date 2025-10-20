'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useSupplierStore } from '@/lib/store/supplierStore';
import { usePurchaseInvoiceStore } from '@/lib/store/purchaseInvoiceStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';
import CSVUploader from '@/components/purchase-invoice/CSVUploader';
import OCRImageUploader from '@/components/purchase-invoice/OCRImageUploader';
import InvoiceItemsTable from '@/components/purchase-invoice/InvoiceItemsTable';
import { PurchaseInvoiceItem } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { OCRResult } from '@/lib/services/ocrService';

export default function BulkPurchaseInvoicePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const { createInvoice, confirmInvoice, isLoading, error, clearError } = usePurchaseInvoiceStore();

  const [invoiceImageFile, setInvoiceImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    supplierId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    discount: '0',
    notes: '',
  });

  const [items, setItems] = useState<Partial<PurchaseInvoiceItem>[]>([]);
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Only Owner and Pharmacist can create purchase invoices
  if (authLoading || !user) {
    return null;
  }

  if (user.role === 'CASHIER') {
    router.push('/dashboard');
    return null;
  }

  const handleCSVDataParsed = (parsedItems: Partial<PurchaseInvoiceItem>[]) => {
    setItems([...items, ...parsedItems]);
  };

  const handleOCRDataExtracted = (data: OCRResult['parsedData']) => {
    if (!data) return;

    // Update form data if invoice info extracted
    if (data.invoiceNumber) {
      setFormData(prev => ({ ...prev, invoiceNumber: data.invoiceNumber || '' }));
    }
    if (data.invoiceDate) {
      // Convert date format if needed
      setFormData(prev => ({ ...prev, invoiceDate: data.invoiceDate || prev.invoiceDate }));
    }

    // Add extracted items
    if (data.items && data.items.length > 0) {
      setItems([...items, ...data.items]);
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const discount = parseFloat(formData.discount) || 0;
    const gstAmount = items.reduce((sum, item) => {
      const itemTotal = item.total || 0;
      const gstRate = item.gstRate || 0;
      return sum + (itemTotal * gstRate / 100);
    }, 0);
    const totalAmount = subtotal + gstAmount - discount;

    return { subtotal, gstAmount, totalAmount, discount };
  };

  const validateForm = (): string | null => {
    if (!formData.invoiceNumber.trim()) {
      return 'Invoice number is required';
    }

    if (!formData.supplierId) {
      return 'Please select a supplier';
    }

    if (items.length === 0) {
      return 'Please add at least one item';
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.medicineName?.trim()) {
        return `Row ${i + 1}: Medicine name is required`;
      }
      if (!item.batchNumber?.trim()) {
        return `Row ${i + 1}: Batch number is required`;
      }
      if (!item.quantity || item.quantity <= 0) {
        return `Row ${i + 1}: Valid quantity is required`;
      }
      if (!item.mrp || item.mrp <= 0) {
        return `Row ${i + 1}: Valid MRP is required`;
      }
      if (!item.purchasePrice || item.purchasePrice <= 0) {
        return `Row ${i + 1}: Valid purchase price is required`;
      }
      if (!item.expiryDate) {
        return `Row ${i + 1}: Expiry date is required`;
      }
    }

    return null;
  };

  const handleSaveInvoice = async (asDraft: boolean) => {
    clearError();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    const selectedSupplier = suppliers.find(s => s.id === formData.supplierId);
    if (!selectedSupplier) {
      alert('Selected supplier not found');
      return;
    }

    const totals = calculateTotals();

    const invoiceData = {
      invoiceNumber: formData.invoiceNumber.trim(),
      supplierId: formData.supplierId,
      supplierName: selectedSupplier.name,
      invoiceDate: Timestamp.fromDate(new Date(formData.invoiceDate)),
      items: items as PurchaseInvoiceItem[],
      subtotal: totals.subtotal,
      gstAmount: totals.gstAmount,
      totalAmount: totals.totalAmount,
      discount: totals.discount,
      status: asDraft ? 'DRAFT' as const : 'CONFIRMED' as const,
      notes: formData.notes.trim() || undefined,
      userId: user.id,
      userName: user.name,
    };

    const invoiceId = await createInvoice(invoiceData, invoiceImageFile || undefined);

    if (invoiceId) {
      // If saving as confirmed, execute the confirmation process
      if (!asDraft) {
        const confirmed = await confirmInvoice(invoiceId);
        if (confirmed) {
          alert('Purchase invoice created and confirmed! Stock has been updated.');
          router.push('/inventory');
        }
      } else {
        alert('Purchase invoice saved as draft');
        router.push('/purchase-invoice/list');
      }
    }
  };

  const totals = calculateTotals();
  const selectedSupplier = suppliers.find(s => s.id === formData.supplierId);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Bulk Purchase Invoice</h1>
            <p className="text-slate-600 mt-1">Create purchase invoice with multiple items</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/inventory')}
          >
            ← Back
          </Button>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Invoice Header Information */}
        <Card>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Invoice Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Invoice Number *"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              placeholder="INV-001"
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Supplier *
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.filter(s => s.isActive).map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name} - {supplier.companyName}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Invoice Date *"
              type="date"
              value={formData.invoiceDate}
              onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
              required
            />

            <Input
              label="Discount (₹)"
              type="number"
              step="0.01"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              placeholder="0.00"
            />

            <div className="md:col-span-2">
              <Input
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
              />
            </div>
          </div>

          {/* Invoice Image Upload */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Invoice Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setInvoiceImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
            />
            <p className="text-xs text-slate-500 mt-1">Upload a photo or scan of the physical invoice for reference</p>
          </div>
        </Card>

        {/* OCR Image Upload Section - AI Powered */}
        <Card>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">🤖 AI-Powered Invoice Scanner (OCR)</h2>
          <OCRImageUploader onDataExtracted={handleOCRDataExtracted} />
        </Card>

        {/* CSV/Excel Upload Section */}
        <Card>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">📊 Import Items from CSV/Excel</h2>
          <CSVUploader onDataParsed={handleCSVDataParsed} />
        </Card>

        {/* Items Table */}
        <Card>
          <InvoiceItemsTable items={items} onUpdateItems={setItems} />
        </Card>

        {/* Summary and Actions */}
        {items.length > 0 && (
          <Card>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Invoice Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">Subtotal (Before GST):</span>
                  <span className="font-semibold text-slate-800">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">GST Amount:</span>
                  <span className="font-semibold text-slate-800">₹{totals.gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">Discount:</span>
                  <span className="font-semibold text-red-600">- ₹{totals.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-slate-300">
                  <span className="text-lg font-semibold text-slate-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-sky-600">₹{totals.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-slate-700 mb-3">Invoice Details</h3>
                <p className="text-sm text-slate-600">
                  <strong>Supplier:</strong> {selectedSupplier?.name || 'Not selected'}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Total Items:</strong> {items.length}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Total Quantity:</strong> {items.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>New Medicines:</strong> {items.filter(item => item.isNewMedicine).length}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleSaveInvoice(true)}
                isLoading={isLoading && saveAsDraft}
                disabled={isLoading}
              >
                💾 Save as Draft
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setSaveAsDraft(false);
                  handleSaveInvoice(false);
                }}
                isLoading={isLoading && !saveAsDraft}
                disabled={isLoading}
              >
                ✓ Confirm & Update Stock
              </Button>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> When you click "Confirm & Update Stock", the following will happen:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 space-y-1">
                <li>New medicines will be added to inventory</li>
                <li>Batches will be created for all items</li>
                <li>Stock quantities will be updated automatically</li>
                <li>Supplier outstanding amount will be updated</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
