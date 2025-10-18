'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { useTheme } from '@/lib/contexts/ThemeContext';
import Input from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';

export default function CreateAccountPage() {
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'PHARMACIST',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Import firebase auth functions
      const { createUserWithEmailAndPassword } = await import('firebase/auth');

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user document in Firestore
      const userRef = doc(db, COLLECTIONS.USERS, userCredential.user.uid);
      await setDoc(userRef, {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      alert('Account created successfully! Please login.');
      router.push('/');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`min-h-screen ${themeName === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : themeName === 'green' ? 'bg-gradient-to-br from-emerald-50 to-teal-50' : themeName === 'purple' ? 'bg-gradient-to-br from-purple-50 to-pink-50' : themeName === 'amber' ? 'bg-gradient-to-br from-amber-50 to-orange-50' : 'bg-gradient-to-br from-sky-50 to-emerald-50'} flex items-center justify-center p-4`}>
      <div className={`${theme.content.cardBg} rounded-2xl shadow-2xl p-8 w-full max-w-md border ${theme.content.cardBorder}`}>
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${themeName === 'dark' ? 'bg-gray-700' : themeName === 'green' ? 'bg-emerald-600' : themeName === 'purple' ? 'bg-purple-600' : themeName === 'amber' ? 'bg-amber-600' : 'bg-cyan-600'} rounded-2xl mb-4`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className={`text-3xl font-bold ${theme.content.text}`}>Create Account</h1>
          <p className={`${theme.content.textSecondary} mt-2`}>Register your profile</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your full name"
            required
            disabled={isLoading}
          />

          <Input
            label="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />

          <Input
            label="Password *"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Minimum 6 characters"
            required
            disabled={isLoading}
          />

          <Select
            label="Role *"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: 'OWNER', label: 'Owner (Full Access)' },
              { value: 'PHARMACIST', label: 'Pharmacist (Operational)' },
              { value: 'CASHIER', label: 'Cashier (Limited)' },
            ]}
            required
            disabled={isLoading}
          />

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-sm ${theme.content.textSecondary}`}>
            Already have an account?{' '}
            <button
              onClick={() => router.push('/')}
              className={`${themeName === 'dark' ? 'text-emerald-400 hover:text-emerald-300' : themeName === 'green' ? 'text-emerald-600 hover:text-emerald-700' : themeName === 'purple' ? 'text-purple-600 hover:text-purple-700' : themeName === 'amber' ? 'text-amber-600 hover:text-amber-700' : 'text-sky-600 hover:text-sky-700'} font-medium`}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
