# 🚀 Quick Start - Bulk Purchase Invoice

## Access the Feature

### Option 1: Dashboard Quick Action
Dashboard → Click **"Bulk Purchase"** card

### Option 2: Sidebar Menu
Sidebar → Click **"Purchase Invoice"**

### Option 3: Direct URL
`/purchase-invoice`

---

## Create Your First Invoice (3 Simple Steps)

### Step 1️⃣: Basic Info (30 seconds)
- Invoice Number: `INV-001`
- Select Supplier from dropdown
- Select Invoice Date

### Step 2️⃣: Add Items (2 minutes)

**Easy Way - CSV Upload:**
1. Download template: Click "📥 Download Template"
2. Fill in Excel/CSV
3. Upload file

**Or Manual Entry:**
1. Click "+ Add Item"
2. Type medicine name (autocomplete will help)
3. Fill quantity, MRP, purchase price, expiry date

### Step 3️⃣: Confirm (5 seconds)
Click **"✓ Confirm & Update Stock"**

✅ Done! Stock automatically updated!

---

## Sample CSV (Copy & Save as .csv)

```csv
medicineName,quantity,mrp,purchasePrice,expiryDate
Paracetamol 500mg,100,50,35,01/01/2026
Crocin 650mg,50,120,85,15/02/2026
Cetrizine 10mg,200,25,18,10/03/2026
```

---

## Required Fields (Minimum)

- ✅ Medicine Name
- ✅ Quantity
- ✅ MRP
- ✅ Purchase Price
- ✅ Expiry Date

Everything else is optional!

---

## Tips

💡 **Tip 1**: Use CSV for 10+ items (much faster!)
💡 **Tip 2**: Download template first for correct format
💡 **Tip 3**: Type medicine names carefully for auto-matching
💡 **Tip 4**: Save as draft if unsure, confirm later
💡 **Tip 5**: Check summary before confirming

---

## Common Actions

| Action | How |
|--------|-----|
| Add item | Click "+ Add Item" |
| Delete item | Click 🗑️ button |
| Edit item | Click on any field |
| Upload CSV | Click "Choose File" |
| Save draft | Click "💾 Save as Draft" |
| Confirm | Click "✓ Confirm & Update Stock" |
| View list | Sidebar → Purchase Invoice (shows list) |

---

## Troubleshooting

**Problem**: CSV not uploading
**Fix**: Check file is .csv or .xlsx, use template format

**Problem**: Medicine not found
**Fix**: That's OK! New medicine will be created

**Problem**: Can't access feature
**Fix**: Login as Owner or Pharmacist (Cashier can't access)

---

## What Happens After Confirm?

1. ✅ Invoice saved to database
2. ✅ New medicines created (if any)
3. ✅ Batches created for all items
4. ✅ Stock quantities updated
5. ✅ Supplier outstanding updated

---

## File Paths

- **Create**: `/purchase-invoice`
- **List**: `/purchase-invoice/list`
- **Template**: Download from upload section

---

## Need Help?

📖 **Full Guide**: Read `BULK_PURCHASE_GUIDE.md`
📋 **Details**: Check `IMPLEMENTATION_SUMMARY.md`

---

**That's it! Start using now! 🎉**
