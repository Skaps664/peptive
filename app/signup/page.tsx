'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (result.success) {
        // Auto login after registration
        const loginResult = await authAPI.login({
          username: formData.username,
          password: formData.password,
        });

        if (loginResult.success) {
          router.push('/account');
        } else {
          router.push('/login');
        }
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 md:px-12 lg:px-48 xl:px-64 py-16 md:py-20 lg:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-4 lg:mb-6">
            Create Account
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600">Join Peptive today</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 lg:p-12 xl:p-14">
          {error && (
            <div className="mb-8 p-5 bg-red-50 border-2 border-red-200 rounded-2xl">
              <p className="text-red-700 text-base md:text-lg font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7 lg:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
              <div>
                <label htmlFor="firstName" className="block text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-5 lg:px-6 py-4 lg:py-5 text-base md:text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-5 lg:px-6 py-4 lg:py-5 text-base md:text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 lg:px-6 py-4 lg:py-5 text-base md:text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 lg:px-6 py-4 lg:py-5 text-base md:text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 lg:px-6 py-4 lg:py-5 text-base md:text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 lg:px-6 py-4 lg:py-5 text-base md:text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white text-lg md:text-xl lg:text-2xl font-bold py-5 lg:py-6 px-6 rounded-full hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-10 lg:mt-12 pt-8 lg:pt-10 border-t-2 border-gray-100 text-center">
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-gray-900 hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
