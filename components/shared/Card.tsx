'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`${theme.content.cardBg} rounded-xl shadow-md border ${theme.content.cardBorder} p-4 sm:p-6 transition-all ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
