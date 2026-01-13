'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/auth';
import { User } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isValid = await authAPI.validateToken();
    
    if (!isValid) {
      router.push('/login');
      return;
    }

    const currentUser = await authAPI.getCurrentUser();
    
    if (currentUser) {
      setUser(currentUser);
      // Load orders
      const customerOrders = await authAPI.getCustomerOrders();
      setOrders(customerOrders);
    } else {
      router.push('/login');
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    authAPI.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="px-4 md:px-12 lg:px-48 xl:px-64 py-16 md:py-20 lg:py-24">
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-4 lg:mb-6">
            My Account
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600">
            Welcome back, {user?.firstName || user?.displayName || user?.username}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8 space-y-3">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-5 lg:px-6 py-4 lg:py-5 rounded-2xl text-base md:text-lg lg:text-xl font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-5 lg:px-6 py-4 lg:py-5 rounded-2xl text-base md:text-lg lg:text-xl font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-5 lg:px-6 py-4 lg:py-5 rounded-2xl text-base md:text-lg lg:text-xl font-bold transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Addresses
              </button>
              <div className="pt-4 border-t-2 border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 lg:px-6 py-4 lg:py-5 rounded-2xl text-base md:text-lg lg:text-xl font-bold text-red-600 hover:bg-red-50 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 lg:p-12 xl:p-14">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 lg:mb-10">Profile Information</h2>
                  <div className="space-y-7 lg:space-y-8">
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-7">
                      <div>
                        <label className="block text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.firstName || ''}
                          className="w-full px-5 lg:px-6 py-4 lg:py-5 text-base md:text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.lastName || ''}
                          className="w-full px-5 lg:px-6 py-4 lg:py-5 text-base md:text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-5 lg:px-6 py-4 lg:py-5 text-base md:text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
                        Username
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.username || ''}
                        disabled
                        className="w-full px-5 lg:px-6 py-4 lg:py-5 text-base md:text-lg border-2 border-gray-300 rounded-2xl bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <button className="bg-gray-900 text-white text-lg md:text-xl lg:text-2xl font-bold py-5 lg:py-6 px-10 lg:px-12 rounded-full hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 lg:mb-10">Order History</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-6 lg:space-y-7">
                      {orders.map((order) => (
                        <div key={order.id} className="border-2 border-gray-200 rounded-3xl p-7 lg:p-8 hover:border-gray-900 hover:shadow-xl transition-all">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <p className="text-base md:text-lg text-gray-500 mb-1">Order #{order.id}</p>
                              <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                                {new Date(order.date_created).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-5 py-2 bg-gray-100 text-gray-900 rounded-full text-base md:text-lg font-bold">
                              {order.status}
                            </span>
                          </div>
                          <div className="border-t-2 border-gray-200 pt-6">
                            <p className="text-2xl md:text-3xl font-extrabold text-gray-900">
                              Dhs. {parseFloat(order.total).toFixed(2)}
                            </p>
                            <Link 
                              href={`/orders/${order.id}`}
                              className="inline-block mt-4 text-base md:text-lg font-bold text-gray-900 hover:text-gray-700 hover:underline transition-all"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 lg:py-20">
                      <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8">No orders yet</p>
                      <Link 
                        href="/products"
                        className="inline-block bg-gray-900 text-white text-lg md:text-xl lg:text-2xl font-bold py-5 lg:py-6 px-10 lg:px-12 rounded-full hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 lg:mb-10">Saved Addresses</h2>
                  <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Billing Address */}
                    <div className="border-2 border-gray-200 rounded-3xl p-7 lg:p-8 hover:border-gray-900 transition-all">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Billing Address</h3>
                      <div className="text-gray-600 text-base md:text-lg space-y-2 mb-6">
                        <p>No billing address saved</p>
                      </div>
                      <button className="text-base md:text-lg font-bold text-gray-900 hover:text-gray-700 hover:underline transition-all">
                        Add Address →
                      </button>
                    </div>

                    {/* Shipping Address */}
                    <div className="border-2 border-gray-200 rounded-3xl p-7 lg:p-8 hover:border-gray-900 transition-all">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Shipping Address</h3>
                      <div className="text-gray-600 text-base md:text-lg space-y-2 mb-6">
                        <p>No shipping address saved</p>
                      </div>
                      <button className="text-base md:text-lg font-bold text-gray-900 hover:text-gray-700 hover:underline transition-all">
                        Add Address →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
