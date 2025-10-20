# Bulk Purchase Invoice Feature - Complete Guide

## Overview
The Bulk Purchase Invoice feature allows you to add multiple medicines to your inventory in one go by uploading CSV/Excel files or manual entry. This is perfect for handling supplier invoices with multiple items.

---

## Features

### 1. **CSV/Excel Upload**
- Upload purchase invoice data from CSV or Excel files
- Automatic parsing and validation
- Support for multiple date formats (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD)
- Template download available

### 2. **Manual Entry**
- Add items manually using an editable table
- Medicine autocomplete with existing inventory
- Real-time calculations
- Add/delete rows as needed

### 3. **Smart Medicine Matching**
- Automatically matches medicine names with existing inventory
- Creates new medicines if not found
- Updates stock for existing medicines

### 4. **Automatic Stock Update**
- Creates batches for all items
- Updates medicine stock quantities
- Links to supplier accounts
- Updates supplier outstanding amounts

---

## How to Use

### Step 1: Access the Feature
1. Login to your account (Owner or Pharmacist role required)
2. Go to Dashboard
3. Click on **"Bulk Purchase"** quick action OR
4. Navigate from sidebar: **Purchase Invoice**

### Step 2: Fill Invoice Information
- **Invoice Number**: Enter the supplier's invoice number (required)
- **Supplier**: Select from dropdown (required)
- **Invoice Date**: Select the invoice date
- **Discount**: Optional discount amount
- **Notes**: Any additional notes
- **Invoice Image**: Optional - upload photo/scan of physical invoice

### Step 3: Add Items

#### Option A: Upload CSV/Excel File
1. Click **"📥 Download Template"** to get sample CSV format
2. Fill the CSV with your invoice data
3. Click **"Choose File"** and select your CSV/Excel
4. File will be automatically parsed and items will appear in the table

#### Option B: Manual Entry
1. Click **"+ Add Item"** button
2. Start typing medicine name (autocomplete will suggest existing medicines)
3. Fill in all required fields:
   - Medicine Name *
   - Batch Number *
   - Quantity *
   - MRP *
   - Purchase Price *
   - Expiry Date *
   - Other optional fields

### Step 4: Review & Edit
- Review all items in the table
- Edit any field by clicking on it
- Delete items using the 🗑️ button
- Check the summary section for totals

### Step 5: Save
Two options:
- **💾 Save as Draft**: Saves invoice without updating stock (can edit later)
- **✓ Confirm & Update Stock**: Confirms invoice and updates inventory immediately

---

## CSV/Excel Format

### Required Columns
- `medicineName` - Name of the medicine (required)
- `quantity` - Quantity purchased (required)
- `mrp` - Maximum Retail Price (required)
- `purchasePrice` - Purchase price per unit (required)

### Optional Columns
- `genericName` - Generic/salt name
- `manufacturer` - Manufacturer company
- `category` - Medicine category (Tablet, Capsule, Syrup, etc.)
- `batchNumber` - Batch number (auto-generated if not provided)
- `manufacturingDate` - Manufacturing date
- `expiryDate` - Expiry date
- `gstRate` - GST rate (default: 12)
- `rackLocation` - Storage location

### Sample CSV
```csv
medicineName,genericName,manufacturer,category,batchNumber,quantity,mrp,purchasePrice,manufacturingDate,expiryDate,gstRate,rackLocation
Paracetamol 500mg,Paracetamol,ABC Pharma,Tablet,BATCH001,100,50.00,35.00,01/01/2024,01/01/2026,12,A-1
Amoxicillin 250mg,Amoxicillin,XYZ Pharma,Capsule,BATCH002,50,120.00,85.00,15/02/2024,15/02/2026,12,B-2
```

---

## What Happens When You Confirm?

When you click **"✓ Confirm & Update Stock"**, the system:

1. ✅ Creates invoice record in database
2. ✅ Checks if medicines exist in inventory
3. ✅ Creates new medicine records for items not found
4. ✅ Creates batch records for all items
5. ✅ Updates total stock for each medicine
6. ✅ Updates supplier's outstanding amount
7. ✅ Updates supplier's total purchase amount
8. ✅ Records purchase date and order count

**⚠️ Important: This action cannot be undone!**

---

## View Saved Invoices

1. Navigate to: **Purchase Invoice → List** (or `/purchase-invoice/list`)
2. You'll see all invoices with:
   - Invoice number
   - Supplier name
   - Date
   - Number of items
   - Total amount
   - Status (DRAFT/CONFIRMED)
   - Created by

3. Actions available:
   - **Confirm**: Confirm draft invoices
   - **View**: View invoice details

---

## Best Practices

### 1. Use CSV Upload for Bulk Entry
- Faster than manual entry for 10+ items
- Less chance of typos
- Easy to prepare in Excel first

### 2. Download Template First
- Ensures correct column names
- Provides format reference
- Shows example data

### 3. Verify Before Confirming
- Double-check quantities
- Verify prices
- Check expiry dates
- Ensure correct supplier selected

### 4. Save as Draft First
- If you're not sure about data
- If you need to verify with physical invoice
- Can confirm later after review

### 5. Organize Your Data
- Use consistent medicine naming
- Keep batch numbers unique
- Use standard date formats
- Fill rack locations for easy finding

---

## Troubleshooting

### Problem: CSV Upload Failed
**Solution:**
- Check file format (must be .csv or .xlsx)
- Ensure column names match template
- Check for empty rows
- Verify required fields are filled

### Problem: Medicine Not Auto-Matching
**Solution:**
- Type exact medicine name as in inventory
- Use autocomplete suggestions
- If new medicine, it will be marked as "New Medicine"

### Problem: Invalid Date Error
**Solution:**
- Use DD/MM/YYYY format
- Or DD-MM-YYYY format
- Or YYYY-MM-DD format
- Don't leave date fields empty for expiry

### Problem: Cannot Access Feature
**Solution:**
- Only Owner and Pharmacist can access
- Cashier role doesn't have permission
- Check if you're logged in

---

## Advanced Tips

### 1. Keyboard Shortcuts in Table
- Tab: Move to next field
- Shift+Tab: Move to previous field
- Enter: Submit current edit

### 2. Medicine Autocomplete
- Start typing any part of medicine name
- Autocomplete searches: name, generic name, manufacturer
- Selecting from autocomplete fills: name, generic, manufacturer, MRP, purchase price

### 3. GST Calculation
- GST is calculated per item based on GST rate
- Subtotal shows amount before GST
- GST amount shown separately
- Total includes GST

### 4. New Medicine Detection
- System automatically detects if medicine exists
- "New Medicines" count shown in summary
- New medicines will be added to inventory on confirm
- Existing medicines will just add new batch

---

## File Locations

### Main Page
- **Path**: `/purchase-invoice`
- **Component**: `app/purchase-invoice/page.tsx`

### List Page
- **Path**: `/purchase-invoice/list`
- **Component**: `app/purchase-invoice/list/page.tsx`

### Components
- **CSV Uploader**: `components/purchase-invoice/CSVUploader.tsx`
- **Items Table**: `components/purchase-invoice/InvoiceItemsTable.tsx`
- **Autocomplete**: `components/purchase-invoice/MedicineAutocomplete.tsx`

### Store
- **Zustand Store**: `lib/store/purchaseInvoiceStore.ts`

### Template
- **CSV Template**: `public/purchase_invoice_template.csv`

---

## Database Collections

### purchaseInvoices
Stores all purchase invoice records

### medicines
Updated/created when invoice confirmed

### batches
New batches created for each item

### suppliers
Outstanding amounts updated

---

## Security & Permissions

### Access Control
- ✅ Owner: Full access
- ✅ Pharmacist: Full access
- ❌ Cashier: No access

### Data Validation
- Required field validation
- Numeric value validation
- Date format validation
- Duplicate prevention

---

## Future Enhancements (Phase 2)

1. **OCR/AI Integration**
   - Scan physical invoice with camera
   - Auto-extract data using AI
   - Google Vision or GPT-4 Vision integration

2. **Barcode Scanning**
   - Scan medicine barcodes
   - Auto-fill medicine details

3. **Invoice History**
   - Edit confirmed invoices
   - Add return/damage entries
   - Link to payments

4. **Advanced Analytics**
   - Purchase trends
   - Supplier performance
   - Cost analysis

---

## Support

For issues or questions:
1. Check this guide first
2. Verify your data format
3. Check console for error messages
4. Contact system administrator

---

## Version Information

- **Feature Version**: 1.0
- **Date**: 2024
- **Dependencies**:
  - papaparse: CSV parsing
  - xlsx: Excel file parsing
  - Firebase: Database & storage
  - Zustand: State management

---

**Happy Bulk Purchasing! 🎉**
