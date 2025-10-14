'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-4 sm:p-6 lg:ml-64 mt-16 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
