'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/lib/store/dashboardStore';
import { useTheme } from '@/lib/contexts/ThemeContext';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function RecentActivity() {
  const { recentActivities, fetchRecentActivities, isLoading } = useDashboardStore();
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

  // Get hover background color based on theme
  const getHoverBg = () => {
    switch (themeName) {
      case 'green':
        return 'hover:bg-emerald-50';
      case 'purple':
        return 'hover:bg-purple-50';
      case 'amber':
        return 'hover:bg-amber-50';
      case 'dark':
        return 'hover:bg-gray-700';
      default: // light
        return 'hover:bg-slate-50';
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, [fetchRecentActivities]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return (
          <div className={`${iconColors.bg} ${iconColors.text} p-2 rounded-lg`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'stock_added':
        return (
          <div className={`${iconColors.bg} ${iconColors.text} p-2 rounded-lg`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'stock_updated':
        return (
          <div className={`${iconColors.bg} ${iconColors.text} p-2 rounded-lg`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${iconColors.bg} ${iconColors.text} p-2 rounded-lg`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatTime = (timestamp: any) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <h2 className={`text-xl font-semibold ${theme.content.text} mb-4`}>Recent Activity</h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : recentActivities.length === 0 ? (
        <p className={`${theme.content.textSecondary} text-center py-8`}>No recent activity</p>
      ) : (
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className={`flex items-start space-x-3 p-3 rounded-lg ${getHoverBg()} transition-colors`}>
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${theme.content.text}`}>{activity.description}</p>
                <p className={`text-xs ${theme.content.textSecondary} mt-1`}>
                  by {activity.userName} • {formatTime(activity.createdAt)}
                </p>
              </div>
              {activity.amount && (
                <span className={`inline-flex items-center font-medium rounded-full shadow-sm px-2.5 py-1 text-sm ${iconColors.bg} ${iconColors.text} border ${theme.content.cardBorder}`}>
                  ₹{activity.amount}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
