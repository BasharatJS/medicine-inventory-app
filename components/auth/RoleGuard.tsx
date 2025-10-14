'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('OWNER' | 'PHARMACIST' | 'CASHIER')[];
}

// Role-based access control component: Protect routes by user role (OWNER/PHARMACIST/CASHIER)
export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  // useEffect: Redirect to login page if user not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // UI: Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // UI: Return null if no user (redirect will happen via useEffect)
  if (!user) {
    return null;
  }

  // UI: Show access denied message if user role not in allowedRoles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // UI: Render children if user has permission
  return <>{children}</>;
}
