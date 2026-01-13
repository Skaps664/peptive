# Implementation Examples

This file shows practical examples of how to use the headless WooCommerce setup in your Next.js components.

---

## 📦 Products Page with Reviews

```typescript
// app/products/[slug]/page.tsx
import { woocommerce } from '@/lib/woocommerce';
import { notFound } from 'next/navigation';

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await woocommerce.getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }

  // Fetch reviews for this product
  const reviews = await woocommerce.getProductReviews(product.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.name} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl mt-4">${product.price}</p>
          
          {/* Rating Display */}
          <div className="flex items-center mt-2">
            <span className="text-yellow-500">★</span>
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-gray-500 ml-2">
              ({product.ratingCount} reviews)
            </span>
          </div>

          <div 
            className="mt-6" 
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.reviewer}</span>
                  {review.verified && (
                    <span className="text-green-600 text-sm">✓ Verified</span>
                  )}
                </div>
                <div className="text-yellow-500">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
                <p className="mt-2 text-gray-700">{review.review}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(review.date_created).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🏠 Home Page with Hero Section

```typescript
// app/page.tsx
import { wordpress } from '@/lib/wordpress';
import { woocommerce } from '@/lib/woocommerce';

export default async function HomePage() {
  const heroSection = await wordpress.getHeroSection('home');
  const featuredProducts = await woocommerce.getFeaturedProducts(8);

  return (
    <div>
      {/* Hero Section from WordPress */}
      {heroSection && (
        <section 
          className="relative h-[500px] bg-cover bg-center"
          style={{ backgroundImage: `url(${heroSection.image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4">{heroSection.title}</h1>
              <p className="text-xl mb-8">{heroSection.subtitle}</p>
              <a 
                href={heroSection.ctaLink}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg inline-block"
              >
                {heroSection.ctaText}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <a 
              key={product.id}
              href={`/products/${product.slug}`}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-lg font-bold mt-2">${product.price}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
```

---

## 🛒 Store API Cart Integration

Create a new cart store that uses WooCommerce Store API:

```typescript
// store/storeCartStore.ts
'use client';

import { create } from 'zustand';
import { storeAPI } from '@/lib/store-api';
import { StoreCart } from '@/types';

interface StoreCartStore {
  cart: StoreCart | null;
  isOpen: boolean;
  isLoading: boolean;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemKey: string, quantity: number) => Promise<void>;
  removeItem: (itemKey: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Getters
  getItemCount: () => number;
  getTotal: () => string;
}

export const useStoreCart = create<StoreCartStore>((set, get) => ({
  cart: null,
  isOpen: false,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    const cart = await storeAPI.getCart();
    set({ cart, isLoading: false });
  },

  addToCart: async (productId, quantity = 1) => {
    set({ isLoading: true });
    const cart = await storeAPI.addToCart(productId, quantity);
    set({ cart, isLoading: false });
    get().openCart();
  },

  updateQuantity: async (itemKey, quantity) => {
    set({ isLoading: true });
    const cart = await storeAPI.updateCartItem(itemKey, quantity);
    set({ cart, isLoading: false });
  },

  removeItem: async (itemKey) => {
    set({ isLoading: true });
    const cart = await storeAPI.removeCartItem(itemKey);
    set({ cart, isLoading: false });
  },

  applyCoupon: async (code) => {
    set({ isLoading: true });
    const cart = await storeAPI.applyCoupon(code);
    set({ cart, isLoading: false });
  },

  removeCoupon: async (code) => {
    set({ isLoading: true });
    const cart = await storeAPI.removeCoupon(code);
    set({ cart, isLoading: false });
  },

  toggleCart: () => set({ isOpen: !get().isOpen }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getItemCount: () => {
    const cart = get().cart;
    return cart?.items_count || 0;
  },

  getTotal: () => {
    const cart = get().cart;
    return cart?.totals.total_price || '0';
  },
}));
```

### Using Store API Cart in Components

```typescript
// components/ProductCard.tsx
'use client';

import { useStoreCart } from '@/store/storeCartStore';
import { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, isLoading } = useStoreCart();

  const handleAddToCart = async () => {
    await addToCart(product.id);
  };

  return (
    <div className="border rounded-lg p-4">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <h3 className="font-semibold mt-2">{product.name}</h3>
      <p className="text-lg font-bold">${product.price}</p>
      
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

---

## 💳 Checkout Page Integration

```typescript
// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useStoreCart } from '@/store/storeCartStore';
import { storeAPI } from '@/lib/store-api';
import { StoreCheckoutData } from '@/types';

export default function CheckoutPage() {
  const { cart } = useStoreCart();
  const [formData, setFormData] = useState<StoreCheckoutData>({
    billing_address: {
      first_name: '',
      last_name: '',
      address_1: '',
      city: '',
      state: '',
      postcode: '',
      country: 'US',
      email: '',
      phone: '',
    },
    payment_method: 'cod', // Cash on delivery
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const order = await storeAPI.checkout(formData);
    
    if (order) {
      // Redirect to success page or payment
      window.location.href = `/order-received/${order.order_id}?key=${order.order_key}`;
    } else {
      alert('Checkout failed. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      billing_address: {
        ...prev.billing_address,
        [name]: value,
      },
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>

            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              required
              onChange={handleInputChange}
              className="w-full border rounded px-4 py-2"
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              required
              onChange={handleInputChange}
              className="w-full border rounded px-4 py-2"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleInputChange}
              className="w-full border rounded px-4 py-2"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              required
              onChange={handleInputChange}
              className="w-full border rounded px-4 py-2"
            />

            <input
              type="text"
              name="address_1"
              placeholder="Address"
              required
              onChange={handleInputChange}
              className="w-full border rounded px-4 py-2"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                required
                onChange={handleInputChange}
                className="border rounded px-4 py-2"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                required
                onChange={handleInputChange}
                className="border rounded px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="postcode"
                placeholder="Postal Code"
                required
                onChange={handleInputChange}
                className="border rounded px-4 py-2"
              />

              <input
                type="text"
                name="country"
                placeholder="Country"
                required
                onChange={handleInputChange}
                className="border rounded px-4 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          {cart && (
            <div className="border rounded-lg p-6 space-y-4">
              {cart.items.map((item) => (
                <div key={item.key} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${item.totals.line_total}</span>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${cart.totals.total_items}</span>
                </div>
                
                {cart.totals.total_tax !== '0' && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${cart.totals.total_tax}</span>
                  </div>
                )}
                
                {cart.totals.total_shipping !== '0' && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${cart.totals.total_shipping}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total:</span>
                  <span>${cart.totals.total_price}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🔐 Authentication Components

### Login Component

```typescript
// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { authAPI } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await authAPI.login(credentials);

    if (result.success) {
      router.push('/account');
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Login</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        className="w-full border rounded px-4 py-2"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        className="w-full border rounded px-4 py-2"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}
```

### User Account Page

```typescript
// app/account/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { authAPI } from '@/lib/auth';
import { User } from '@/types';
import { redirect } from 'next/navigation';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!authAPI.isLoggedIn()) {
      redirect('/login');
    }

    authAPI.getCurrentUser().then(setUser);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    redirect('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="max-w-2xl">
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.displayName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
```

---

## 🌍 Country Selector with WordPress Settings

```typescript
// components/CountrySelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { wordpress } from '@/lib/wordpress';

export function CountrySelector({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (country: string) => void;
}) {
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    wordpress.getGlobalSettings().then(settings => {
      if (settings) {
        setCountries(settings.supportedCountries);
      }
    });
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-4 py-2"
    >
      <option value="">Select Country</option>
      {countries.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
}
```

---

## 📝 Summary

You now have:

✅ **Products API** - Fetch products, reviews, categories  
✅ **WordPress CMS** - Manage hero sections, banners, settings  
✅ **Store API Cart** - Server-side cart with tax/shipping  
✅ **Checkout Flow** - Complete order creation  
✅ **JWT Authentication** - User login/registration  

**Next:** Test each integration and customize to your needs!
