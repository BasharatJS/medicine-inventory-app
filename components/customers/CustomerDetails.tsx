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

export default function CustomerDetails({ customer }: CustomerDetailsProps) {
  const { purchaseHistory, fetchPurchaseHistory, isLoading } = useCustomerStore();

  useEffect(() => {
    fetchPurchaseHistory(customer.id);
  }, [customer.id, fetchPurchaseHistory]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{customer.name}</h1>
        <p className="text-slate-600 mt-1">Customer Profile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Contact Information</h3>
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

        <Card>
          <h3 className="text-sm font-medium text-slate-600 mb-2">Personal Information</h3>
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

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <h3 className="text-sm font-medium text-emerald-100 mb-2">Purchase Summary</h3>
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

      <Card>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Purchase History</h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : purchaseHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600">No purchase history</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
        )}
      </Card>
    </div>
  );
}
