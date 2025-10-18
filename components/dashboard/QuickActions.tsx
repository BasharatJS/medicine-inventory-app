'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useTheme } from '@/lib/contexts/ThemeContext';
import Card from '@/components/shared/Card';

export default function QuickActions() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { theme, themeName } = useTheme();

  // Get icon colors based on theme
  const getIconColors = () => {
    switch (themeName) {
      case 'green':
        return { bg: 'bg-emerald-100', text: 'text-emerald-600' };
      case 'purple':
        return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'amber':
        return { bg: 'bg-amber-100', text: 'text-amber-600' };
      case 'dark':
        return { bg: 'bg-gray-700', text: 'text-gray-300' };
      default: // light
        return { bg: 'bg-slate-100', text: 'text-slate-600' };
    }
  };

  const iconColors = getIconColors();

  const actions = [
    {
      title: 'New Sale',
      description: 'Process a new transaction',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      onClick: () => router.push('/billing'),
      show: true,
    },
    {
      title: 'Add Medicine',
      description: 'Register new medicine',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      onClick: () => router.push('/inventory/add'),
      show: user?.role !== 'CASHIER',
    },
    {
      title: 'View Inventory',
      description: 'Manage stock levels',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      onClick: () => router.push('/inventory'),
      show: user?.role !== 'CASHIER',
    },
    {
      title: 'Expiry Check',
      description: 'Check expiring medicines',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => router.push('/expiry'),
      show: true,
    },
  ];

  return (
    <Card>
      <h2 className={`text-xl font-semibold ${theme.content.text} mb-4`}>Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.filter(action => action.show).map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-6 rounded-xl ${theme.content.cardBg} border ${theme.content.cardBorder} transition-transform hover:scale-105 hover:shadow-lg text-left`}
          >
            <div className={`${iconColors.bg} ${iconColors.text} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              {action.icon}
            </div>
            <h3 className={`font-semibold text-lg mb-1 ${theme.content.text}`}>{action.title}</h3>
            <p className={`text-sm ${theme.content.textSecondary}`}>{action.description}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}
