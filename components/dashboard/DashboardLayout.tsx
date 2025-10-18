'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import { useTheme } from '@/lib/contexts/ThemeContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`min-h-screen ${theme.content.bg} overflow-x-hidden`}>
      <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className={`flex min-h-screen ${theme.content.bg}`}>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-4 sm:p-6 lg:ml-64 mt-16 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
