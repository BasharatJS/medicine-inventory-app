'use client';

import { useTheme } from '@/lib/contexts/ThemeContext';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  const { theme, themeName } = useTheme();

  // Get focus ring colors based on theme
  const getFocusColors = () => {
    switch (themeName) {
      case 'green':
        return 'focus:ring-emerald-500 focus:border-emerald-500';
      case 'purple':
        return 'focus:ring-purple-500 focus:border-purple-500';
      case 'amber':
        return 'focus:ring-amber-500 focus:border-amber-500';
      case 'dark':
        return 'focus:ring-gray-500 focus:border-gray-500';
      default: // light
        return 'focus:ring-slate-500 focus:border-slate-500';
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className={`h-5 w-5 ${theme.content.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full pl-10 pr-3 py-2 border ${theme.content.cardBorder} rounded-lg leading-5 ${theme.content.cardBg} placeholder-${themeName === 'dark' ? 'gray-500' : 'slate-400'} ${theme.content.text} focus:outline-none focus:ring-2 ${getFocusColors()} sm:text-sm`}
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg className={`h-5 w-5 ${theme.content.textSecondary} hover:${theme.content.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
