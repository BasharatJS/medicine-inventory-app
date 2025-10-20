'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';
import { PurchaseInvoiceItem } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

interface CSVUploaderProps {
  onDataParsed: (items: Partial<PurchaseInvoiceItem>[]) => void;
}

export default function CSVUploader({ onDataParsed }: CSVUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseDate = (dateStr: string): Timestamp => {
    // Support multiple date formats: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
    if (!dateStr) return Timestamp.now();

    const parts = dateStr.split(/[\/\-]/);
    let date: Date;

    if (parts.length === 3) {
      // Check if format is DD/MM/YYYY or DD-MM-YYYY
      if (parseInt(parts[0]) > 12) {
        date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      } else if (parseInt(parts[2]) > 31) {
        // YYYY-MM-DD format
        date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else {
        // MM/DD/YYYY format
        date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
      }
    } else {
      date = new Date(dateStr);
    }

    return Timestamp.fromDate(date);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      parseCSV(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parseExcel(file);
    } else {
      setError('Please upload a CSV or Excel file');
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const items = processData(results.data as any[]);
          onDataParsed(items);
          setSuccess(`Successfully parsed ${items.length} items from CSV`);
          if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err: any) {
          setError(err.message);
        }
      },
      error: (error) => {
        setError(`CSV parsing error: ${error.message}`);
      },
    });
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const items = processData(jsonData as any[]);
        onDataParsed(items);
        setSuccess(`Successfully parsed ${items.length} items from Excel`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        setError(`Excel parsing error: ${err.message}`);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsArrayBuffer(file);
  };

  const processData = (data: any[]): Partial<PurchaseInvoiceItem>[] => {
    if (data.length === 0) {
      throw new Error('File is empty');
    }

    const items: Partial<PurchaseInvoiceItem>[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      // Validate required fields
      if (!row.medicineName && !row['Medicine Name'] && !row['medicine_name']) {
        throw new Error(`Row ${i + 1}: Medicine name is required`);
      }

      // Support multiple column name formats
      const medicineName = row.medicineName || row['Medicine Name'] || row['medicine_name'];
      const batchNumber = row.batchNumber || row['Batch Number'] || row['batch_number'] || `BATCH-${Date.now()}-${i}`;
      const quantity = parseInt(row.quantity || row['Quantity'] || '0');
      const mrp = parseFloat(row.mrp || row['MRP'] || row['Mrp'] || '0');
      const purchasePrice = parseFloat(row.purchasePrice || row['Purchase Price'] || row['purchase_price'] || '0');
      const manufacturingDate = row.manufacturingDate || row['Manufacturing Date'] || row['mfg_date'] || '';
      const expiryDate = row.expiryDate || row['Expiry Date'] || row['expiry_date'] || '';
      const genericName = row.genericName || row['Generic Name'] || row['generic_name'] || '';
      const manufacturer = row.manufacturer || row['Manufacturer'] || row['manufacturer'] || '';
      const category = row.category || row['Category'] || row['category'] || 'Other';
      const gstRate = parseFloat(row.gstRate || row['GST Rate'] || row['gst_rate'] || '12');
      const rackLocation = row.rackLocation || row['Rack Location'] || row['rack_location'] || '';

      if (quantity <= 0) {
        throw new Error(`Row ${i + 1}: Invalid quantity`);
      }

      if (mrp <= 0) {
        throw new Error(`Row ${i + 1}: Invalid MRP`);
      }

      if (purchasePrice <= 0) {
        throw new Error(`Row ${i + 1}: Invalid purchase price`);
      }

      const total = purchasePrice * quantity;

      items.push({
        tempId: `temp-${Date.now()}-${i}`,
        medicineName,
        genericName,
        manufacturer,
        category,
        batchNumber,
        quantity,
        mrp,
        purchasePrice,
        manufacturingDate: parseDate(manufacturingDate),
        expiryDate: parseDate(expiryDate),
        gstRate,
        total,
        isNewMedicine: false, // Will be determined later
        rackLocation,
      });
    }

    return items;
  };

  const downloadTemplate = () => {
    const template = [
      {
        medicineName: 'Paracetamol 500mg',
        genericName: 'Paracetamol',
        manufacturer: 'ABC Pharma',
        category: 'Tablet',
        batchNumber: 'BATCH001',
        quantity: 100,
        mrp: 50.00,
        purchasePrice: 35.00,
        manufacturingDate: '01/01/2024',
        expiryDate: '01/01/2026',
        gstRate: 12,
        rackLocation: 'A-1'
      },
      {
        medicineName: 'Amoxicillin 250mg',
        genericName: 'Amoxicillin',
        manufacturer: 'XYZ Pharma',
        category: 'Capsule',
        batchNumber: 'BATCH002',
        quantity: 50,
        mrp: 120.00,
        purchasePrice: 85.00,
        manufacturingDate: '15/02/2024',
        expiryDate: '15/02/2026',
        gstRate: 12,
        rackLocation: 'B-2'
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'purchase_invoice_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload CSV/Excel File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
          />
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={downloadTemplate}
          >
            📥 Download Template
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-blue-900 mb-2">CSV/Excel Format Instructions:</h4>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li><strong>Required columns:</strong> medicineName, quantity, mrp, purchasePrice</li>
          <li><strong>Optional columns:</strong> genericName, manufacturer, category, batchNumber, manufacturingDate, expiryDate, gstRate, rackLocation</li>
          <li><strong>Date format:</strong> DD/MM/YYYY or DD-MM-YYYY or YYYY-MM-DD</li>
          <li>Download the template for reference</li>
        </ul>
      </div>
    </div>
  );
}
