'use client';

import { useEffect } from 'react';
import { useCustomerStore } from '@/lib/store/customerStore';
import { Customer } from '@/lib/types';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface CustomerDetailsProps {
  customer: Customer;
}

// Customer details component: Display customer info and purchase history
export default function CustomerDetails({ customer }: CustomerDetailsProps) {
  const { purchaseHistory, fetchPurchaseHistory, isPurchaseHistoryLoading } = useCustomerStore();

  // useEffect: Fetch purchase history when customer changes
  useEffect(() => {
    fetchPurchaseHistory(customer.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer.id]);

  return (
    <div className="space-y-6">
      {/* UI: Customer name header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{customer.name}</h1>
        <p className="text-slate-600 mt-1">Customer Profile</p>
      </div>

      {/* UI: Three column grid - Contact, Personal Info, Purchase Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100">
          <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Information
          </h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="font-semibold text-slate-900">{customer.phone}</p>
            </div>
            {customer.email && (
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-semibold text-slate-900">{customer.email}</p>
              </div>
            )}
            {customer.address && (
              <div>
                <p className="text-xs text-slate-500">Address</p>
                <p className="text-sm text-slate-900">{customer.address}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 border border-pink-100">
          <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>
          <div className="space-y-2">
            {customer.gender && (
              <div>
                <p className="text-xs text-slate-500">Gender</p>
                <p className="font-semibold text-slate-900">{customer.gender}</p>
              </div>
            )}
            {customer.bloodGroup && (
              <div>
                <p className="text-xs text-slate-500">Blood Group</p>
                <p className="font-semibold text-slate-900">{customer.bloodGroup}</p>
              </div>
            )}
            {customer.dateOfBirth && (
              <div>
                <p className="text-xs text-slate-500">Date of Birth</p>
                <p className="font-semibold text-slate-900">
                  {new Date(customer.dateOfBirth.toDate()).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
          <h3 className="text-sm font-medium text-emerald-100 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Purchase Summary
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold">{customer.totalPurchases}</p>
              <p className="text-sm text-emerald-100">Total Orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold">₹{customer.totalSpent.toLocaleString()}</p>
              <p className="text-sm text-emerald-100">Total Spent</p>
            </div>
            <div className="pt-2 border-t border-emerald-400">
              <div className="flex items-center justify-between">
                <span className="text-sm">Loyalty Points</span>
                <Badge variant="success">{customer.loyaltyPoints}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* UI: Purchase history table with invoice details */}
      <Card>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4">Purchase History</h2>

        {/* UI: Show loading, empty state, or history table */}
        {isPurchaseHistoryLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : purchaseHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600">No purchase history</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {purchaseHistory.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border border-cyan-100 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium mb-1">Invoice</p>
                      <p className="font-semibold text-slate-900">{purchase.invoiceNumber}</p>
                    </div>
                    <Badge variant="info">{purchase.items.length} items</Badge>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-cyan-200">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Date</p>
                      <p className="text-sm text-slate-600">
                        {new Date(purchase.purchaseDate.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Amount</p>
                      <p className="text-lg font-bold text-emerald-600">
                        ₹{Math.round(purchase.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {purchaseHistory.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{purchase.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(purchase.purchaseDate.toDate()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="info">{purchase.items.length} items</Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold text-emerald-600">
                        ₹{Math.round(purchase.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
