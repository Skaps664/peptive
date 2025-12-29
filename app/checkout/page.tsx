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
    <div className="px-6 sm:px-8 lg:px-12 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Same as billing</span>
                </label>
              </div>

              {!sameAsShipping && (
                <div className="grid md:grid-cols-2 gap-4">
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

            {/* Payment Information (Placeholder) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Payment integration would be implemented here using services like Stripe, PayPal, or WooCommerce Payments.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
