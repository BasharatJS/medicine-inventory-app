// Firestore collection names (centralized for consistency)
export const COLLECTIONS = {
  USERS: 'users', // User accounts and roles
  MEDICINES: 'medicines', // Medicine master data
  BATCHES: 'batches', // Medicine batches with expiry dates
  SALES: 'sales', // Sales/billing transactions
  SETTINGS: 'settings', // App settings
  ACTIVITIES: 'activities', // Activity logs
  // Customer & Supplier Management
  CUSTOMERS: 'customers', // Customer data and loyalty
  SUPPLIERS: 'suppliers', // Supplier information
  PURCHASE_ORDERS: 'purchaseOrders', // Purchase orders from suppliers
  SUPPLIER_PAYMENTS: 'supplierPayments', // Payments to suppliers
} as const;
