// Client-side component for Next.js
'use client'

// Import React hooks for state and side effects
import { useEffect, useState } from 'react'
// Import batch store for fetching and managing batches
import { useBatchStore } from '@/lib/store/batchStore'
// Import theme context
import { useTheme } from '@/lib/contexts/ThemeContext'
// Import form component for adding new batches
import AddBatchForm from './AddBatchForm'
// Import shared UI componentsmedicine
import Badge from '@/components/shared/Badge'
import Button from '@/components/shared/Button'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import Modal from '@/components/shared/Modal'

// Props interface: medicineId to fetch batches for specific medicine
interface BatchListProps {
  medicineId: string // ID of medicine to show batches for
}

// Component: Displays list of batches for a medicine with add batch functionality
export default function BatchList({ medicineId }: BatchListProps) {
  // Get batches data and functions from Zustand store
  const { batches, fetchBatchesByMedicine, isLoading } = useBatchStore()
  // Get theme context
  const { theme, themeName } = useTheme()
  // Local state for controlling add batch modal visibility
  const [showAddModal, setShowAddModal] = useState(false)

  // Effect: Fetch batches when component mounts or medicineId changes
  useEffect(() => {
    if (medicineId) {
      // API call via store: Fetch batches for this medicine
      fetchBatchesByMedicine(medicineId)
    }
    // Disable exhaustive-deps to prevent infinite loop (fetchBatchesByMedicine is stable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicineId])

  // Helper function: Calculate days remaining until expiry
  const getDaysRemaining = (expiryDate: any) => {
    // Convert Firestore Timestamp to Date if needed
    const expiry = expiryDate?.toDate
      ? expiryDate.toDate()
      : new Date(expiryDate)
    const now = new Date()
    // Calculate difference in days and round up
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  // Helper function: Return appropriate badge based on days remaining
  const getExpiryBadge = (daysRemaining: number) => {
    if (daysRemaining < 0) return <Badge variant="danger">Expired</Badge> // Already expired
    if (daysRemaining <= 30)
      return <Badge variant="danger">{daysRemaining} days</Badge> // Critical: <30 days
    if (daysRemaining <= 60)
      return <Badge variant="warning">{daysRemaining} days</Badge> // Warning: 30-60 days
    if (daysRemaining <= 90)
      return <Badge variant="warning">{daysRemaining} days</Badge> // Caution: 60-90 days
    return <Badge variant="success">{daysRemaining} days</Badge> // Safe: >90 days
  }

  // Get table header background based on theme
  const getHeaderBg = () => {
    switch (themeName) {
      case 'green':
        return 'bg-emerald-50'
      case 'purple':
        return 'bg-purple-50'
      case 'amber':
        return 'bg-amber-50'
      case 'dark':
        return 'bg-gray-700'
      default: // light
        return 'bg-slate-50'
    }
  }

  // Get hover background based on theme
  const getHoverBg = () => {
    switch (themeName) {
      case 'green':
        return 'hover:bg-emerald-50'
      case 'purple':
        return 'hover:bg-purple-50'
      case 'amber':
        return 'hover:bg-amber-50'
      case 'dark':
        return 'hover:bg-gray-700'
      default: // light
        return 'hover:bg-slate-50'
    }
  }

  // Get divider color based on theme
  const getDividerColor = () => {
    switch (themeName) {
      case 'green':
        return 'divide-emerald-200'
      case 'purple':
        return 'divide-purple-200'
      case 'amber':
        return 'divide-amber-200'
      case 'dark':
        return 'divide-gray-700'
      default: // light
        return 'divide-slate-200'
    }
  }

  // Get border color class for mobile cards
  const getCardBorderColor = () => {
    switch (themeName) {
      case 'green':
        return 'border-emerald-200'
      case 'purple':
        return 'border-purple-200'
      case 'amber':
        return 'border-amber-200'
      case 'dark':
        return 'border-gray-700'
      default: // light
        return 'border-slate-200'
    }
  }

  // UI Render: Main component layout
  return (
    <div className="space-y-6">
      {/* Header: Title and Add Batch button */}
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${theme.content.text}`}>
          Batches
        </h2>
        {/* Button: Opens modal to add new batch */}
        <Button onClick={() => setShowAddModal(true)} variant="primary">
          Add New Batch
        </Button>
      </div>

      {/* Conditional Rendering: Loading state */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : batches.length === 0 ? (
        /* Empty State: No batches found */
        <div
          className={`text-center py-12 ${theme.content.cardBg} rounded-xl border ${theme.content.cardBorder}`}
        >
          <p className={theme.content.textSecondary}>
            No batches found. Add your first batch to manage stock.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {batches.map((batch) => {
              const daysRemaining = getDaysRemaining(batch.expiryDate)
              return (
                <div
                  key={batch.id}
                  className={`${theme.content.cardBg} rounded-xl shadow-md border ${theme.content.cardBorder} p-4 space-y-4`}
                >
                  {/* Header: Batch Number and Expiry Badge */}
                  <div
                    className={`flex justify-between items-center pb-3 border-b ${getCardBorderColor()}`}
                  >
                    <div className="flex-1">
                      <p
                        className={`text-xs ${theme.content.textSecondary} uppercase tracking-wide mb-1`}
                      >
                        Batch Number
                      </p>
                      <p className={`text-lg font-bold ${theme.content.text}`}>
                        {batch.batchNumber}
                      </p>
                    </div>
                    <div>{getExpiryBadge(daysRemaining)}</div>
                  </div>

                  {/* Stock Info */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm ${theme.content.textSecondary}`}
                      >
                        Quantity in Stock
                      </span>
                      <span
                        className={`text-base font-semibold ${theme.content.text}`}
                      >
                        {batch.quantity} units
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm ${theme.content.textSecondary}`}
                      >
                        MRP
                      </span>
                      <span
                        className={`text-base font-semibold ${theme.content.text}`}
                      >
                        ₹{batch.mrp}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm ${theme.content.textSecondary}`}
                      >
                        Purchase Price
                      </span>
                      <span
                        className={`text-base font-semibold ${theme.content.text}`}
                      >
                        ₹{batch.purchasePrice}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm ${theme.content.textSecondary}`}
                      >
                        Expiry Date
                      </span>
                      <span
                        className={`text-base font-semibold ${theme.content.text}`}
                      >
                        {new Date(batch.expiryDate.toDate()).toLocaleDateString(
                          'en-IN',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm ${theme.content.textSecondary}`}
                      >
                        Supplier
                      </span>
                      <span
                        className={`text-base font-medium ${theme.content.text} text-right`}
                      >
                        {batch.supplierName}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop Table View */}
          <div
            className={`hidden md:block ${theme.content.cardBg} rounded-xl shadow-sm border ${theme.content.cardBorder} overflow-hidden`}
          >
            <table className="w-full">
              {/* Table Header: Column names */}
              <thead className={getHeaderBg()}>
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}
                  >
                    Batch Number
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}
                  >
                    Quantity
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}
                  >
                    MRP
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}
                  >
                    Purchase Price
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}
                  >
                    Expiry Date
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${theme.content.textSecondary} uppercase`}
                  >
                    Supplier
                  </th>
                </tr>
              </thead>
              {/* Table Body: Map through batches array */}
              <tbody className={`divide-y ${getDividerColor()}`}>
                {batches.map((batch) => {
                  // Calculate days remaining for expiry badge
                  const daysRemaining = getDaysRemaining(batch.expiryDate)
                  return (
                    <tr key={batch.id} className={getHoverBg()}>
                      {/* Display batch number */}
                      <td
                        className={`px-6 py-4 font-medium ${theme.content.text}`}
                      >
                        {batch.batchNumber}
                      </td>
                      {/* Display quantity in stock */}
                      <td
                        className={`px-6 py-4 ${theme.content.textSecondary}`}
                      >
                        {batch.quantity}
                      </td>
                      {/* Display maximum retail price */}
                      <td
                        className={`px-6 py-4 ${theme.content.textSecondary}`}
                      >
                        ₹{batch.mrp}
                      </td>
                      {/* Display purchase/cost price */}
                      <td
                        className={`px-6 py-4 ${theme.content.textSecondary}`}
                      >
                        ₹{batch.purchasePrice}
                      </td>
                      {/* Display expiry date with color-coded badge */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-sm ${theme.content.textSecondary}`}
                          >
                            {new Date(
                              batch.expiryDate.toDate()
                            ).toLocaleDateString()}
                          </span>
                          {/* Badge: Shows expiry status (expired/warning/safe) */}
                          {getExpiryBadge(daysRemaining)}
                        </div>
                      </td>
                      {/* Display supplier name */}
                      <td
                        className={`px-6 py-4 ${theme.content.textSecondary}`}
                      >
                        {batch.supplierName}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal: Add new batch form */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Batch"
      >
        {/* Form Component: Handles batch creation */}
        <AddBatchForm
          medicineId={medicineId}
          onSuccess={() => {
            setShowAddModal(false) // Close modal on success
            fetchBatchesByMedicine(medicineId) // Refresh batch list
          }}
        />
      </Modal>
    </div>
  )
}
