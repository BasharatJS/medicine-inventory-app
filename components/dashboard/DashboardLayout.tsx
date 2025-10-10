'use client';

import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-6 ml-64 mt-16 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
