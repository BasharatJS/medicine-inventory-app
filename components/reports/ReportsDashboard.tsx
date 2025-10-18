'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';
import Card from '@/components/shared/Card';
import SalesReportTab from './SalesReportTab';
import InventoryReportTab from './InventoryReportTab';
import ProfitReportTab from './ProfitReportTab';

export default function ReportsDashboard() {
  const { theme, themeName } = useTheme();
  const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'profit'>('sales');

  const tabs = [
    { id: 'sales', label: 'Sales Report', icon: '📊' },
    { id: 'inventory', label: 'Inventory Report', icon: '📦' },
    { id: 'profit', label: 'Profit Analysis', icon: '💰' },
  ];

  const getActiveTabColor = () => {
    switch (themeName) {
      case 'dark': return 'border-emerald-400 text-emerald-400';
      case 'green': return 'border-emerald-600 text-emerald-600';
      case 'purple': return 'border-purple-600 text-purple-600';
      case 'amber': return 'border-amber-600 text-amber-600';
      default: return 'border-sky-600 text-sky-600';
    }
  };

  const getSelectBgColor = () => {
    switch (themeName) {
      case 'dark': return 'bg-gray-800 border-gray-600';
      case 'green': return 'bg-white border-emerald-300';
      case 'purple': return 'bg-white border-purple-300';
      case 'amber': return 'bg-white border-amber-300';
      default: return 'bg-white border-slate-300';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme.content.text}`}>Reports & Analytics</h1>
        <p className={`${theme.content.textSecondary} mt-1 text-xs sm:text-sm`}>Generate comprehensive business reports</p>
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden max-w-full">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as any)}
          className={`w-full px-3 py-3 rounded-lg border-2 ${getSelectBgColor()} ${theme.content.text} font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${themeName === 'dark' ? 'focus:ring-emerald-500' : themeName === 'green' ? 'focus:ring-emerald-500' : themeName === 'purple' ? 'focus:ring-purple-500' : themeName === 'amber' ? 'focus:ring-amber-500' : 'focus:ring-sky-500'} text-sm`}
          style={{ maxWidth: '100%' }}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.icon} {tab.label}
            </option>
          ))}
        </select>
      </div>

      <Card className="overflow-hidden">
        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <div className={`border-b ${theme.content.cardBorder} mb-6`}>
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 px-2 border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? `${getActiveTabColor()} font-semibold`
                      : `border-transparent ${theme.content.textSecondary} hover:${theme.content.text}`
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === 'sales' && <SalesReportTab />}
        {activeTab === 'inventory' && <InventoryReportTab />}
        {activeTab === 'profit' && <ProfitReportTab />}
      </Card>
    </div>
  );
}
