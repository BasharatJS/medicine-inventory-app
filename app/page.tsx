'use client';

import LoginForm from '@/components/auth/LoginForm';
import { useTheme } from '@/lib/contexts/ThemeContext';

export default function Home() {
  const { themeName } = useTheme();

  return (
    <main className={`min-h-screen ${themeName === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : themeName === 'green' ? 'bg-gradient-to-br from-emerald-50 to-teal-50' : themeName === 'purple' ? 'bg-gradient-to-br from-purple-50 to-pink-50' : themeName === 'amber' ? 'bg-gradient-to-br from-amber-50 to-orange-50' : 'bg-gradient-to-br from-sky-50 to-emerald-50'} flex items-center justify-center p-4`}>
      <LoginForm />
    </main>
  );
}
