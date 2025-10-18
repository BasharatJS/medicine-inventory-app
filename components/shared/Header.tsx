'use client';

import { useTheme } from '@/lib/contexts/ThemeContext';
import ThemeSelector from './ThemeSelector';

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export default function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <header className={`${theme.header.bg} border-b ${theme.header.border} h-16 fixed top-0 left-0 right-0 z-50 shadow-lg`}>
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${theme.primary.gradient} rounded-xl flex items-center justify-center shadow-md`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className={`text-lg sm:text-xl font-bold ${theme.header.text}`}>MediCare Inventory</h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Theme Selector */}
          <ThemeSelector />

          {/* Menu/Close Toggle Button - Only visible on mobile */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className={`lg:hidden p-2 ${theme.header.text} hover:bg-white/20 rounded-lg transition-colors`}
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              {isSidebarOpen ? (
                // Close Icon (X)
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Menu Icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
