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

export default function CustomerList() {
  const router = useRouter();
  const { customers, fetchCustomers, isLoading } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Customer Management</h1>
          <p className="text-slate-600 mt-1">{customers.length} customers registered</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Customer
        </Button>
      </div>

      <Card>
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by customer name or phone..."
          />
        </div>

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
                className="p-4 border border-slate-200 rounded-lg hover:border-sky-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{customer.name}</h3>
                    <p className="text-sm text-slate-600">{customer.phone}</p>
                  </div>
                  <Badge variant="info">{customer.loyaltyPoints} pts</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Purchases:</span>
                    <span className="font-medium">{customer.totalPurchases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Spent:</span>
                    <span className="font-medium text-emerald-600">₹{customer.totalSpent.toLocaleString()}</span>
                  </div>
                  {customer.lastVisit && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Visit:</span>
                      <span className="text-xs">{new Date(customer.lastVisit.toDate()).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

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
