'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authAPI.login(formData);
      
      if (result.success) {
        // Redirect to account page or home
        router.push('/account');
      } else {
        setError(result.message || 'Login failed. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 md:px-12 lg:px-12 xl:px-48 2xl:px-64 py-16 md:py-20 lg:py-20 xl:py-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 lg:mb-12 xl:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-gray-900 mb-4 lg:mb-4 xl:mb-6">
            Welcome Back
          </h1>
          <p className="text-lg md:text-xl lg:text-xl xl:text-2xl text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 lg:p-10 xl:p-12 2xl:p-14">
          {error && (
            <div className="mb-8 p-5 bg-red-50 border-2 border-red-200 rounded-2xl">
              <p className="text-red-700 text-base md:text-lg lg:text-lg font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7 lg:space-y-7 xl:space-y-8">
            <div>
              <label htmlFor="username" className="block text-base md:text-lg lg:text-lg xl:text-xl font-bold text-gray-900 mb-3 lg:mb-3 xl:mb-4">
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 lg:px-5 xl:px-6 py-4 lg:py-4 xl:py-5 text-base md:text-lg lg:text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                placeholder="Enter your username or email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-base md:text-lg lg:text-lg xl:text-xl font-bold text-gray-900 mb-3 lg:mb-3 xl:mb-4">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 lg:px-5 xl:px-6 py-4 lg:py-4 xl:py-5 text-base md:text-lg lg:text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-5 w-5 border-gray-300 rounded focus:ring-gray-900"
                />
                <label htmlFor="remember" className="ml-3 text-base md:text-lg lg:text-lg text-gray-600">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-base md:text-lg lg:text-lg font-semibold text-gray-900 hover:underline transition-all">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white text-lg md:text-xl lg:text-xl xl:text-2xl font-bold py-5 lg:py-5 xl:py-6 px-6 rounded-full hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 lg:mt-10 xl:mt-12 pt-8 lg:pt-8 xl:pt-10 border-t-2 border-gray-100 text-center">
            <p className="text-base md:text-lg lg:text-lg xl:text-xl text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-bold text-gray-900 hover:underline transition-all">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
