'use client';

import { useState } from 'react';
import Card from '@/components/shared/Card';
import SalesReportTab from './SalesReportTab';
import InventoryReportTab from './InventoryReportTab';
import ProfitReportTab from './ProfitReportTab';

export default function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'profit'>('sales');

  const tabs = [
    { id: 'sales', label: 'Sales Report', icon: '📊' },
    { id: 'inventory', label: 'Inventory Report', icon: '📦' },
    { id: 'profit', label: 'Profit Analysis', icon: '💰' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Reports & Analytics</h1>
        <p className="text-slate-600 mt-1">Generate comprehensive business reports</p>
      </div>

      <Card>
        <div className="border-b border-slate-200 mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-2 border-b-2 transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'sales' && <SalesReportTab />}
        {activeTab === 'inventory' && <InventoryReportTab />}
        {activeTab === 'profit' && <ProfitReportTab />}
      </Card>
    </div>
  );
}
