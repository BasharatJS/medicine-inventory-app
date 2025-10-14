'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Alert from '@/components/shared/Alert';

// Login form component with email/password authentication
export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  // Local state: Store email, password, and rememberMe checkbox
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Handle form submission: Call login API and redirect to dashboard on success
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password, formData.rememberMe);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      {/* UI: Logo and app title section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-600 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">MediCare Inventory</h1>
        <p className="text-slate-600 mt-2">Sign in to your account</p>
      </div>

      {/* UI: Show error alert if login fails */}
      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      {/* UI: Login form with email and password inputs */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@email.com"
          required
          disabled={isLoading}
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter your password"
          required
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              className="w-4 h-4 text-sky-500 border-slate-300 rounded focus:ring-sky-500 focus:ring-2"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-slate-600">Remember me</span>
          </label>
        </div>

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      {/* UI: Create account link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <button
            onClick={() => router.push('/create-account')}
            className="text-sky-600 hover:text-sky-700 font-medium"
            type="button"
          >
            Create Account
          </button>
        </p>
      </div>

      {/* UI: Demo credentials section for testing (Owner and Pharmacist accounts) */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs font-semibold text-slate-700 mb-3 text-center">Demo Credentials</p>
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-sky-50 to-emerald-50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-slate-700 mb-1">👨‍💼 Owner Account</p>
            <p className="text-xs text-slate-600">Email: basharat@gmail.com</p>
            <p className="text-xs text-slate-600">Password: 12345678</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-slate-700 mb-1">💊 Pharmacist Account</p>
            <p className="text-xs text-slate-600">Email: pharma@gmail.com</p>
            <p className="text-xs text-slate-600">Password: 12345678</p>
          </div>
        </div>
      </div>
    </div>
  );
}
