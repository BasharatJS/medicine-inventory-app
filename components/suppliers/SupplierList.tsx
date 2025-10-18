'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupplierStore } from '@/lib/store/supplierStore'
import { useTheme } from '@/lib/contexts/ThemeContext'
import SearchBar from '@/components/inventory/SearchBar'
import Button from '@/components/shared/Button'
import Badge from '@/components/shared/Badge'
import Modal from '@/components/shared/Modal'
import AddSupplierForm from './AddSupplierForm'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import Card from '@/components/shared/Card'

export default function SupplierList() {
  const router = useRouter()
  const { suppliers, fetchSuppliers, isLoading } = useSupplierStore()
  const { theme, themeName } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${theme.content.text}`}>
            Supplier Management
          </h1>
          <p className={`${theme.content.textSecondary} mt-1`}>
            {suppliers.length} suppliers registered
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          variant="primary"
          className="w-full sm:w-auto"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Supplier
        </Button>
      </div>

      <Card>
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by supplier name, company or phone..."
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="text-center py-12">
            <p className={theme.content.textSecondary}>No suppliers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                onClick={() => router.push(`/suppliers/${supplier.id}`)}
                className={`p-4 ${themeName === 'dark' ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' : themeName === 'green' ? 'bg-white border-emerald-200' : themeName === 'purple' ? 'bg-white border-purple-200' : themeName === 'amber' ? 'bg-white border-amber-200' : 'bg-white border-slate-200'} border rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${theme.content.text} text-lg`}>
                      {supplier.name}
                    </h3>
                    <p className={`text-sm ${theme.content.textSecondary} font-medium flex items-center mt-1`}>
                      <svg
                        className={`w-4 h-4 mr-1 ${theme.content.textSecondary}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {supplier.companyName}
                    </p>
                    <p className={`text-xs ${theme.content.textSecondary} mt-1 flex items-center`}>
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {supplier.phone}
                    </p>
                  </div>
                  {supplier.rating && (
                    <Badge variant="success" className="ml-2">
                      ⭐ {supplier.rating}
                    </Badge>
                  )}
                </div>

                <div className={`space-y-2 text-sm ${themeName === 'dark' ? 'bg-gray-600/30' : 'bg-white/60'} rounded-lg p-3 backdrop-blur-sm`}>
                  <div className="flex justify-between items-center">
                    <span className={`${theme.content.textSecondary} flex items-center`}>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Total Orders:
                    </span>
                    <span className={`font-semibold ${theme.content.text}`}>
                      {supplier.totalOrders}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${theme.content.textSecondary} flex items-center`}>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Total Purchase:
                    </span>
                    <span className={`font-bold ${themeName === 'dark' ? 'text-emerald-400' : themeName === 'green' ? 'text-emerald-600' : themeName === 'purple' ? 'text-purple-600' : themeName === 'amber' ? 'text-amber-600' : 'text-sky-600'}`}>
                      ₹{supplier.totalPurchaseAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center pt-2 border-t ${theme.content.cardBorder}`}>
                    <span className={`${theme.content.textSecondary} flex items-center`}>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Outstanding:
                    </span>
                    <span
                      className={`font-bold ${
                        supplier.outstandingAmount > 0
                          ? 'text-red-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      ₹{supplier.outstandingAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Supplier"
        size="lg"
      >
        <AddSupplierForm
          onSuccess={() => {
            setShowAddModal(false)
            fetchSuppliers()
          }}
        />
      </Modal>
    </div>
  )
}
