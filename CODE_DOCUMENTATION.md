# Medicine Inventory App - Complete Code Documentation

## 📋 Table of Contents
1. [Project Structure](#project-structure)
2. [Store Files (Zustand State Management)](#store-files)
3. [Component Files](#component-files)
4. [Page Files (Next.js App Router)](#page-files)
5. [Firebase Configuration](#firebase-configuration)
6. [Code Flow Examples](#code-flow-examples)

---

## Project Structure

```
medicine-inventory-app/
├── app/                        # Next.js 15 App Router pages
├── components/                 # React components
├── lib/
│   ├── firebase/              # Firebase config & collections
│   ├── store/                 # Zustand state management stores
│   └── types/                 # TypeScript type definitions
└── public/                    # Static assets
```

---

## Store Files (Zustand State Management)

### 🔐 `lib/store/authStore.ts`
**Purpose**: Manages user authentication and session

#### Key Functions:
- **`login(email, password)`** - Firebase API call to sign in user
  - Calls: `signInWithEmailAndPassword()`
  - Then: Gets user profile from Firestore `users` collection
  - Checks: If user is active (isActive = true)
  - Returns: boolean (success/failure)

- **`logout()`** - Firebase API call to sign out
  - Calls: `signOut()`
  - Clears: User state to null

- **`initAuth()`** - Firebase listener for auth state changes
  - Calls: `onAuthStateChanged()` - Real-time auth listener
  - Runs: On app initialization
  - Updates: User state when auth status changes

#### State:
- `user`: Currently logged in user (name, role, email, etc.)
- `isLoading`: Loading state for auth operations
- `error`: Error message if auth fails

---

### 👥 `lib/store/customerStore.ts`
**Purpose**: Manages customer data and purchase history

#### Key Functions:
- **`fetchCustomers()`** - Get all active customers
  - Firestore Query: `customers` collection where `isActive = true`
  - Sorted by: name (ascending)
  - Updates: `customers` array in state

- **`fetchCustomerById(id)`** - Get single customer details
  - Firestore API: `getDoc()` with customer ID
  - Updates: `currentCustomer` in state
  - Used in: Customer details page

- **`fetchPurchaseHistory(customerId)`** - Get customer's purchase history
  - Step 1: Get customer phone number from customer doc
  - Step 2: Query `sales` collection by `customerPhone`
  - Step 3: Sort results in memory (newest first)
  - Updates: `purchaseHistory` array
  - Note: Sorts in memory to avoid Firestore composite index

- **`addCustomer(data)`** - Add new customer
  - Firestore API: `addDoc()` to customers collection
  - Sets defaults: totalPurchases=0, totalSpent=0, loyaltyPoints=0
  - Refreshes: Customer list after adding

- **`updateCustomer(id, data)`** - Update customer details
  - Firestore API: `updateDoc()` with customer ID
  - Updates: Customer fields + updatedAt timestamp

- **`searchCustomerByPhone(phone)`** - Search customer by phone (used in billing)
  - Firestore Query: customers where `phone = {phone}` and `isActive = true`
  - Returns: Customer object or null
  - Used in: Billing system to link sales to customers

- **`addLoyaltyPoints(customerId, points)`** - Add loyalty points
  - Firestore API: `updateDoc()` with `increment(points)`
  - Atomic operation: Safe for concurrent updates
  - Used in: After completing a sale

#### State:
- `customers`: Array of all active customers
- `currentCustomer`: Selected customer details
- `purchaseHistory`: Customer's purchase history
- `isLoading`: Loading state for customer operations
- `isPurchaseHistoryLoading`: Separate loading for history
- `error`: Error message

---

### 💊 `lib/store/medicineStore.ts`
**Purpose**: Manages medicine inventory (master data)

#### Key Functions:
- **`fetchMedicines()`** - Get all active medicines
  - Firestore Query: `medicines` collection where `isActive = true`
  - Sorted by: name (ascending)
  - Updates: `medicines` array in state

- **`fetchMedicineById(id)`** - Get single medicine details
  - Firestore API: `getDoc()` with medicine ID
  - Updates: `currentMedicine` in state
  - Used in: Medicine details page

- **`addMedicine(data, imageFile)`** - Add new medicine with image
  - Step 1: Upload image to Firebase Storage (if provided)
    - Storage path: `medicines/{timestamp}_{filename}`
    - Gets: Download URL for the image
  - Step 2: Create medicine document
    - Sets: totalStock = 0 (updated when batches added)
    - Sets: isActive = true
    - Adds: createdAt and updatedAt timestamps
  - Step 3: Add to Firestore medicines collection
  - Refreshes: Medicine list

- **`updateMedicine(id, data, imageFile)`** - Update medicine
  - Optional: Upload new image to Firebase Storage
  - Firestore API: `updateDoc()` with medicine ID
  - Updates: Medicine fields + image URL if changed

- **`deleteMedicine(id)`** - Soft delete medicine
  - Firestore API: `updateDoc()` sets `isActive = false`
  - Note: Soft delete (not actual deletion)
  - Medicine hidden from lists but data preserved

#### State:
- `medicines`: Array of all active medicines
- `currentMedicine`: Selected medicine details
- `isLoading`: Loading state
- `error`: Error message

#### Important Notes:
- `totalStock` is calculated from batches (sum of all batch quantities)
- Medicine is created with `totalStock = 0`
- Stock updates when batches are added/modified

---

### 📦 `lib/store/batchStore.ts`
**Purpose**: Manages medicine batches (stock by batch number)

#### Key Functions:
- **`fetchBatchesByMedicine(medicineId)`** - Get batches for a medicine
  - Firestore Query: `batches` collection where `medicineId = {id}`
  - Sorted by: expiryDate (ascending)
  - Updates: `batches` array in state
  - Used in: Medicine details -> Batch Management tab

- **`addBatch(data)`** - Add new batch (IMPORTANT FLOW)
  - Step 1: Create batch document in Firestore
    - Includes: batchNumber, quantity, mrp, purchasePrice, expiryDate, supplier
    - Sets: isExpired = false
  - Step 2: **Recalculate medicine totalStock**
    - Query: Get ALL batches for this medicine
    - Calculate: Sum of all batch quantities
    - Update: Medicine document with new totalStock
  - This ensures accurate stock tracking

- **`adjustStock(batchId, newQuantity, reason)`** - Adjust batch quantity
  - Step 1: Get batch data to find medicineId
  - Step 2: Update batch quantity in Firestore
  - Step 3: **Recalculate medicine totalStock**
    - Query: Get ALL batches for the medicine
    - Calculate: Sum of all batch quantities (with updated value)
    - Update: Medicine document with new totalStock
  - Used in: Stock adjustment feature

#### State:
- `batches`: Array of batches for current medicine
- `isLoading`: Loading state
- `error`: Error message

#### Stock Calculation Logic:
```
Medicine.totalStock = Sum of all Batch.quantity for that medicine
```

---

### 🛒 `lib/store/billingStore.ts`
**Purpose**: Manages POS billing and sales

#### Key Functions:
- **`addToCart(item)`** - Add medicine to cart
  - Updates: Local cart state
  - Calculates: Item total (quantity × MRP)

- **`removeFromCart(itemId)`** - Remove item from cart
  - Updates: Local cart state

- **`updateQuantity(itemId, quantity)`** - Change item quantity
  - Updates: Cart item quantity
  - Recalculates: Item total

- **`applyDiscount(amount)`** - Apply discount to cart
  - Updates: Discount amount
  - Recalculates: Grand total

- **`processSale(saleData)`** - Complete sale (COMPLEX FLOW)
  - Step 1: Create sale document in Firestore
    - Collection: `sales`
    - Data: items, customerPhone, subtotal, discount, grandTotal, paymentMethod
    - Generates: Invoice number
  - Step 2: **Update customer stats** (if customer linked)
    - Increment: totalPurchases by 1
    - Increment: totalSpent by grandTotal
    - Increment: loyaltyPoints by Math.floor(grandTotal / 10) (10% cashback)
    - Update: lastVisit timestamp
  - Step 3: **Reduce batch stock**
    - For each item in cart:
      - Find batch by batchId
      - Decrement batch quantity
      - Recalculate medicine totalStock
  - Step 4: Clear cart
  - Returns: Sale ID

#### State:
- `cart`: Array of items in current sale
- `discount`: Discount amount
- `isLoading`: Loading state
- `error`: Error message

---

### 📊 `lib/store/dashboardStore.ts`
**Purpose**: Dashboard metrics and statistics

#### Key Functions:
- **`fetchDashboardStats()`** - Get today's stats
  - Queries:
    1. Today's sales from `sales` collection
    2. Low stock medicines (totalStock <= minStockQty)
    3. Expiring medicines (expiryDate within 90 days)
  - Calculates:
    - **todaysRevenue**: Sum of all sale.grandTotal
    - **todaysCost**: Sum of (item.purchasePrice × item.quantity) for all items
    - **todaysProfit**: todaysRevenue - todaysCost
    - **profitMargin**: (todaysProfit / todaysRevenue) × 100
    - todaysSales: Count of sales
    - lowStockCount: Count of low stock items
    - expiringCount: Count of expiring items
  - Updates: Dashboard state

#### State:
- `todaysRevenue`: Total sales revenue today
- `todaysCost`: Total cost of goods sold today
- `todaysProfit`: Gross profit today
- `profitMargin`: Profit margin percentage
- `todaysSales`: Number of sales today
- `lowStockCount`: Low stock medicines count
- `expiringCount`: Expiring medicines count

#### Important Notes:
- Profit = Revenue - Cost
- Cost = Sum of (purchasePrice × quantity) for each item
- NOT using item.mrp for cost calculation

---

### 📈 `lib/store/reportStore.ts`
**Purpose**: Generate sales and profit reports

#### Key Functions:
- **`fetchSalesReport(startDate, endDate)`** - Sales report
  - Firestore Query: Sales between date range
  - Groups by: Date
  - Calculates: Daily revenue, costs, profit

- **`fetchInventoryReport()`** - Inventory valuation
  - Gets: All medicines with current stock
  - Calculates: Total inventory value (stock × purchasePrice)

- **`fetchProfitReport(startDate, endDate)`** - Profit analysis
  - Firestore Query: Sales between date range
  - Calculates:
    - Total revenue
    - Total cost (sum of item.purchasePrice × quantity)
    - Gross profit (revenue - cost)
    - Profit margin percentage
  - Groups by: Product, category, date

#### State:
- `salesReport`: Sales data by date
- `inventoryReport`: Current inventory value
- `profitReport`: Profit analysis
- `isLoading`: Loading state

---

### 🏢 `lib/store/supplierStore.ts`
**Purpose**: Manage suppliers and purchase orders

#### Key Functions:
- **`fetchSuppliers()`** - Get all active suppliers
  - Firestore Query: `suppliers` collection where `isActive = true`

- **`addSupplier(data)`** - Add new supplier
  - Firestore API: `addDoc()` to suppliers collection
  - Sets defaults: totalPurchases=0, totalPaid=0, outstandingBalance=0

- **`fetchPurchaseOrders(supplierId)`** - Get supplier's orders
  - Firestore Query: `purchaseOrders` where `supplierId = {id}`

- **`addPurchaseOrder(data)`** - Create purchase order
  - Firestore API: `addDoc()` to purchaseOrders collection
  - Updates: Supplier's totalPurchases and outstandingBalance

- **`addPayment(supplierId, amount)`** - Record payment to supplier
  - Firestore API: `addDoc()` to supplierPayments collection
  - Updates: Supplier's totalPaid and reduces outstandingBalance

#### State:
- `suppliers`: Array of suppliers
- `currentSupplier`: Selected supplier
- `purchaseOrders`: Supplier's orders
- `payments`: Supplier's payment history

---

### ⏰ `lib/store/expiryStore.ts`
**Purpose**: Track medicine expiry dates

#### Key Functions:
- **`fetchExpiringMedicines()`** - Get medicines expiring soon
  - Groups medicines by:
    - Expired (expiryDate < today)
    - Expiring in 30 days
    - Expiring in 60 days
    - Expiring in 90 days
  - Queries: All batches with expiry dates
  - Joins: Medicine data for each batch

#### State:
- `expired`: Array of expired batches
- `expiring30`: Expiring within 30 days
- `expiring60`: Expiring within 60 days
- `expiring90`: Expiring within 90 days

---

## Component Files

### 🏠 Dashboard Components

#### `components/dashboard/MetricCard.tsx`
**Purpose**: Display metric card (revenue, sales, profit)
- **Props**: title, value, icon, color
- **Displays**: Metric value with icon and label
- **Used in**: Dashboard page for showing stats

#### `components/dashboard/PharmacistDashboard.tsx`
**Purpose**: Main dashboard UI
- **Fetches**: Dashboard stats on mount (via `fetchDashboardStats()`)
- **Displays**:
  - First row: Today's Sales, Revenue, Low Stock, Expiring
  - Second row (OWNER only): Total Revenue, Total Cost, Gross Profit, Profit Margin
- **Role-based**: Profit stats only shown for OWNER role

#### `components/dashboard/QuickActions.tsx`
**Purpose**: Quick action buttons
- **Displays**: Shortcuts to common actions (New Sale, Add Medicine, etc.)
- **Navigation**: Uses Next.js router to navigate

#### `components/dashboard/ExpiryAlerts.tsx`
**Purpose**: Show expiring medicines alerts
- **Fetches**: Expiring medicines from expiryStore
- **Displays**: Color-coded alerts (red=expired, yellow=expiring soon)

---

### 💊 Inventory Components

#### `components/inventory/MedicineList.tsx`
**Purpose**: List all medicines with search and filters
- **Fetches**: All medicines on mount (`fetchMedicines()`)
- **Features**:
  - Search by name, generic name, manufacturer
  - Filter by category
  - Display count of medicines
- **Button**: "Add Medicine" navigates to add medicine page
- **Access**: Blocked for CASHIER role

#### `components/inventory/MedicineTable.tsx`
**Purpose**: Display medicines in table format
- **Displays**: Name, category, stock, MRP, expiry status
- **Click**: Navigate to medicine details page
- **Shows**: Stock alerts (low stock in red)

#### `components/inventory/AddMedicineForm.tsx`
**Purpose**: Form to add new medicine
- **Fields**: Name, generic name, manufacturer, category, dosage, strength, MRP, purchase price, HSN code, rack location, min stock quantity
- **Image**: File input for medicine image
- **Submit**: Calls `addMedicine()` with form data and image
- **Navigation**: Redirects to inventory page on success

#### `components/inventory/BatchList.tsx`
**Purpose**: Display batches for a medicine
- **Fetches**: Batches for current medicine (`fetchBatchesByMedicine()`)
- **Displays**: Table with batch number, quantity, MRP, purchase price, expiry date, supplier
- **Expiry Badge**: Color-coded based on days remaining
  - Red: Expired or <30 days
  - Yellow: 30-90 days
  - Green: >90 days
- **Button**: "Add New Batch" opens modal
- **Modal**: Contains AddBatchForm

#### `components/inventory/AddBatchForm.tsx`
**Purpose**: Form to add new batch
- **Fields**: Batch number, quantity, MRP, purchase price, manufacturing date, expiry date, supplier name, purchase date
- **Auto-fill**: MRP and purchase price from medicine (can be edited)
- **Submit**: Calls `addBatch()` which:
  1. Creates batch
  2. Recalculates medicine totalStock
- **Success**: Closes modal and refreshes batch list

---

### 🛒 Billing Components

#### `components/billing/POSInterface.tsx`
**Purpose**: Main POS (Point of Sale) interface
- **Layout**: Two columns - Cart and Medicine Search
- **Components**:
  - MedicineSearch: Search and add medicines
  - CartItem: Display cart items
  - CartSummary: Show subtotal, discount, total
  - PaymentSection: Process payment

#### `components/billing/MedicineSearch.tsx`
**Purpose**: Search medicines to add to cart
- **Search**: By medicine name or generic name
- **Displays**: Available stock and expiry date
- **Select**: Choose batch and quantity
- **Button**: "Add to Cart" calls `addToCart()`

#### `components/billing/CartItem.tsx`
**Purpose**: Display single cart item
- **Shows**: Medicine name, batch, quantity, price, total
- **Actions**:
  - Increase/decrease quantity
  - Remove from cart
- **Updates**: Calls `updateQuantity()` or `removeFromCart()`

#### `components/billing/CartSummary.tsx`
**Purpose**: Display cart totals
- **Shows**:
  - Subtotal (sum of all items)
  - Discount (if applied)
  - Grand Total (subtotal - discount)
- **Calculates**: Real-time as cart changes

#### `components/billing/PaymentSection.tsx`
**Purpose**: Complete sale with payment
- **Features**:
  1. Customer search by phone
  2. Link sale to registered customer
  3. Show loyalty points (if customer found)
  4. Select payment method (Cash/Card/UPI)
  5. Process sale
- **Customer Search**:
  - Input: Phone number
  - Button: "Search" calls `searchCustomerByPhone()`
  - If found: Shows customer name and loyalty points
  - Auto-linked: Sale will update customer stats
- **Submit**: Calls `processSale()` which:
  1. Creates sale document
  2. Updates customer stats (if linked)
  3. Reduces batch stock
  4. Generates invoice
- **Success**: Shows invoice preview and clears cart

#### `components/billing/SalesHistory.tsx`
**Purpose**: View past sales with filters
- **Fetches**: Sales history from Firestore
- **Filters**:
  - Quick filters: Today, Last 7 Days, Last 30 Days, All Time
  - Custom date range
- **Displays**: Table with invoice number, date, customer, amount, payment method
- **Click**: View sale details

---

### 👥 Customer Components

#### `components/customers/CustomerList.tsx`
**Purpose**: List all customers
- **Fetches**: All customers (`fetchCustomers()`)
- **Displays**: Table with name, phone, email, total purchases, total spent, loyalty points
- **Search**: Filter by name or phone
- **Button**: "Add Customer" navigates to add form
- **Click**: Navigate to customer details page

#### `components/customers/AddCustomerForm.tsx`
**Purpose**: Form to add new customer
- **Fields**: Name, phone, email, address
- **Submit**: Calls `addCustomer()` which sets defaults:
  - totalPurchases = 0
  - totalSpent = 0
  - loyaltyPoints = 0

#### `components/customers/CustomerDetails.tsx`
**Purpose**: Display customer details and purchase history
- **Sections**:
  1. Customer Info: Name, phone, email, address
  2. Stats: Total purchases, total spent, loyalty points
  3. Purchase History: Table of past sales
- **Fetches**:
  - Customer data (`fetchCustomerById()`)
  - Purchase history (`fetchPurchaseHistory()`)
- **History**: Shows invoice number, date, amount, items
- **Loading**: Separate loading states for customer and history

---

### 🏢 Supplier Components

#### `components/suppliers/SupplierList.tsx`
**Purpose**: List all suppliers
- **Fetches**: All suppliers (`fetchSuppliers()`)
- **Displays**: Table with name, contact, total purchases, outstanding balance
- **Button**: "Add Supplier" navigates to add form

#### `components/suppliers/SupplierDetails.tsx`
**Purpose**: Display supplier details, orders, and payments
- **Tabs**:
  1. Supplier Info: Name, contact, address
  2. Purchase Orders: List of orders
  3. Payments: Payment history
- **Fetches**:
  - Supplier data
  - Purchase orders
  - Payments

---

## Page Files (Next.js App Router)

### 🏠 `app/page.tsx`
**Purpose**: Landing/Login page
- **Displays**: LoginForm component
- **Redirect**: If user logged in, redirect to /dashboard

### 🏠 `app/dashboard/page.tsx`
**Purpose**: Main dashboard page
- **Layout**: Uses DashboardLayout wrapper
- **Component**: Renders PharmacistDashboard
- **Auth**: Requires user to be logged in
- **Role-based**: Shows different metrics for OWNER vs PHARMACIST/CASHIER

### 💊 `app/inventory/page.tsx`
**Purpose**: Inventory management page
- **Component**: Renders MedicineList
- **Auth**: Requires user to be logged in
- **Access**: CASHIER role blocked

### 💊 `app/inventory/add/page.tsx`
**Purpose**: Add new medicine page
- **Component**: Renders AddMedicineForm
- **Navigation**: Redirects to /inventory on success

### 💊 `app/inventory/[id]/page.tsx`
**Purpose**: Medicine details page (dynamic route)
- **Params**: Medicine ID from URL
- **Fetches**: Medicine data on mount (`fetchMedicineById()`)
- **Tabs**:
  1. Medicine Details: EditMedicineForm
  2. Batch Management: BatchList component
- **useEffect**: Fetches medicine when ID changes (fixed infinite loop)

### 🛒 `app/billing/page.tsx`
**Purpose**: POS billing page
- **Component**: Renders POSInterface
- **Auth**: Requires user to be logged in
- **Real-time**: Cart updates immediately

### 📊 `app/history/page.tsx`
**Purpose**: Sales history page
- **Component**: Renders SalesHistory
- **Filters**: Date range and quick filters

### 👥 `app/customers/page.tsx`
**Purpose**: Customer management page
- **Component**: Renders CustomerList

### 👥 `app/customers/[id]/page.tsx`
**Purpose**: Customer details page (dynamic route)
- **Params**: Customer ID from URL
- **Fetches**: Customer data and purchase history
- **Component**: Renders CustomerDetails
- **useEffect**: Fixed infinite loop issue

### 🏢 `app/suppliers/page.tsx`
**Purpose**: Supplier management page
- **Component**: Renders SupplierList

### 🏢 `app/suppliers/[id]/page.tsx`
**Purpose**: Supplier details page (dynamic route)
- **Params**: Supplier ID from URL
- **Fetches**: Supplier data, orders, payments
- **Component**: Renders SupplierDetails

### ⏰ `app/expiry/page.tsx`
**Purpose**: Expiry management page
- **Component**: Renders ExpiryDashboard
- **Displays**: Medicines grouped by expiry timeframe

### 📈 `app/reports/page.tsx`
**Purpose**: Reports and analytics page
- **Tabs**:
  1. Sales Report
  2. Inventory Report
  3. Profit Report
- **Date range**: Select start and end date for reports

---

## Firebase Configuration

### 🔥 `lib/firebase/config.ts`
**Purpose**: Initialize Firebase app and services
```javascript
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);           // Authentication
export const db = getFirestore(app);        // Firestore database
export const storage = getStorage(app);     // Cloud storage
```

### 📝 `lib/firebase/collections.ts`
**Purpose**: Define Firestore collection names
```javascript
export const COLLECTIONS = {
  USERS: 'users',
  CUSTOMERS: 'customers',
  SUPPLIERS: 'suppliers',
  MEDICINES: 'medicines',
  BATCHES: 'batches',
  SALES: 'sales',
  PURCHASE_ORDERS: 'purchaseOrders',
  SUPPLIER_PAYMENTS: 'supplierPayments',
};
```

---

## Code Flow Examples

### 🛒 Complete Sale Flow (Billing)

```
1. USER INTERACTION
   - User searches medicine
   - Selects batch and quantity
   - Clicks "Add to Cart"
   ↓
2. COMPONENT (MedicineSearch.tsx)
   - Calls: addToCart(item)
   ↓
3. STORE (billingStore.ts)
   - Adds item to cart array
   - Calculates item total
   - Updates cart state
   ↓
4. UI UPDATE
   - CartItem component shows item
   - CartSummary shows updated total
   ↓
5. USER COMPLETES SALE
   - (Optional) Searches customer by phone
   - Selects payment method
   - Clicks "Complete Sale"
   ↓
6. COMPONENT (PaymentSection.tsx)
   - Validates cart not empty
   - Calls: processSale(saleData)
   ↓
7. STORE (billingStore.ts) - processSale()
   a. CREATE SALE DOCUMENT
      - Firestore API: addDoc() to 'sales' collection
      - Data: items, customerPhone, grandTotal, paymentMethod
      - Generate invoice number

   b. UPDATE CUSTOMER STATS (if customer linked)
      - Firestore API: updateDoc() to 'customers/{id}'
      - Increment: totalPurchases += 1
      - Increment: totalSpent += grandTotal
      - Increment: loyaltyPoints += Math.floor(grandTotal / 10)
      - Update: lastVisit = now

   c. REDUCE BATCH STOCK
      - For each item in cart:
        * Get batch document
        * Calculate new quantity: batch.quantity - item.quantity
        * Firestore API: updateDoc() batch quantity
        * Recalculate medicine totalStock
          - Query all batches for medicine
          - Sum all batch quantities
          - Update medicine.totalStock

   d. CLEAR CART
      - Reset cart array to []
      - Reset discount to 0
   ↓
8. UI UPDATE
   - Show success message
   - Display invoice preview
   - Redirect to new sale
```

### 📦 Add Batch Flow (Inventory)

```
1. USER INTERACTION
   - Navigates to Medicine Details
   - Clicks "Batch Management" tab
   - Clicks "Add New Batch"
   ↓
2. COMPONENT (BatchList.tsx)
   - Opens modal
   - Shows AddBatchForm
   ↓
3. USER FILLS FORM
   - Batch number, quantity, dates, supplier
   - MRP and purchase price auto-filled from medicine
   - Clicks "Add Batch"
   ↓
4. COMPONENT (AddBatchForm.tsx)
   - Validates form data
   - Calls: addBatch(batchData)
   ↓
5. STORE (batchStore.ts) - addBatch()
   a. CREATE BATCH DOCUMENT
      - Firestore API: addDoc() to 'batches' collection
      - Data: medicineId, batchNumber, quantity, mrp,
              purchasePrice, expiryDate, supplier
      - Sets: isExpired = false

   b. RECALCULATE MEDICINE STOCK
      - Firestore Query: Get ALL batches where medicineId = {id}
      - Calculate: totalStock = sum of all batch.quantity
      - Firestore API: updateDoc() medicine document
      - Update: medicine.totalStock = calculated total
   ↓
6. COMPONENT (BatchList.tsx)
   - Closes modal
   - Calls: fetchBatchesByMedicine(medicineId)
   - Refreshes batch list
   ↓
7. UI UPDATE
   - Shows new batch in table
   - Medicine totalStock updated
```

### 👥 Customer Purchase History Flow

```
1. USER INTERACTION
   - Clicks on customer in CustomerList
   - Navigates to /customers/{id}
   ↓
2. PAGE (app/customers/[id]/page.tsx)
   - Gets customerId from URL params
   - useEffect runs on mount
   - Calls: fetchCustomerById(customerId)
   - Note: Fixed infinite loop by removing function from dependencies
   ↓
3. STORE (customerStore.ts) - fetchCustomerById()
   - Firestore API: getDoc() customer document
   - Updates: currentCustomer state
   ↓
4. COMPONENT (CustomerDetails.tsx)
   - Receives customer data
   - useEffect runs on mount
   - Calls: fetchPurchaseHistory(customerId)
   - Note: Fixed infinite loop by removing function from dependencies
   ↓
5. STORE (customerStore.ts) - fetchPurchaseHistory()
   a. GET CUSTOMER PHONE
      - Firestore API: getDoc() customer document
      - Extract: customer.phone

   b. QUERY SALES BY PHONE
      - Firestore Query: 'sales' collection where customerPhone = {phone}
      - Note: Query by phone (not customerId) because sales store phone
      - Note: No orderBy to avoid composite index requirement

   c. SORT IN MEMORY
      - Map sales documents to purchase history format
      - Sort by purchaseDate descending (newest first)
      - Updates: purchaseHistory state
   ↓
6. UI UPDATE
   - CustomerDetails shows:
     * Customer info
     * Stats (purchases, spent, points)
     * Purchase history table
```

### 📊 Dashboard Profit Stats Flow (OWNER Only)

```
1. PAGE LOAD
   - User logs in as OWNER
   - Navigates to /dashboard
   ↓
2. COMPONENT (PharmacistDashboard.tsx)
   - useEffect runs on mount
   - Calls: fetchDashboardStats()
   ↓
3. STORE (dashboardStore.ts) - fetchDashboardStats()
   a. QUERY TODAY'S SALES
      - Firestore Query: 'sales' collection
      - Filter: createdAt >= today 00:00:00
      - Filter: createdAt <= today 23:59:59

   b. CALCULATE METRICS
      - todaysRevenue = 0
      - todaysCost = 0

      - For each sale:
        * todaysRevenue += sale.grandTotal
        * For each item in sale.items:
          - itemCost = item.purchasePrice × item.quantity
          - todaysCost += itemCost

      - todaysProfit = todaysRevenue - todaysCost
      - profitMargin = (todaysProfit / todaysRevenue) × 100

   c. UPDATE STATE
      - Sets all calculated metrics
   ↓
4. UI RENDER
   - IF user.role === 'OWNER':
     * Show second row of metric cards:
       - Total Revenue (blue card)
       - Total Cost (red card)
       - Gross Profit (green card)
       - Profit Margin (purple card)

   - ELSE (PHARMACIST/CASHIER):
     * Hide profit stats row
     * Only show first row (sales, revenue, low stock, expiring)
```

---

## 🔑 Key Concepts

### State Management (Zustand)
- **Global state**: Shared across all components
- **No prop drilling**: Components access state directly via hooks
- **Automatic re-render**: Components re-render when state changes

### Firebase APIs Used

#### Authentication
- `signInWithEmailAndPassword()` - Login
- `signOut()` - Logout
- `onAuthStateChanged()` - Auth state listener

#### Firestore (Database)
- `addDoc(collection, data)` - Create document
- `getDoc(docRef)` - Read single document
- `getDocs(query)` - Read multiple documents
- `updateDoc(docRef, data)` - Update document
- `deleteDoc(docRef)` - Delete document (not used, using soft delete)
- `query(collection, ...filters)` - Build query
- `where(field, operator, value)` - Filter query
- `orderBy(field, direction)` - Sort query
- `increment(value)` - Atomic increment

#### Firebase Storage
- `ref(storage, path)` - Create storage reference
- `uploadBytes(ref, file)` - Upload file
- `getDownloadURL(ref)` - Get file URL

### React Hooks Used
- `useState()` - Local component state
- `useEffect()` - Side effects (API calls, subscriptions)
- `useRouter()` - Next.js navigation
- `useParams()` - Next.js URL parameters

### Common Patterns

#### Infinite Loop Prevention
```javascript
// ❌ WRONG - Causes infinite loop
useEffect(() => {
  fetchData();
}, [fetchData]); // Function reference changes on every render

// ✅ CORRECT - No infinite loop
useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Empty dependency array, runs once on mount
```

#### Loading States
```javascript
// Set loading before API call
set({ isLoading: true, error: null });

// API call
const result = await someAPICall();

// Clear loading after API call
set({ isLoading: false });
```

#### Error Handling
```javascript
try {
  // API call
} catch (error: any) {
  set({ error: error.message, isLoading: false });
  return false;
}
```

---

## 📝 Important Notes

### Stock Management
- Medicine `totalStock` is calculated from batches (not stored directly)
- When batch added: totalStock = sum of all batch quantities
- When batch adjusted: totalStock recalculated
- When sale made: batch quantity reduced, totalStock recalculated

### Soft Delete
- Medicines, customers, suppliers use `isActive` flag
- Never actually deleted from database
- Queries filter by `isActive = true`
- Can be reactivated by setting `isActive = true`

### Customer Integration
- Sales can be linked to customers via phone number
- When sale completed with customer:
  - Customer stats auto-updated
  - Loyalty points awarded (10% cashback)
  - Purchase history tracked

### Role-Based Access
- **OWNER**: Full access + profit stats
- **PHARMACIST**: Inventory + billing + reports
- **CASHIER**: Billing only (no inventory management)

### Performance Optimizations
- In-memory sorting to avoid Firestore composite indexes
- Separate loading states for independent data
- useEffect dependency optimization to prevent infinite loops

---

## 🐛 Recent Bug Fixes

1. **Infinite Loop in Customer/Supplier Details**
   - Problem: Store functions in useEffect dependencies
   - Solution: Remove functions from dependencies

2. **Stock Not Updating After Adjustment**
   - Problem: adjustStock() didn't recalculate medicine totalStock
   - Solution: Added totalStock recalculation logic

3. **Wrong Profit Calculation**
   - Problem: Using sale.grandTotal as cost (should be purchasePrice)
   - Solution: Calculate cost from item.purchasePrice × quantity

4. **Purchase History Not Showing**
   - Problem: Querying by customerId (should be customerPhone)
   - Solution: Get customer phone, query sales by phone

---

## 📚 Resources

- **Next.js 15 Docs**: https://nextjs.org/docs
- **React 19 Docs**: https://react.dev
- **Zustand Docs**: https://docs.pmnd.rs/zustand
- **Firebase Docs**: https://firebase.google.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Last Updated**: January 2025
**Maintained By**: Medicine Inventory Development Team
