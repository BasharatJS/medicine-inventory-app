'use client';

import { Medicine } from '@/lib/types';
import Badge from '@/components/shared/Badge';
import Card from '@/components/shared/Card';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface MedicineCardProps {
  medicine: Medicine;
  onClick?: () => void;
}

export default function MedicineCard({ medicine, onClick }: MedicineCardProps) {
  const { theme } = useTheme();

  const getStockBadge = () => {
    const stock = medicine.totalStock || 0;
    if (stock === 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (stock <= medicine.minStockQty) return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
  };

  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`font-bold ${theme.content.text} text-lg`}>{medicine.name}</h3>
          <p className={`text-sm ${theme.content.textSecondary} mt-1`}>{medicine.genericName}</p>
        </div>
        {getStockBadge()}
      </div>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between items-center">
          <span className={theme.content.textSecondary}>Manufacturer:</span>
          <span className={`font-semibold ${theme.content.text}`}>{medicine.manufacturer}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={theme.content.textSecondary}>Category:</span>
          <Badge variant="info">{medicine.category}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className={theme.content.textSecondary}>Stock:</span>
          <span className={`font-bold ${theme.content.text}`}>{medicine.totalStock || 0} units</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={theme.content.textSecondary}>Location:</span>
          <span className={`font-semibold ${theme.content.text}`}>{medicine.rackLocation}</span>
        </div>
        <div className={`flex justify-between items-center pt-3 mt-3 border-t-2 ${theme.content.cardBorder}`}>
          <span className={`${theme.content.text} font-medium`}>MRP:</span>
          <span className="text-xl font-bold text-emerald-600">₹{medicine.mrp}</span>
        </div>
      </div>
    </Card>
  );
}
