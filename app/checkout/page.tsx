'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Countries we operate in (from CountrySelector)
const AVAILABLE_COUNTRIES = [
  { code: 'BH', name: 'Bahrain' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'OM', name: 'Oman' },
  { code: 'QA', name: 'Qatar' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'US', name: 'United States' },
];

// States for countries that have them
const COUNTRY_STATES: Record<string, string[]> = {
  US: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
       'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
       'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
       'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
       'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
       'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
       'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  AE: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
  SA: ['Riyadh', 'Makkah', 'Madinah', 'Eastern Province', 'Asir', 'Tabuk', 'Qassim', 'Hail', 'Northern Borders', 'Jizan', 'Najran', 'Al Bahah', 'Al Jawf'],
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  
  const subtotal = getSubtotal();
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const total = subtotal + tax + shipping;

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'AE', // Default to UAE
  });

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'AE', // Default to UAE
  });

  // Calculate shipping and tax when location changes
  useEffect(() => {
    const calculateShippingAndTax = async () => {
      if (!billingInfo.country || items.length === 0) return;

      setCalculatingShipping(true);
      try {
        const response = await fetch('/api/calculate-shipping-tax', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items.map(item => ({ id: item.id, quantity: item.quantity })),
            country: billingInfo.country,
            state: billingInfo.state,
            postcode: billingInfo.postcode,
            city: billingInfo.city,
          }),
        });

        const data = await response.json();
        
        if (data.shipping !== undefined) {
          setShipping(data.shipping);
        }
        if (data.tax !== undefined) {
          setTax(data.tax);
        }
      } catch (err) {
        console.error('Error calculating shipping:', err);
        // Keep default values
      } finally {
        setCalculatingShipping(false);
      }
    };

    // Debounce the calculation
    const timer = setTimeout(() => {
      calculateShippingAndTax();
    }, 500);

    return () => clearTimeout(timer);
  }, [billingInfo.country, billingInfo.state, billingInfo.postcode, billingInfo.city, items]);

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          couponCode: couponCode.trim() || undefined,
          customerEmail: billingInfo.email,
          billingDetails: billingInfo,
          shippingDetails: sameAsShipping ? billingInfo : shippingInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe && data.sessionId) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      } else {
        throw new Error('Stripe failed to load');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 md:px-8 lg:px-12 py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-normal text-gray-900 mb-2">
          Checkout
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Complete your order
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Billing Information */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-normal text-gray-900 mb-4">
                Billing Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                <Input
                  label="First Name *"
                  name="firstName"
                  value={billingInfo.firstName}
                  onChange={handleBillingChange}
                  required
                />
                <Input
                  label="Last Name *"
                  name="lastName"
                  value={billingInfo.lastName}
                  onChange={handleBillingChange}
                  required
                />
                <Input
                  label="Email *"
                  name="email"
                  type="email"
                  value={billingInfo.email}
                  onChange={handleBillingChange}
                  required
                  className="md:col-span-2"
                />
                <Input
                  label="Phone *"
                  name="phone"
                  type="tel"
                  value={billingInfo.phone}
                  onChange={handleBillingChange}
                  required
                  className="md:col-span-2"
                />
                <Input
                  label="Address Line 1 *"
                  name="address1"
                  value={billingInfo.address1}
                  onChange={handleBillingChange}
                  required
                  className="md:col-span-2"
                />
                <Input
                  label="Address Line 2"
                  name="address2"
                  value={billingInfo.address2}
                  onChange={handleBillingChange}
                  className="md:col-span-2"
                />
                <Input
                  label="City *"
                  name="city"
                  value={billingInfo.city}
                  onChange={handleBillingChange}
                  required
                />
                
                {/* State/Province Select - only show if country has states */}
                {COUNTRY_STATES[billingInfo.country] ? (
                  <div>
                    <label className="block text-xs md:text-sm font-normal text-gray-700 mb-2">
                      State/Province *
                    </label>
                    <select
                      name="state"
                      value={billingInfo.state}
                      onChange={handleBillingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-normal focus:border-gray-900 focus:outline-none bg-white"
                    >
                      <option value="">Select State/Province</option>
                      {COUNTRY_STATES[billingInfo.country].map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <Input
                    label="State/Province"
                    name="state"
                    value={billingInfo.state}
                    onChange={handleBillingChange}
                  />
                )}
                
                <Input
                  label="ZIP Code *"
                  name="postcode"
                  value={billingInfo.postcode}
                  onChange={handleBillingChange}
                  required
                />
                
                {/* Country Select */}
                <div>
                  <label className="block text-xs md:text-sm font-normal text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={billingInfo.country}
                    onChange={handleBillingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-normal focus:border-gray-900 focus:outline-none bg-white"
                  >
                    <option value="">Select Country</option>
                    {AVAILABLE_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-normal text-gray-900">
                  Shipping Information
                </h2>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="mr-2 w-4 h-4 text-gray-900 focus:ring-gray-900 rounded"
                  />
                  <span className="text-xs md:text-sm font-normal text-gray-700">Same as billing</span>
                </label>
              </div>

              {!sameAsShipping && (
                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                  <Input
                    label="First Name *"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                  />
                  <Input
                    label="Last Name *"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                  />
                  <Input
                    label="Address Line 1 *"
                    name="address1"
                    value={shippingInfo.address1}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                    className="md:col-span-2"
                  />
                  <Input
                    label="Address Line 2"
                    name="address2"
                    value={shippingInfo.address2}
                    onChange={handleShippingChange}
                    className="md:col-span-2"
                  />
                  <Input
                    label="City *"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                  />
                  
                  {/* State/Province Select - only show if country has states */}
                  {COUNTRY_STATES[shippingInfo.country] ? (
                    <div>
                      <label className="block text-xs md:text-sm font-normal text-gray-700 mb-2">
                        State/Province *
                      </label>
                      <select
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        required={!sameAsShipping}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-normal focus:border-gray-900 focus:outline-none bg-white"
                      >
                        <option value="">Select State/Province</option>
                        {COUNTRY_STATES[shippingInfo.country].map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <Input
                      label="State/Province"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                    />
                  )}
                  
                  <Input
                    label="ZIP Code *"
                    name="postcode"
                    value={shippingInfo.postcode}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                  />
                  
                  {/* Country Select */}
                  <div>
                    <label className="block text-xs md:text-sm font-normal text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      required={!sameAsShipping}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-normal focus:border-gray-900 focus:outline-none bg-white"
                    >
                      <option value="">Select Country</option>
                      {AVAILABLE_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-normal text-gray-900 mb-4">
                Payment Information
              </h2>

              {/* Coupon Code Input */}
              <div className="mb-4">
                <label className="block text-xs md:text-sm font-normal text-gray-700 mb-2">
                  Discount Code (Optional)
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-normal focus:border-gray-900 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If you have a discount code, enter it above
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-300 rounded-lg p-3">
                  <p className="text-red-800 text-xs md:text-sm font-normal">{error}</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm md:text-base font-normal text-blue-900 mb-1">
                      Secure Payment via Stripe
                    </p>
                    <p className="text-xs md:text-sm text-blue-800">
                      You will be redirected to Stripe's secure checkout to complete your payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 md:p-6 sticky top-24">
              <h2 className="text-base md:text-lg font-normal text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-xl">
                    <div className="relative w-14 h-14 bg-white rounded-lg flex-shrink-0 overflow-hidden shadow-sm">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-normal rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-normal text-gray-900 mb-1 truncate">{item.name}</p>
                      <p className="text-xs md:text-sm font-normal text-gray-900">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-xs md:text-sm text-gray-700">
                  <span className="font-normal">Subtotal</span>
                  <span className="font-normal">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-gray-700">
                  <span className="font-normal">Shipping</span>
                  <span className="font-normal">
                    {calculatingShipping ? 'Calculating...' : shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-gray-700">
                  <span className="font-normal">Tax</span>
                  <span className="font-normal">
                    {calculatingShipping ? 'Calculating...' : formatPrice(tax)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm md:text-base font-normal text-gray-900">Total</span>
                  <span className="text-sm md:text-base font-normal text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white text-sm md:text-base font-normal py-3 px-4 rounded-full hover:bg-gray-800 transition-all duration-200 shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
