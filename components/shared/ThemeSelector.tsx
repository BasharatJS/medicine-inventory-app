'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeName } from '@/lib/contexts/ThemeContext';

export default function ThemeSelector() {
  const { themeName, setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes: { name: ThemeName; label: string; icon: string; colors: string }[] = [
    { name: 'light', label: 'Light', icon: '☀️', colors: 'from-slate-700 to-blue-600' },
    { name: 'dark', label: 'Dark', icon: '🌙', colors: 'from-gray-800 to-indigo-700' },
    { name: 'green', label: 'Green', icon: '🌿', colors: 'from-emerald-600 to-teal-600' },
    { name: 'purple', label: 'Purple', icon: '💜', colors: 'from-purple-600 to-pink-600' },
    { name: 'amber', label: 'Amber', icon: '🌅', colors: 'from-amber-600 to-orange-600' },
  ];

  const currentTheme = themes.find(t => t.name === themeName);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleThemeChange = (theme: ThemeName) => {
    setTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${theme.header.border} transition-colors ${theme.header.text} ${
          themeName === 'light'
            ? 'bg-slate-50 hover:bg-slate-100'
            : 'bg-white/10 hover:bg-white/20'
        }`}
        aria-label="Select theme"
      >
        <span className="text-lg">{currentTheme?.icon}</span>
        <span className="hidden sm:inline text-sm font-medium">{currentTheme?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Choose Theme
            </div>
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors ${
                  themeName === theme.name ? 'bg-slate-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{theme.icon}</span>
                  <span className="font-medium text-slate-900">{theme.label}</span>
                </div>
                {themeName === theme.name && (
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Preview Strip */}
          <div className="border-t border-slate-200 p-3 bg-slate-50">
            <div className="text-xs text-slate-600 mb-2">Preview</div>
            <div className={`h-8 rounded-lg bg-gradient-to-r ${themes.find(t => t.name === themeName)?.colors} shadow-md`}></div>
          </div>
        </div>
      )}
    </div>
  );
}
