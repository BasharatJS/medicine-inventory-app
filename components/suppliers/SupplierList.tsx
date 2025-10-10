'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupplierStore } from '@/lib/store/supplierStore';
import SearchBar from '@/components/inventory/SearchBar';
import Button from '@/components/shared/Button';
import Badge from '@/components/shared/Badge';
import Modal from '@/components/shared/Modal';
import AddSupplierForm from './AddSupplierForm';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Card from '@/components/shared/Card';

export default function SupplierList() {
  const router = useRouter();
  const { suppliers, fetchSuppliers, isLoading } = useSupplierStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Supplier Management</h1>
          <p className="text-slate-600 mt-1">{suppliers.length} suppliers registered</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
            <p className="text-slate-600">No suppliers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                onClick={() => router.push(`/suppliers/${supplier.id}`)}
                className="p-4 border border-slate-200 rounded-lg hover:border-sky-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{supplier.name}</h3>
                    <p className="text-sm text-slate-600">{supplier.companyName}</p>
                    <p className="text-xs text-slate-500 mt-1">{supplier.phone}</p>
                  </div>
                  {supplier.rating && (
                    <Badge variant="success">⭐ {supplier.rating}</Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Orders:</span>
                    <span className="font-medium">{supplier.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Purchase:</span>
                    <span className="font-medium text-sky-600">
                      ₹{supplier.totalPurchaseAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Outstanding:</span>
                    <span className={`font-medium ${supplier.outstandingAmount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
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
            setShowAddModal(false);
            fetchSuppliers();
          }}
        />
      </Modal>
    </div>
  );
}
