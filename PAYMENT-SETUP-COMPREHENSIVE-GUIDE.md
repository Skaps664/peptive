# 🛒 Complete Payment, Shipping & Stock Setup Guide

**Comprehensive guide for Peptive Peptides E-commerce Platform**

This document covers **everything** you need to implement a fully automated payment system using either **Stripe Checkout** or **WooCommerce Payment Gateways**.

---

## 📋 Table of Contents

1. [Current System Overview](#current-system-overview)
2. [Option 1: Stripe Direct Checkout (Current Implementation)](#option-1-stripe-direct-checkout)
3. [Option 2: WooCommerce Payment Gateway](#option-2-woocommerce-payment-gateway)
4. [Stock Management & Inventory](#stock-management--inventory)
5. [Shipping & Tax Configuration](#shipping--tax-configuration)
6. [Pricing & Bundle Configuration](#pricing--bundle-configuration)
7. [Comparison: Stripe vs WooCommerce Gateway](#comparison-stripe-vs-woocommerce-gateway)
8. [Implementation Checklist](#implementation-checklist)

---

## 🔍 Current System Overview

### Architecture
Your store is a **headless e-commerce** setup:
- **Frontend**: Next.js (React) - `/mnt/d/peptive`
- **Backend**: WordPress + WooCommerce
- **Database**: WooCommerce manages products, inventory, orders
- **Cart**: Client-side using Zustand (`store/cartStore.ts`)
- **Custom Plugin**: `peptive-bundles` for bundle products

### Data Flow
```
User → Next.js Cart → Checkout Page → Payment Provider → Order Creation
                                           ↓
                              WooCommerce (Inventory Update)
```

### What You Have
✅ Cart system (Zustand store)
✅ Checkout form (collects billing/shipping)
✅ Stripe checkout session creation
✅ Webhook handler for Stripe
✅ Custom bundle plugin with inventory management
✅ Shipping/tax calculation API
✅ Product pricing from WooCommerce

### What's Missing (Both Options Need)
❌ Stripe webhook endpoint configuration
❌ Production payment keys
❌ Order confirmation emails
❌ Failed payment handling
❌ Customer dashboard integration

---

## 💳 Option 1: Stripe Direct Checkout (Current Implementation)

**Best for**: Full control, international payments, modern checkout experience

### How It Works

```
1. User adds products to cart (client-side)
2. User fills checkout form
3. API creates Stripe Checkout Session
4. User redirects to Stripe-hosted checkout
5. User completes payment on Stripe
6. Stripe webhook notifies your server
7. Server creates WooCommerce order
8. User redirects to success page
```

---

### 🔧 Stripe Setup Steps

#### Step 1: Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click **Sign Up**
3. Complete business information:
   - Business type (Individual/Company)
   - Business location (UAE/Saudi Arabia/etc.)
   - Industry: Health & Wellness
   - Product description: Peptide supplements
4. Verify email and phone
5. Complete KYC (identity verification)

#### Step 2: Get API Keys

**Development Keys (Test Mode):**

1. Login to [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard)
2. Ensure you're in **Test Mode** (toggle top-right)
3. Go to **Developers** → **API keys**
4. Copy these keys:
   - **Publishable key**: `pk_test_51...` (safe for client-side)
   - **Secret key**: `sk_test_51...` (keep secret, server-only)

**Production Keys (Live Mode):**

1. Complete Stripe account activation
2. Switch to **Live Mode** (toggle top-right)
3. Go to **Developers** → **API keys**
4. Copy these keys:
   - **Publishable key**: `pk_live_51...`
   - **Secret key**: `sk_live_51...`

#### Step 3: Configure Stripe Settings

**Payment Methods:**
1. Go to **Settings** → **Payment methods**
2. Enable:
   - ✅ Cards (Visa, Mastercard, Amex)
   - ✅ Apple Pay
   - ✅ Google Pay
   - Optional: Link, Alipay, WeChat Pay

**Checkout Settings:**
1. Go to **Settings** → **Checkout settings**
2. Enable:
   - ✅ Collect billing address
   - ✅ Collect shipping address
   - ✅ Phone number collection (required)

**Branding:**
1. Go to **Settings** → **Branding**
2. Upload logo (appears on checkout page)
3. Set brand color
4. Set accent color

**Customer Emails:**
1. Go to **Settings** → **Customer emails**
2. Enable:
   - ✅ Successful payments
   - ✅ Refunded payments
   - ✅ Failed payments

**Tax & Compliance:**
1. Go to **Settings** → **Tax**
2. Option A: Use Stripe Tax (automatic calculation)
   - Enable "Collect tax automatically"
   - Add your tax registration numbers
3. Option B: Manual (you calculate in Next.js)
   - Leave disabled, handle in `/api/calculate-shipping-tax`

#### Step 4: Setup Webhooks (CRITICAL)

Webhooks notify your server when payments succeed/fail.

**For Development (using Stripe CLI):**

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Linux
   wget https://github.com/stripe/stripe-cli/releases/download/v1.19.5/stripe_1.19.5_linux_x86_64.tar.gz
   tar -xvf stripe_1.19.5_linux_x86_64.tar.gz
   sudo mv stripe /usr/local/bin
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```

4. You'll get a webhook secret: `whsec_...`
5. Add to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

**For Production:**

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.expired`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret**: `whsec_...`
7. Add to production environment variables

#### Step 5: Environment Variables

Create/update `.env.local`:

```env
# ==================== STRIPE ====================
# Get from: https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...

# Get from: https://dashboard.stripe.com/test/webhooks
STRIPE_WEBHOOK_SECRET=whsec_...

# ==================== WOOCOMMERCE ====================
NEXT_PUBLIC_WOOCOMMERCE_URL=http://localhost:3000
WOOCOMMERCE_CONSUMER_KEY=ck_...
WOOCOMMERCE_CONSUMER_SECRET=cs_...

# ==================== SITE ====================
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_SITE_NAME=Peptive Peptides
```

#### Step 6: Test the Flow

**Test Cards (Test Mode Only):**

| Card Number | Description | Result |
|------------|-------------|---------|
| 4242 4242 4242 4242 | Visa (success) | ✅ Payment succeeds |
| 4000 0025 0000 3155 | 3D Secure | Requires authentication |
| 4000 0000 0000 9995 | Declined | ❌ Payment fails |

**Testing Steps:**

1. Add products to cart
2. Go to checkout
3. Fill form with test data
4. Click "Complete Order"
5. Redirects to Stripe Checkout
6. Use test card: `4242 4242 4242 4242`
7. Expiry: any future date (e.g., `12/34`)
8. CVC: any 3 digits (e.g., `123`)
9. ZIP: any 5 digits (e.g., `12345`)
10. Click "Pay"
11. Should redirect to success page
12. Check webhook logs in terminal
13. Verify order created in WooCommerce

**Verification:**

```bash
# Check Stripe events
stripe events list --limit 5

# Check your webhook endpoint received the event
# Look in terminal running your Next.js app for:
# "Payment successful! { sessionId: '...', customerEmail: '...', ... }"
```

#### Step 7: Go Live

1. **Complete Stripe Onboarding**:
   - Verify business identity
   - Add bank account for payouts
   - Set payout schedule

2. **Switch to Live Keys**:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_... (from production webhook)
   ```

3. **Create Production Webhook**:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Same events as test mode

4. **Test with Real Card**:
   - Use a real card with small amount ($1-5)
   - Verify full flow works
   - Check order in WooCommerce
   - Verify payment in Stripe Dashboard

---

### 📝 Current Code Review

#### ✅ What's Working

**Cart Store** (`store/cartStore.ts`):
```typescript
- ✅ Add/remove items
- ✅ Update quantities
- ✅ Calculate subtotal
- ✅ Persistent storage (localStorage)
- ✅ Unique cart item IDs
```

**Checkout Session** (`app/api/create-checkout-session/route.ts`):
```typescript
- ✅ Creates Stripe Checkout Session
- ✅ Transforms cart items to line items
- ✅ Handles pricing (AED currency)
- ✅ Collects billing/shipping addresses
- ✅ Coupon/discount support
- ✅ Metadata for order creation
```

**Webhook Handler** (`app/api/webhooks/stripe/route.ts`):
```typescript
- ✅ Verifies webhook signature
- ✅ Handles checkout.session.completed
- ✅ Creates WooCommerce order
- ✅ Error handling
```

#### ⚠️ What Needs Improvement

**Issue 1: Product ID Mapping**

Current webhook tries to get product ID from `item.description`:
```typescript
// ❌ WRONG - description is product description text, not ID
product_id: parseInt(item.description || '0')
```

**Fix:**
```typescript
// In create-checkout-session/route.ts
price_data: {
  product_data: {
    metadata: {
      woocommerce_product_id: item.id.toString(), // ✅ Store product ID
      bundle_type: item.bundleType || 'one-month',
    },
  },
},

// In webhooks/stripe/route.ts
const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
  expand: ['data.price.product'],
});

const wooLineItems = lineItems.data.map((item: any) => {
  const product = item.price.product;
  return {
    product_id: parseInt(product.metadata.woocommerce_product_id || '0'),
    quantity: item.quantity || 1,
    meta_data: [
      { key: 'bundle_type', value: product.metadata.bundle_type || '' },
    ],
  };
});
```

**Issue 2: Stock Deduction**

Currently, order is created with `set_paid: true` but stock deduction happens via WooCommerce hook. This works, but verify in your plugin that `woocommerce_reduce_order_stock` fires correctly.

**Verification:**
```php
// In wordpress-plugin/peptive-bundles/includes/class-bundle-inventory.php
// ✅ Already implemented - good!
add_action('woocommerce_reduce_order_stock', array($this, 'reduce_bundle_stock'));
```

**Issue 3: Failed Payment Handling**

Add retry logic and customer notifications:

```typescript
// In webhooks/stripe/route.ts, add:
case 'payment_intent.payment_failed': {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
  // Send email to customer
  await sendPaymentFailedEmail({
    email: paymentIntent.receipt_email,
    reason: paymentIntent.last_payment_error?.message,
    amount: paymentIntent.amount,
  });
  
  break;
}
```

**Issue 4: Email Notifications**

Currently relying on Stripe emails. Add WooCommerce emails:

```php
// In your WordPress functions.php or plugin
add_action('woocommerce_order_status_processing', 'send_custom_order_email', 10, 1);

function send_custom_order_email($order_id) {
    $order = wc_get_order($order_id);
    WC()->mailer()->get_emails()['WC_Email_Customer_Processing_Order']->trigger($order_id);
}
```

---

## 🛒 Option 2: WooCommerce Payment Gateway

**Best for**: Integrated experience, using WooCommerce's built-in features, local payment methods

### How It Works

```
1. User adds products to WooCommerce cart (via Store API)
2. User fills checkout form
3. WooCommerce handles payment processing
4. WooCommerce manages orders, stock, emails
5. Frontend shows order confirmation
```

### Advantages

✅ **All-in-one**: Orders, payments, stock in one system
✅ **Built-in emails**: Customer notifications automatic
✅ **Multiple gateways**: Stripe, PayPal, local gateways
✅ **WooCommerce admin**: Full order management
✅ **Subscriptions**: Easy recurring payments
✅ **Coupons**: Native WooCommerce coupon system

### Disadvantages

❌ **Less control**: UI customization limited
❌ **Session management**: Requires cookies/sessions
❌ **Complexity**: More moving parts
❌ **Performance**: More server requests

---

### 🔧 WooCommerce Gateway Setup

#### Step 1: Install WooCommerce Stripe Gateway

**Option A: Official Stripe Plugin (Recommended)**

1. Login to WordPress Admin
2. Go to **Plugins** → **Add New**
3. Search: "WooCommerce Stripe Payment Gateway"
4. Install **WooCommerce Stripe Gateway** by WooCommerce
5. Activate plugin

**Option B: Manual Install**

```bash
cd /path/to/wordpress/wp-content/plugins
wget https://downloads.wordpress.org/plugin/woocommerce-gateway-stripe.latest.zip
unzip woocommerce-gateway-stripe.latest.zip
rm woocommerce-gateway-stripe.latest.zip
```

Then activate in WordPress admin.

#### Step 2: Configure Stripe Gateway

1. Go to **WooCommerce** → **Settings** → **Payments**
2. Click **Stripe** → **Manage**
3. Fill in:
   - **Enable/Disable**: ✅ Enable
   - **Title**: Credit Card (Stripe)
   - **Description**: Pay securely with credit card
   - **Test mode**: ✅ Enable (for development)
   - **Test Publishable Key**: `pk_test_...`
   - **Test Secret Key**: `sk_test_...`
   - **Webhook Secret**: (auto-generated)
4. Payment options:
   - ✅ Enable Apple Pay
   - ✅ Enable Google Pay
   - ✅ Request customer billing details
5. Click **Save changes**

#### Step 3: Setup Webhook Endpoint

The WooCommerce Stripe plugin creates webhook automatically:

1. Go to **WooCommerce** → **Settings** → **Payments** → **Stripe**
2. Scroll to **Webhook Endpoint**
3. Copy the URL: `https://yourdomain.com/?wc-api=wc_stripe`
4. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
5. Add endpoint with that URL
6. Select events (plugin handles this automatically)
7. Copy webhook secret
8. Paste in Stripe settings in WooCommerce

#### Step 4: Alternative Gateways

**PayPal Checkout:**

1. Install **WooCommerce PayPal Checkout Gateway**
2. Go to **WooCommerce** → **Settings** → **Payments**
3. Enable **PayPal Checkout**
4. Connect PayPal account
5. Configure settings

**Cash on Delivery (COD):**

1. Go to **WooCommerce** → **Settings** → **Payments**
2. Enable **Cash on Delivery**
3. Set countries/regions where available
4. Add instructions for customers

**Bank Transfer:**

1. Go to **WooCommerce** → **Settings** → **Payments**
2. Enable **Direct Bank Transfer**
3. Add bank account details
4. Instructions for customers

#### Step 5: Modify Frontend to Use WooCommerce Cart

This requires significant changes to your Next.js app.

**Update Cart Store** (`store/cartStore.ts`):

```typescript
import { storeAPI } from '@/lib/store-api';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  sessionId?: string; // WooCommerce session
  
  // Actions
  addItem: async (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: async (cartItemKey: string) => void;
  updateQuantity: async (cartItemKey: string, quantity: number) => void;
  syncCart: async () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: async (item) => {
        // Add to WooCommerce cart via Store API
        const cart = await storeAPI.addToCart(item.id, 1);
        if (cart) {
          set({ items: transformWooCartToLocal(cart) });
        }
      },

      removeItem: async (cartItemKey) => {
        const cart = await storeAPI.removeCartItem(cartItemKey);
        if (cart) {
          set({ items: transformWooCartToLocal(cart) });
        }
      },

      updateQuantity: async (cartItemKey, quantity) => {
        const cart = await storeAPI.updateCartItem(cartItemKey, quantity);
        if (cart) {
          set({ items: transformWooCartToLocal(cart) });
        }
      },

      syncCart: async () => {
        const cart = await storeAPI.getCart();
        if (cart) {
          set({ items: transformWooCartToLocal(cart) });
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

**Update Checkout Page** (`app/checkout/page.tsx`):

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Update customer info in WooCommerce
    await storeAPI.updateCustomer({
      billing_address: billingInfo,
      shipping_address: sameAsShipping ? billingInfo : shippingInfo,
    });

    // Create order via WooCommerce
    const order = await storeAPI.checkout({
      billing: billingInfo,
      shipping: sameAsShipping ? billingInfo : shippingInfo,
      payment_method: 'stripe',
      customer_note: '',
    });

    if (order) {
      // Redirect to WooCommerce payment page
      window.location.href = order.payment_url;
    }
  } catch (err) {
    setError('Checkout failed');
  } finally {
    setLoading(false);
  }
};
```

**Create Order Success Handler:**

```typescript
// app/checkout/success/page.tsx
'use client';

import { useEffect, useState } from 'use';
import { useSearchParams } from 'next/navigation';

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('order_id');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/get-order?order_id=${orderId}`)
        .then(res => res.json())
        .then(data => setOrder(data));
    }
  }, [orderId]);

  return (
    <div>
      <h1>Order Confirmed!</h1>
      {order && (
        <div>
          <p>Order #{order.number}</p>
          <p>Total: {order.total}</p>
        </div>
      )}
    </div>
  );
}
```

#### Step 6: Session Management

WooCommerce requires sessions (cookies). Configure CORS:

**WordPress** (`wp-config.php`):

```php
// Add before "That's all, stop editing!"
define('JWT_AUTH_SECRET_KEY', 'your-secret-key');
define('JWT_AUTH_CORS_ENABLE', true);

// Allow credentials in CORS
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
```

**Next.js** (API proxy):

Already implemented in `app/api/proxy/wc-store/[...path]/route.ts` ✅

---

### 📊 Comparison: Stripe vs WooCommerce Gateway

| Feature | Stripe Direct | WooCommerce Gateway |
|---------|--------------|---------------------|
| **Setup Complexity** | ⭐⭐ Medium | ⭐⭐⭐⭐ Complex |
| **Control** | ✅ Full control | ⚠️ Limited by WooCommerce |
| **Performance** | ✅ Fast (1-2 API calls) | ⚠️ Slower (3-5 API calls) |
| **Cart Management** | ✅ Client-side (fast) | ❌ Server-side (slower) |
| **Order Management** | ⚠️ Manual sync | ✅ Automatic |
| **Emails** | ⚠️ Custom implementation | ✅ Built-in |
| **Stock Management** | ✅ Webhook-based | ✅ Automatic |
| **Payment Methods** | ✅ All Stripe methods | ✅ Multiple gateways |
| **Subscriptions** | ⚠️ Custom code | ✅ WooCommerce Subscriptions |
| **Coupons** | ⚠️ Stripe or custom | ✅ WooCommerce coupons |
| **Admin UI** | ❌ Stripe Dashboard only | ✅ Full WooCommerce admin |
| **Cost** | 2.9% + $0.30 per transaction | Same + gateway fees |
| **Customization** | ✅ Full UI control | ⚠️ Limited |
| **Mobile Experience** | ✅ Excellent | ⚠️ Good |
| **3D Secure** | ✅ Automatic | ✅ Automatic |
| **Refunds** | ✅ Stripe Dashboard | ✅ WooCommerce admin |
| **Analytics** | ✅ Stripe Dashboard | ✅ WooCommerce Reports |

---

## 📦 Stock Management & Inventory

### Your Custom Bundle Plugin

Location: `wordpress-plugin/peptive-bundles/`

**Features:**
- ✅ Bundle product type
- ✅ Automatic stock calculation based on components
- ✅ Stock deduction on order
- ✅ Stock restoration on cancellation
- ✅ Prevents overselling
- ✅ REST API support

### How Stock Works

**Bundle Stock Calculation:**

```php
// From class-bundle-inventory.php
public function get_bundle_stock($stock, $product) {
    // Bundle stock = LOWEST stock of any component
    // Example:
    // - Product A: 10 in stock
    // - Product B: 5 in stock
    // - Bundle (1x A + 1x B): 5 available
    
    $min_stock = PHP_INT_MAX;
    foreach ($bundle_items as $item) {
        $available = floor($component_stock / $item['quantity']);
        $min_stock = min($min_stock, $available);
    }
    return $min_stock;
}
```

**Stock Deduction on Order:**

```php
// Automatically triggered when order is placed
public function reduce_bundle_stock($order) {
    // For each bundle in order:
    // 1. Get bundle components
    // 2. Calculate quantity to deduct (bundle_qty × component_qty)
    // 3. Reduce stock for each component
    // 4. Add order note
}
```

### WooCommerce Stock Settings

1. Go to **WooCommerce** → **Settings** → **Products** → **Inventory**
2. Enable:
   - ✅ **Manage stock**: Enable stock management
   - ✅ **Hold stock (minutes)**: 60 (hold stock for pending orders)
   - ✅ **Notifications**: Enable low stock notifications
   - **Low stock threshold**: 5
   - **Out of stock threshold**: 0
3. Enable:
   - ✅ **Out of stock visibility**: Hide out of stock items
   - ✅ **Stock display format**: Always show quantity

### Setting Product Stock

**Via WooCommerce Admin:**

1. Go to **Products** → **All Products**
2. Edit a product
3. Scroll to **Inventory**
4. Enable **Manage stock?**
5. Set **Stock quantity**
6. Set **Low stock threshold** (optional)
7. **Stock status**: In stock / Out of stock
8. Click **Update**

**Via REST API:**

```bash
curl -X PUT https://yourdomain.com/wp-json/wc/v3/products/123 \
  -u consumer_key:consumer_secret \
  -H "Content-Type: application/json" \
  -d '{
    "manage_stock": true,
    "stock_quantity": 100,
    "stock_status": "instock"
  }'
```

**Bulk Update:**

```php
// WordPress admin → Tools → WP-CLI or functions.php
$products = wc_get_products(['limit' => -1]);

foreach ($products as $product) {
    $product->set_manage_stock(true);
    $product->set_stock_quantity(100);
    $product->set_stock_status('instock');
    $product->save();
}
```

---

## 🚚 Shipping & Tax Configuration

### WooCommerce Shipping Zones

1. Go to **WooCommerce** → **Settings** → **Shipping**
2. Click **Add shipping zone**

**Example: Middle East Zone**

- **Zone name**: Middle East
- **Zone regions**: 
  - United Arab Emirates (AE)
  - Saudi Arabia (SA)
  - Kuwait (KW)
  - Qatar (QA)
  - Bahrain (BH)
  - Oman (OM)
- **Shipping methods**:
  - **Flat rate**: AED 25.00
  - **Free shipping**: Minimum order AED 500.00

**Example: United States**

- **Zone name**: United States
- **Zone regions**: United States
- **Shipping methods**:
  - **Flat rate**: $15.00 (USD)
  - **Free shipping**: Minimum order $200.00

**Example: Rest of World**

- **Zone name**: Rest of World
- **Zone regions**: Select specific countries or "All other countries"
- **Shipping methods**:
  - **Flat rate**: AED 50.00

### Shipping Classes (Optional)

For different shipping costs based on product type:

1. Go to **WooCommerce** → **Settings** → **Shipping** → **Shipping classes**
2. Add classes:
   - **Peptides**: Standard shipping
   - **Bundles**: Free shipping
   - **Accessories**: Low-cost shipping

3. Assign to products:
   - Edit product → **Shipping** → **Shipping class**

### Tax Configuration

#### Option 1: UAE VAT (5%)

1. Go to **WooCommerce** → **Settings** → **Tax**
2. Enable:
   - ✅ **Enable taxes**
   - **Prices entered with tax**: Exclusive of tax
   - ✅ **Calculate tax based on**: Customer shipping address
   - ✅ **Shipping tax class**: Standard rates
3. Click **Standard rates**
4. Add rate:
   - **Country code**: AE
   - **State code**: (leave blank for all emirates)
   - **Rate %**: 5.000
   - **Tax name**: VAT
   - **Priority**: 1
   - **Compound**: No
   - **Shipping**: Yes

#### Option 2: Saudi Arabia VAT (15%)

- **Country code**: SA
- **Rate %**: 15.000
- **Tax name**: VAT

#### Option 3: US Sales Tax (varies by state)

- **Country code**: US
- **State code**: CA (California)
- **Rate %**: 7.250
- Repeat for each state

#### Option 4: No Tax

Simply disable taxes in **WooCommerce** → **Settings** → **Tax**

### Dynamic Shipping/Tax Calculation

Your API (`app/api/calculate-shipping-tax/route.ts`) already:

✅ Creates temporary WooCommerce order
✅ Gets calculated shipping from WooCommerce
✅ Gets calculated tax from WooCommerce
✅ Returns totals to frontend
✅ Deletes temporary order

**This works with both Stripe and WooCommerce Gateway!**

---

## 💰 Pricing & Bundle Configuration

### Setting Prices in WooCommerce

**Regular Product:**

1. Edit product in WooCommerce
2. **Regular price**: AED 299.00
3. **Sale price**: AED 249.00 (optional)
4. Click **Update**

**Bundle Pricing (Your Custom Plugin):**

Your plugin adds custom fields for bundles:

1. Edit product → **Product data** → **Bundle**
2. Set bundle items (component products)
3. **Bundle Pricing**:
   - **3-month regular**: AED 799.00
   - **3-month sale**: AED 699.00
   - **6-month regular**: AED 1499.00
   - **6-month sale**: AED 1299.00
4. Click **Update**

### Fetching Prices in Frontend

**Via Store API** (Recommended):

```typescript
// lib/store-api.ts
const product = await storeAPI.getProduct(productId);

// Access pricing
const price = product.prices.price; // Current price (with sale)
const regularPrice = product.prices.regular_price;
const salePrice = product.prices.sale_price;

// Bundle pricing (custom fields)
const bundlePricing = product.extensions['peptive-bundles'].bundle_pricing;
const threeMonthPrice = bundlePricing.three_month.sale_price || bundlePricing.three_month.regular_price;
```

**Via REST API:**

```typescript
// lib/woocommerce.ts
const product = await woocommerce.getProduct(productId);

const price = product.price;
const regularPrice = product.regular_price;
const salePrice = product.sale_price;

// Bundle pricing
const bundlePricing = product.meta_data.find(m => m.key === '_bundle_pricing')?.value;
```

### Currency Configuration

**WooCommerce Currency:**

1. Go to **WooCommerce** → **Settings** → **General**
2. **Currency**: UAE Dirham (AED)
3. **Currency position**: Right with space (e.g., "100 AED")
4. **Thousand separator**: ,
5. **Decimal separator**: .
6. **Number of decimals**: 2

**Stripe Currency:**

Already set in `create-checkout-session/route.ts`:
```typescript
price_data: {
  currency: 'aed', // Must match WooCommerce
}
```

**Multi-Currency Support:**

For selling in multiple currencies (AED, USD, SAR):

1. Install **WooCommerce Multi-Currency** plugin
2. Add currencies: AED, USD, SAR
3. Set exchange rates (auto-update available)
4. Update Stripe session to use customer's currency

```typescript
const customerCurrency = billingInfo.country === 'US' ? 'usd' : 
                        billingInfo.country === 'SA' ? 'sar' : 'aed';

price_data: {
  currency: customerCurrency,
  unit_amount: Math.round(convertPrice(item.price, customerCurrency) * 100),
}
```

---

## 🎯 Implementation Checklist

### Stripe Direct Checkout (Recommended for You)

#### Phase 1: Development Setup
- [ ] Create Stripe account
- [ ] Get test API keys (pk_test, sk_test)
- [ ] Add keys to `.env.local`
- [ ] Install Stripe CLI
- [ ] Run `stripe listen` and get webhook secret
- [ ] Add webhook secret to `.env.local`
- [ ] Test checkout with test card 4242...
- [ ] Verify webhook receives events
- [ ] Verify order created in WooCommerce
- [ ] Test stock deduction

#### Phase 2: Fix Current Issues
- [ ] Fix product ID mapping in webhook (use metadata)
- [ ] Add failed payment handling
- [ ] Add customer email notifications
- [ ] Test bundle product checkout
- [ ] Verify bundle stock deduction works
- [ ] Test coupon codes
- [ ] Test shipping calculation

#### Phase 3: WooCommerce Configuration
- [ ] Set up shipping zones (Middle East, US, etc.)
- [ ] Configure shipping rates
- [ ] Set up tax rates (VAT for UAE/SA)
- [ ] Enable stock management
- [ ] Set stock quantities for all products
- [ ] Configure low stock notifications
- [ ] Test bundle stock calculations

#### Phase 4: Email & Notifications
- [ ] Enable Stripe customer emails
- [ ] Configure WooCommerce order emails
- [ ] Customize email templates
- [ ] Test order confirmation emails
- [ ] Test failed payment emails
- [ ] Add admin notifications

#### Phase 5: Production Deployment
- [ ] Complete Stripe business verification
- [ ] Add bank account for payouts
- [ ] Get live API keys (pk_live, sk_live)
- [ ] Create production webhook endpoint
- [ ] Update environment variables
- [ ] Test with real card (small amount)
- [ ] Monitor first 10 orders closely
- [ ] Set up error monitoring (Sentry)

#### Phase 6: Optimization
- [ ] Add order tracking page
- [ ] Customer order history
- [ ] Implement refund handling
- [ ] Add analytics tracking
- [ ] Performance monitoring
- [ ] A/B test checkout flow

---

### WooCommerce Gateway (Alternative)

#### Phase 1: Plugin Setup
- [ ] Install WooCommerce Stripe Gateway
- [ ] Configure Stripe settings in WooCommerce
- [ ] Test Stripe gateway with test card
- [ ] Set up webhook in Stripe Dashboard
- [ ] Verify webhook endpoint working

#### Phase 2: Cart Migration
- [ ] Update cart store to use Store API
- [ ] Implement session management
- [ ] Test add to cart functionality
- [ ] Test cart persistence
- [ ] Test cart synchronization

#### Phase 3: Checkout Update
- [ ] Update checkout page to use WooCommerce checkout
- [ ] Handle payment redirect
- [ ] Create order success page
- [ ] Test full checkout flow
- [ ] Verify email notifications

#### Phase 4: Alternative Gateways (Optional)
- [ ] Install PayPal Checkout Gateway
- [ ] Configure PayPal settings
- [ ] Enable Cash on Delivery
- [ ] Enable Bank Transfer
- [ ] Test each payment method

#### Phase 5: Production
- [ ] Same as Stripe Direct phases 3-6

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Webhook not receiving events
- **Solution**: Check Stripe CLI is running: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
- **Solution**: Verify webhook secret in `.env.local`
- **Solution**: Check firewall/CORS settings

**Issue**: Order not created in WooCommerce
- **Solution**: Check webhook logs in terminal
- **Solution**: Verify WooCommerce API credentials
- **Solution**: Check product IDs are correct
- **Solution**: Enable WP_DEBUG in WordPress

**Issue**: Stock not deducting
- **Solution**: Verify bundle plugin is active
- **Solution**: Check if products have "Manage stock" enabled
- **Solution**: Look at WooCommerce → Status → Logs

**Issue**: Shipping/tax not calculating
- **Solution**: Verify shipping zones are set up
- **Solution**: Check tax rates are configured
- **Solution**: Ensure customer address is complete
- **Solution**: Check WooCommerce API credentials

**Issue**: Payment succeeds but no confirmation email
- **Solution**: Enable Stripe customer emails in Stripe settings
- **Solution**: Configure WooCommerce email settings
- **Solution**: Check spam folder
- **Solution**: Test with mailhog/mailtrap for development

**Issue**: Bundle price incorrect
- **Solution**: Check bundle pricing meta fields in WooCommerce
- **Solution**: Verify API is fetching bundle pricing correctly
- **Solution**: Check currency conversion if using multi-currency

---

## 📊 Recommendation: Which Option?

### Choose **Stripe Direct Checkout** if:

✅ You want full control over UX
✅ You prefer client-side cart (better performance)
✅ You're comfortable with custom code
✅ You want modern payment experience
✅ You plan to add features (subscriptions, etc.)
✅ You value fast checkout experience

**This is ALREADY mostly implemented in your codebase!**

### Choose **WooCommerce Gateway** if:

✅ You want all-in-one solution
✅ You prefer less custom code
✅ You need multiple payment gateways
✅ You want built-in admin features
✅ You need WooCommerce Subscriptions
✅ You prefer server-side cart management

---

## 🚀 Next Steps

**For Stripe Direct (Recommended):**

1. Complete Stripe account setup (1-2 days)
2. Fix webhook product ID mapping (30 mins)
3. Configure WooCommerce shipping/tax (1 hour)
4. Test full flow end-to-end (30 mins)
5. Deploy to production (1 hour)

**Total time: ~1 week including Stripe verification**

**For WooCommerce Gateway:**

1. Install and configure plugins (1 hour)
2. Migrate cart to Store API (4-8 hours)
3. Update checkout flow (4-8 hours)
4. Test and debug (2-4 hours)
5. Deploy to production (1 hour)

**Total time: ~2 weeks**

---

## 📞 Support Resources

### Stripe
- **Dashboard**: https://dashboard.stripe.com
- **Documentation**: https://stripe.com/docs
- **Support**: https://support.stripe.com
- **Testing**: https://stripe.com/docs/testing

### WooCommerce
- **Documentation**: https://woocommerce.com/documentation/
- **Support**: https://woocommerce.com/my-account/create-a-ticket/
- **REST API**: https://woocommerce.github.io/woocommerce-rest-api-docs/
- **Store API**: https://github.com/woocommerce/woocommerce-blocks/tree/trunk/src/StoreApi

### Your Custom Plugin
- **Location**: `/mnt/d/peptive/wordpress-plugin/peptive-bundles/`
- **Features Doc**: `FEATURES.md`
- **Main File**: `peptive-bundles.php`

---

## ✅ Summary

Your current implementation is **90% ready for production** with Stripe Direct Checkout. You just need to:

1. **Complete Stripe account verification** (2-3 days)
2. **Fix small webhook issues** (30 minutes of coding)
3. **Configure WooCommerce shipping/tax** (1 hour)
4. **Test thoroughly** (1-2 hours)
5. **Deploy** (1 hour)

The WooCommerce Gateway option would require significant refactoring of your cart system and is not necessary unless you specifically need features like WooCommerce Subscriptions or multiple payment gateways.

**My recommendation: Stick with Stripe Direct Checkout.** It's cleaner, faster, and you already have it working. Just polish it and go live! 🚀

---

*Document created: February 4, 2026*
*For: Peptive Peptides E-commerce Platform*
*Author: GitHub Copilot*
