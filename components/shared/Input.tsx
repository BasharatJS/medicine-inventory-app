'use client';

import { InputHTMLAttributes } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  const { theme, themeName } = useTheme();

  // Get focus ring colors based on theme
  const getFocusColors = () => {
    switch (themeName) {
      case 'green':
        return 'focus:ring-emerald-400 focus:border-emerald-500';
      case 'purple':
        return 'focus:ring-purple-400 focus:border-purple-500';
      case 'amber':
        return 'focus:ring-amber-400 focus:border-amber-500';
      case 'dark':
        return 'focus:ring-gray-500 focus:border-gray-400';
      default: // light
        return 'focus:ring-slate-400 focus:border-slate-500';
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
      <input
        className={`block w-full px-4 py-2 border ${
          error ? 'border-red-500 bg-red-50' : `${theme.content.cardBorder} ${theme.content.cardBg}`
        } rounded-lg focus:ring-2 ${getFocusColors()} ${getDisabledBg()} disabled:cursor-not-allowed ${theme.content.text} placeholder:${theme.content.textSecondary} shadow-sm transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
