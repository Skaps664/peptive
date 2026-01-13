'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const subtotal = getSubtotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
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
    country: 'US',
  });

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'US',
  });

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate order processing
    setTimeout(() => {
      alert('Order placed successfully! (Demo mode - WooCommerce order creation would happen here)');
      clearCart();
      router.push('/');
      setLoading(false);
    }, 2000);
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-16 md:py-20 lg:py-20 xl:py-20 2xl:py-24">
      <div className="mb-12 lg:mb-12 xl:mb-12 2xl:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-extrabold text-gray-900 mb-4">
          Checkout
        </h1>
        <p className="text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl text-gray-600">
          Complete your order
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-8 xl:gap-8 2xl:gap-10">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8 lg:space-y-8 xl:space-y-8 2xl:space-y-10">
            {/* Billing Information */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 lg:p-10 xl:p-10 2xl:p-12">
              <h2 className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-900 mb-8 lg:mb-8 xl:mb-8 2xl:mb-10">
                Billing Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-5 lg:gap-5 xl:gap-5 2xl:gap-6">
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
                <Input
                  label="State *"
                  name="state"
                  value={billingInfo.state}
                  onChange={handleBillingChange}
                  required
                />
                <Input
                  label="ZIP Code *"
                  name="postcode"
                  value={billingInfo.postcode}
                  onChange={handleBillingChange}
                  required
                />
                <Input
                  label="Country *"
                  name="country"
                  value={billingInfo.country}
                  onChange={handleBillingChange}
                  required
                />
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 lg:p-10 xl:p-10 2xl:p-12">
              <div className="flex items-center justify-between mb-8 lg:mb-8 xl:mb-8 2xl:mb-10">
                <h2 className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-900">
                  Shipping Information
                </h2>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="mr-3 w-5 h-5 text-gray-900 focus:ring-gray-900 rounded"
                  />
                  <span className="text-base md:text-lg lg:text-lg xl:text-lg font-semibold text-gray-700">Same as billing</span>
                </label>
              </div>

              {!sameAsShipping && (
                <div className="grid md:grid-cols-2 gap-5 lg:gap-5 xl:gap-5 2xl:gap-6">
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
                  <Input
                    label="State *"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                  />
                  <Input
                    label="ZIP Code *"
                    name="postcode"
                    value={shippingInfo.postcode}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                  />
                  <Input
                    label="Country *"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                    required={!sameAsShipping}
                  />
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 lg:p-10 xl:p-10 2xl:p-12">
              <h2 className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-900 mb-8 lg:mb-8 xl:mb-8 2xl:mb-10">
                Payment Information
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-6 lg:p-6 xl:p-6 2xl:p-8">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 lg:w-6 xl:w-6 2xl:w-7 2xl:h-7 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl font-bold text-blue-900 mb-2">
                      Secure Payment via WooCommerce
                    </p>
                    <p className="text-sm md:text-base lg:text-base xl:text-base text-blue-800">
                      You will be redirected to WooCommerce secure checkout to complete payment with Stripe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 lg:p-10 xl:p-10 2xl:p-12 sticky top-24">
              <h2 className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-900 mb-8 lg:mb-8 xl:mb-8 2xl:mb-10">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 lg:space-y-4 xl:space-y-4 2xl:space-y-5 mb-6 lg:mb-6 xl:mb-6 2xl:mb-8 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 lg:gap-4 xl:gap-4 2xl:gap-5 bg-gray-50 p-4 rounded-2xl">
                    <div className="relative w-20 h-20 lg:w-20 xl:w-20 2xl:w-24 2xl:h-24 bg-white rounded-xl flex-shrink-0 overflow-hidden shadow-md">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs lg:text-xs xl:text-xs 2xl:text-sm font-bold rounded-full w-6 h-6 lg:w-6 xl:w-6 2xl:w-7 2xl:h-7 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base md:text-lg lg:text-lg xl:text-lg font-bold text-gray-900 mb-1 truncate">{item.name}</p>
                      <p className="text-base md:text-lg lg:text-lg xl:text-lg font-bold text-gray-900">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="border-t-2 border-gray-100 pt-6 lg:pt-6 xl:pt-6 2xl:pt-7 space-y-4 lg:space-y-4 xl:space-y-4 2xl:space-y-5 mb-6 lg:mb-6 xl:mb-6 2xl:mb-8">
                <div className="flex justify-between text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl text-gray-700">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl text-gray-700">
                  <span className="font-semibold">Shipping</span>
                  <span className="font-bold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl text-gray-700">
                  <span className="font-semibold">Tax</span>
                  <span className="font-bold">{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="border-t-2 border-gray-100 pt-6 lg:pt-6 xl:pt-6 2xl:pt-7 mb-8 lg:mb-8 xl:mb-8 2xl:mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900">Total</span>
                  <span className="text-xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-extrabold text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl font-bold py-5 lg:py-5 xl:py-5 2xl:py-6 px-6 rounded-full hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>

              <p className="text-xs md:text-sm lg:text-sm xl:text-sm text-gray-500 text-center mt-5 lg:mt-5 xl:mt-5 2xl:mt-6">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
