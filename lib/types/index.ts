import { Timestamp } from 'firebase/firestore';

// User Types
export type UserRole = 'OWNER' | 'PHARMACIST' | 'CASHIER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Medicine Types
export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  dosageForm?: string;
  strength?: string;
  mrp: number;
  purchasePrice?: number;
  hsnCode?: string;
  rackLocation: string;
  imageUrl?: string;
  minStockQty: number;
  totalStock?: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Batch Types
export interface Batch {
  id: string;
  batchNumber: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  mrp: number;
  purchasePrice: number;
  manufacturingDate: Timestamp;
  expiryDate: Timestamp;
  supplierName: string;
  purchaseDate: Timestamp;
  isExpired: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Sales Types
export interface SaleItem {
  batchId: string;
  medicineName: string;
  batchNumber?: string;
  quantity: number;
  unitPrice: number;
  purchasePrice?: number;
  discount: number;
  gstRate: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string;
  prescriptionNo?: string;
  subtotal: number;
  discount: number;
  gstAmount: number;
  roundOff: number;
  grandTotal: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD';
  userId: string;
  userName: string;
  items: SaleItem[];
  createdAt: Timestamp;
}

// Cart Types
export interface CartItem {
  batchId: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  unitPrice: number;
  purchasePrice?: number;
  discount: number;
  gstRate: number;
  availableStock: number;
}

export interface CartTotal {
  subtotal: number;
  totalDiscount: number;
  gstAmount: number;
  grandTotal: number;
}

// Dashboard Types
export interface DashboardMetrics {
  totalMedicines: number;
  lowStockItems: number;
  expiringSoon: number;
  todaysSales: number;
  totalStockValue: number;
  todaysRevenue: number;
  todaysProfit: number;
}

export interface Activity {
  id: string;
  type: 'sale' | 'stock_added' | 'stock_updated' | 'medicine_added';
  description: string;
  userId: string;
  userName: string;
  amount?: number;
  createdAt: Timestamp;
}

// Settings Types
export interface ShopSettings {
  id: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  gstNumber: string;
  drugLicense: string;
  defaultGstRate: number;
}

// Phase 2: Customer Types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  dateOfBirth?: Timestamp;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  totalPurchases: number;
  totalSpent: number;
  lastVisit?: Timestamp;
  loyaltyPoints: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CustomerPurchaseHistory {
  id: string;
  customerId: string;
  saleId: string;
  invoiceNumber: string;
  amount: number;
  purchaseDate: Timestamp;
  items: SaleItem[];
}

// Phase 2: Supplier Types
export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email?: string;
  address: string;
  gstNumber?: string;
  drugLicense?: string;
  contactPerson: string;
  contactPersonPhone: string;
  paymentTerms?: string; // e.g., "Net 30", "Net 60"
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  totalOrders: number;
  totalPurchaseAmount: number;
  outstandingAmount: number;
  lastOrderDate?: Timestamp;
  rating?: number; // 1-5 stars
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: Timestamp;
  expectedDeliveryDate?: Timestamp;
  actualDeliveryDate?: Timestamp;
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  items: PurchaseOrderItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  notes?: string;
  userId: string;
  userName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PurchaseOrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  gstRate: number;
  total: number;
}

export interface SupplierPayment {
  id: string;
  supplierId: string;
  supplierName: string;
  purchaseOrderId?: string;
  amount: number;
  paymentDate: Timestamp;
  paymentMethod: 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'UPI';
  referenceNumber?: string;
  notes?: string;
  userId: string;
  userName: string;
  createdAt: Timestamp;
}

// Phase 2: Reports Types
export interface SalesReport {
  period: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  totalTransactions: number;
  averageOrderValue: number;
  topSellingMedicines: TopSellingItem[];
  salesByCategory: CategorySales[];
  salesByPaymentMethod: PaymentMethodSales[];
}

export interface TopSellingItem {
  medicineId: string;
  medicineName: string;
  quantitySold: number;
  revenue: number;
}

export interface CategorySales {
  category: string;
  quantity: number;
  revenue: number;
  percentage: number;
}

export interface PaymentMethodSales {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface InventoryReport {
  totalMedicines: number;
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiredItems: number;
  expiringIn30Days: number;
  stockByCategory: CategoryStock[];
}

export interface CategoryStock {
  category: string;
  itemCount: number;
  stockValue: number;
  percentage: number;
}

export interface ProfitReport {
  period: string;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  topProfitableMedicines: ProfitableItem[];
}

export interface ProfitableItem {
  medicineId: string;
  medicineName: string;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
}

// Phase 2: Purchase Invoice Types (Bulk Entry)
export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  invoiceDate: Timestamp;
  invoiceImageUrl?: string;
  items: PurchaseInvoiceItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  discount: number;
  status: 'DRAFT' | 'CONFIRMED';
  notes?: string;
  userId: string;
  userName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PurchaseInvoiceItem {
  tempId: string; // Temporary ID for frontend editing
  medicineId?: string; // Will be auto-matched or manually selected
  medicineName: string;
  genericName?: string;
  manufacturer?: string;
  category?: string;
  batchNumber: string;
  quantity: number;
  mrp: number;
  purchasePrice: number;
  manufacturingDate: Timestamp;
  expiryDate: Timestamp;
  gstRate: number;
  total: number;
  isNewMedicine: boolean; // If medicine doesn't exist in inventory
  rackLocation?: string;
}
