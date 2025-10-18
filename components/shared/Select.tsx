'use client';

import { SelectHTMLAttributes } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, error, options, className = '', ...props }: SelectProps) {
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

  const getDisabledBg = () => {
    return themeName === 'dark' ? 'disabled:bg-gray-700' : 'disabled:bg-slate-100';
  };

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium ${theme.content.text} mb-2`}>
          {label}
        </label>
      )}
      <select
        className={`block w-full px-4 py-2 border ${
          error ? 'border-red-500' : theme.content.cardBorder
        } rounded-lg focus:ring-2 ${getFocusColors()} ${getDisabledBg()} disabled:cursor-not-allowed ${theme.content.text} ${theme.content.cardBg} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
