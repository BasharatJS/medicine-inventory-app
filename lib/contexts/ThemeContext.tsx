'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'light' | 'dark' | 'green' | 'purple' | 'amber';

export interface Theme {
  name: ThemeName;
  // Header colors
  header: {
    bg: string;
    text: string;
    border: string;
  };
  // Sidebar colors
  sidebar: {
    bg: string;
    text: string;
    textHover: string;
    bgHover: string;
    border: string;
    activeBg: string;
    activeText: string;
    footerBg: string;
  };
  // Content area colors
  content: {
    bg: string;
    cardBg: string;
    cardBorder: string;
    text: string;
    textSecondary: string;
  };
  // Primary accent color
  primary: {
    light: string;
    main: string;
    dark: string;
    gradient: string;
  };
}

const themes: Record<ThemeName, Theme> = {
  light: {
    name: 'light',
    header: {
      bg: 'bg-gradient-to-r from-white to-slate-50',
      text: 'text-slate-800',
      border: 'border-slate-200',
    },
    sidebar: {
      bg: 'bg-white',
      text: 'text-slate-600',
      textHover: 'text-slate-900',
      bgHover: 'bg-slate-100',
      border: 'border-slate-200',
      activeBg: 'bg-slate-200',
      activeText: 'text-slate-900',
      footerBg: 'bg-slate-50',
    },
    content: {
      bg: 'bg-gradient-to-br from-slate-50 via-slate-50 to-slate-50',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-300',
      text: 'text-slate-900',
      textSecondary: 'text-slate-600',
    },
    primary: {
      light: 'from-slate-400 to-slate-500',
      main: 'from-slate-500 to-slate-600',
      dark: 'from-slate-600 to-slate-700',
      gradient: 'bg-gradient-to-r from-slate-500 to-slate-600',
    },
  },
  dark: {
    name: 'dark',
    header: {
      bg: 'bg-gradient-to-r from-gray-900 to-gray-800',
      text: 'text-gray-100',
      border: 'border-gray-700',
    },
    sidebar: {
      bg: 'bg-gray-800',
      text: 'text-gray-400',
      textHover: 'text-gray-100',
      bgHover: 'bg-gray-700',
      border: 'border-gray-700',
      activeBg: 'bg-gray-700',
      activeText: 'text-white',
      footerBg: 'bg-gray-900',
    },
    content: {
      bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-gray-600',
      text: 'text-gray-100',
      textSecondary: 'text-gray-300',
    },
    primary: {
      light: 'from-gray-600 to-gray-700',
      main: 'from-gray-700 to-gray-800',
      dark: 'from-gray-800 to-gray-900',
      gradient: 'bg-gradient-to-r from-gray-700 to-gray-800',
    },
  },
  green: {
    name: 'green',
    header: {
      bg: 'bg-gradient-to-r from-emerald-700 to-teal-700',
      text: 'text-white',
      border: 'border-emerald-600',
    },
    sidebar: {
      bg: 'bg-emerald-800',
      text: 'text-emerald-200',
      textHover: 'text-white',
      bgHover: 'bg-emerald-700',
      border: 'border-emerald-700',
      activeBg: 'bg-gradient-to-r from-teal-500 to-emerald-500',
      activeText: 'text-white',
      footerBg: 'bg-emerald-900',
    },
    content: {
      bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50',
      cardBg: 'bg-white',
      cardBorder: 'border-emerald-300',
      text: 'text-emerald-800',
      textSecondary: 'text-emerald-600',
    },
    primary: {
      light: 'from-emerald-400 to-teal-400',
      main: 'from-emerald-500 to-teal-500',
      dark: 'from-emerald-600 to-teal-600',
      gradient: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    },
  },
  purple: {
    name: 'purple',
    header: {
      bg: 'bg-gradient-to-r from-purple-800 to-indigo-800',
      text: 'text-white',
      border: 'border-purple-700',
    },
    sidebar: {
      bg: 'bg-purple-900',
      text: 'text-purple-200',
      textHover: 'text-white',
      bgHover: 'bg-purple-800',
      border: 'border-purple-800',
      activeBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
      activeText: 'text-white',
      footerBg: 'bg-purple-950',
    },
    content: {
      bg: 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50',
      cardBg: 'bg-white',
      cardBorder: 'border-purple-300',
      text: 'text-purple-800',
      textSecondary: 'text-purple-600',
    },
    primary: {
      light: 'from-purple-400 to-pink-400',
      main: 'from-purple-500 to-pink-500',
      dark: 'from-purple-600 to-pink-600',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
  },
  amber: {
    name: 'amber',
    header: {
      bg: 'bg-gradient-to-r from-amber-700 to-orange-700',
      text: 'text-white',
      border: 'border-amber-600',
    },
    sidebar: {
      bg: 'bg-amber-800',
      text: 'text-amber-200',
      textHover: 'text-white',
      bgHover: 'bg-amber-700',
      border: 'border-amber-700',
      activeBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      activeText: 'text-white',
      footerBg: 'bg-amber-900',
    },
    content: {
      bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
      cardBg: 'bg-white',
      cardBorder: 'border-amber-300',
      text: 'text-amber-800',
      textSecondary: 'text-amber-600',
    },
    primary: {
      light: 'from-amber-400 to-orange-400',
      main: 'from-amber-500 to-orange-500',
      dark: 'from-amber-600 to-orange-600',
      gradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('medicine-app-theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  const handleSetTheme = (newTheme: ThemeName) => {
    setThemeName(newTheme);
    localStorage.setItem('medicine-app-theme', newTheme);
  };

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
