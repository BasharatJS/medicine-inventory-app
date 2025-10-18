'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const { themeName } = useTheme();

  // Get variant styles based on theme
  const getVariantStyles = () => {
    let successStyle = '';
    let warningStyle = '';
    let dangerStyle = '';
    let infoStyle = '';
    let defaultStyle = '';

    switch (themeName) {
      case 'green':
        successStyle = 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200';
        warningStyle = 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200';
        dangerStyle = 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200';
        infoStyle = 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200';
        defaultStyle = 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-200';
        break;
      case 'purple':
        successStyle = 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200';
        warningStyle = 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200';
        dangerStyle = 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200';
        infoStyle = 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200';
        defaultStyle = 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200';
        break;
      case 'amber':
        successStyle = 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200';
        warningStyle = 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200';
        dangerStyle = 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200';
        infoStyle = 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200';
        defaultStyle = 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border border-amber-200';
        break;
      case 'dark':
        successStyle = 'bg-gradient-to-r from-emerald-900 to-green-900 text-emerald-300 border border-emerald-700';
        warningStyle = 'bg-gradient-to-r from-amber-900 to-yellow-900 text-amber-300 border border-amber-700';
        dangerStyle = 'bg-gradient-to-r from-red-900 to-rose-900 text-red-300 border border-red-700';
        infoStyle = 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 border border-gray-600';
        defaultStyle = 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 border border-gray-600';
        break;
      default: // light
        successStyle = 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200';
        warningStyle = 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200';
        dangerStyle = 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200';
        infoStyle = 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-200';
        defaultStyle = 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-200';
        break;
    }

    return {
      success: successStyle,
      warning: warningStyle,
      danger: dangerStyle,
      info: infoStyle,
      default: defaultStyle,
    };
  };

  const variantStyles = getVariantStyles();

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full shadow-sm ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
}
