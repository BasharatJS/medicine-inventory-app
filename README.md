# MediCare Inventory Management System - Phase 1

A comprehensive medicine inventory and billing management system built with Next.js 15, Firebase, and Zustand.

## Features Implemented (Phase 1)

### ✅ Authentication System
- Role-based login (Owner, Pharmacist, Cashier)
- Session management with Firebase Auth
- Protected routes based on user roles
- Remember me functionality

### ✅ Dashboard
- Role-specific metrics display
- Key performance indicators
- Quick action buttons
- Recent activity feed
- Expiry alerts sidebar

### ✅ Medicine Inventory Management
- Add/Edit/Delete medicines
- Medicine details with image upload
- Batch management (FEFO - First Expiry First Out)
- Stock level tracking
- Low stock alerts
- Category-based organization
- Search and filter functionality

### ✅ Expiry Management
- Expired medicines tracking
- Medicines expiring in 30/60/90 days
- Color-coded expiry badges
- Mark as removed/disposed functionality
- Expiry timeline view

### ✅ Billing/POS System
- Fast medicine search with autocomplete
- Batch selection with FEFO
- Shopping cart management
- Real-time price calculation
- GST breakdown
- Discount application (role-based)
- Multiple payment methods (Cash, UPI, Card)
- Invoice generation with print support
- Customer details capture

### ✅ Sales History
- Transaction history with filters
- Date range filtering
- Invoice preview and reprint
- Sales analytics

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Firebase (Firestore, Auth, Storage)
- **State Management**: Zustand
- **Authentication**: Firebase Auth

## Prerequisites

- Node.js 18+ installed
- Firebase project set up
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
npm install firebase zustand
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Enable Storage for image uploads
6. Copy your Firebase configuration

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Fill in your Firebase configuration in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Set Up Firestore Database

Create the following collections in Firestore:

#### Collections Structure:

1. **users** - User profiles
2. **medicines** - Medicine master data
3. **batches** - Medicine batch/stock information
4. **sales** - Sales transactions
5. **settings** - Shop settings (optional)

#### Firestore Indexes:

Create these composite indexes in Firestore:
- `medicines`: (isActive, name)
- `batches`: (medicineId, expiryDate)
- `sales`: (createdAt DESC)

### 5. Create Test User

Add a test user in Firebase Authentication and create corresponding user document in Firestore:

```javascript
// In Firestore 'users' collection
{
  email: "owner@medicare.com",
  name: "Owner Name",
  role: "OWNER",
  isActive: true,
  createdAt: Firebase.Timestamp.now(),
  updatedAt: Firebase.Timestamp.now()
}
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Roles & Permissions

### Owner (Full Access)
- ✅ All features
- ✅ View profit margins and financial reports
- ✅ Manage all inventory
- ✅ Process sales
- ✅ Apply discounts
- ✅ View all reports

### Pharmacist (Operational Access)
- ✅ Add/Edit medicines
- ✅ Manage stock and batches
- ✅ Process sales
- ✅ Apply discounts
- ✅ View inventory reports
- ❌ Cannot delete medicines
- ❌ Cannot view detailed profit margins

### Cashier (Limited Access)
- ✅ Process sales only
- ✅ View basic stock levels
- ❌ Cannot add/edit medicines
- ❌ Cannot manage inventory
- ❌ Cannot view reports

## Folder Structure

```
medicine-inventory-app/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Login page
│   ├── layout.tsx           # Root layout with AuthProvider
│   ├── dashboard/           # Dashboard routes
│   ├── inventory/           # Inventory management routes
│   ├── billing/             # POS and sales routes
│   └── expiry/              # Expiry management routes
├── components/              # React components
│   ├── auth/                # Authentication components
│   ├── dashboard/           # Dashboard components
│   ├── inventory/           # Inventory components
│   ├── expiry/              # Expiry management components
│   ├── billing/             # Billing/POS components
│   └── shared/              # Reusable UI components
├── lib/                     # Library code
│   ├── firebase/            # Firebase configuration
│   ├── store/               # Zustand stores
│   └── types/               # TypeScript type definitions
└── public/                  # Static assets
```

## Color Scheme

- **Primary**: #0EA5E9 (Sky Blue) - Healthcare trust
- **Secondary**: #10B981 (Emerald Green) - Health & healing
- **Accent**: #8B5CF6 (Purple) - Premium
- **Warning**: #F59E0B (Amber) - Near expiry alerts
- **Danger**: #EF4444 (Red) - Expired/critical
- **Success**: #22C55E (Green) - Successful actions

## Default Login Credentials

```
Email: owner@medicare.com
Password: [Set in Firebase Auth]
```

## Important Notes

1. **Firebase Security Rules**: Set up proper security rules in Firebase Console for production
2. **Image Upload**: Medicine images are stored in Firebase Storage
3. **GST Calculation**: Default GST rate is 12% (configurable per item)
4. **Invoice Numbers**: Auto-generated with timestamp
5. **FEFO**: System automatically suggests batches with earliest expiry first

## Common Issues & Solutions

### Issue: Firebase not initialized
**Solution**: Ensure all environment variables are correctly set in `.env.local`

### Issue: Authentication not working
**Solution**: Enable Email/Password authentication in Firebase Console

### Issue: Images not uploading
**Solution**: Enable Storage in Firebase and check storage rules

### Issue: Firestore queries failing
**Solution**: Create required composite indexes as mentioned in setup

## Phase 2 Features ✅ IMPLEMENTED

### 1. Customer Management
- ✅ Customer registration with detailed profiles
- ✅ Customer contact information (phone, email, address)
- ✅ Personal details (DOB, gender, blood group)
- ✅ Purchase history tracking
- ✅ Loyalty points system
- ✅ Total purchases and spending analytics
- ✅ Customer search functionality
- ✅ Last visit tracking

### 2. Supplier Management
- ✅ Supplier registration and profiles
- ✅ Company details and contact information
- ✅ GST and drug license tracking
- ✅ Purchase order creation and management
- ✅ Order status tracking (Pending, Confirmed, Delivered, Cancelled)
- ✅ Supplier payment recording
- ✅ Payment methods (Cash, Cheque, Bank Transfer, UPI)
- ✅ Outstanding amount tracking
- ✅ Purchase history per supplier
- ✅ Supplier rating system

### 3. Reports & Analytics
- ✅ **Sales Reports:**
  - Total revenue and transactions
  - Average order value
  - Top selling medicines
  - Sales by payment method
  - Date range filtering
- ✅ **Inventory Reports:**
  - Total medicines and stock value
  - Low stock and out-of-stock items
  - Expired and expiring items count
  - Stock breakdown by category
- ✅ **Profit Analysis (Owner Only):**
  - Total revenue vs cost
  - Gross profit calculation
  - Profit margin percentage
  - Most profitable medicines
  - Detailed profit breakdown

## Phase 3 Features (Future Enhancements)

- Barcode scanning integration
- Prescription management with image upload
- Return/refund management
- Email notifications
- SMS alerts for expiry
- Multi-store support
- Automated backup and restore
- Advanced analytics dashboard
- Inventory forecasting
- Vendor performance tracking

## Support

For issues or questions, please create an issue in the repository.

## License

This project is for educational and commercial use.
