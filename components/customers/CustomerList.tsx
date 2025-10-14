'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerStore } from '@/lib/store/customerStore';
import SearchBar from '@/components/inventory/SearchBar';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import Modal from '@/components/shared/Modal';
import AddCustomerForm from './AddCustomerForm';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Card from '@/components/shared/Card';

// Customer list component: Display all customers with search and add functionality
export default function CustomerList() {
  const router = useRouter();
  const { customers, fetchCustomers, isLoading } = useCustomerStore();
  // Local state: Search term and modal visibility
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // useEffect: Fetch all customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Filter customers by name or phone number
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* UI: Header with title and add customer button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Customer Management</h1>
          <p className="text-slate-600 mt-1">{customers.length} customers registered</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary" className="w-full sm:w-auto">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Customer
        </Button>
      </div>

      <Card>
        {/* UI: Search bar for filtering customers */}
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by customer name or phone..."
          />
        </div>

        {/* UI: Show loading, empty state, or customer cards grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No customers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => router.push(`/customers/${customer.id}`)}
                className="p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border border-purple-100 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg">{customer.name}</h3>
                    <p className="text-sm text-slate-600 flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {customer.phone}
                    </p>
                  </div>
                  <Badge variant="info" className="ml-2">{customer.loyaltyPoints} pts</Badge>
                </div>

                <div className="space-y-2 text-sm bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Total Purchases:
                    </span>
                    <span className="font-semibold text-slate-900">{customer.totalPurchases}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Total Spent:
                    </span>
                    <span className="font-bold text-emerald-600">₹{customer.totalSpent.toLocaleString()}</span>
                  </div>
                  {customer.lastVisit && (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <span className="text-slate-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Last Visit:
                      </span>
                      <span className="text-xs font-medium text-slate-700">{new Date(customer.lastVisit.toDate()).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* UI: Modal with add customer form */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Customer"
      >
        <AddCustomerForm
          onSuccess={() => {
            setShowAddModal(false);
            fetchCustomers();
          }}
        />
      </Modal>
    </div>
  );
}
