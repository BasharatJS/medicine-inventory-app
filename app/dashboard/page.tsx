'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MetricCard from '@/components/dashboard/MetricCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ExpiryAlerts from '@/components/dashboard/ExpiryAlerts';
import PharmacistDashboard from '@/components/dashboard/PharmacistDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null;
  }

  // Show Pharmacist Dashboard for PHARMACIST role
  if (user.role === 'PHARMACIST') {
    return (
      <DashboardLayout>
        <PharmacistDashboard />
      </DashboardLayout>
    );
  }

  // Show Owner Dashboard for OWNER and CASHIER roles
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, {user.name}!</p>
        </div>

        <MetricCard />
        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <ExpiryAlerts />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
