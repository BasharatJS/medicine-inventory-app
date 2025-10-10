'use client';

import { Medicine } from '@/lib/types';
import Badge from '@/components/shared/Badge';
import Card from '@/components/shared/Card';

interface MedicineCardProps {
  medicine: Medicine;
  onClick?: () => void;
}

export default function MedicineCard({ medicine, onClick }: MedicineCardProps) {
  const getStockBadge = () => {
    const stock = medicine.totalStock || 0;
    if (stock === 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (stock <= medicine.minStockQty) return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-lg">{medicine.name}</h3>
          <p className="text-sm text-slate-600">{medicine.genericName}</p>
        </div>
        {getStockBadge()}
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Manufacturer:</span>
          <span className="font-medium">{medicine.manufacturer}</span>
        </div>
        <div className="flex justify-between">
          <span>Category:</span>
          <Badge variant="info">{medicine.category}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Stock:</span>
          <span className="font-semibold text-slate-900">{medicine.totalStock || 0} units</span>
        </div>
        <div className="flex justify-between">
          <span>Location:</span>
          <span className="font-medium">{medicine.rackLocation}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          <span>MRP:</span>
          <span className="text-lg font-bold text-emerald-600">₹{medicine.mrp}</span>
        </div>
      </div>
    </Card>
  );
}
