# ⚡ Quick Start Checklist - Payment Setup

**Goal**: Get your store accepting payments in production ASAP

---

## 🎯 Option 1: Stripe Direct (RECOMMENDED - 1 Week)

### Day 1: Stripe Account Setup
- [ ] Sign up at https://stripe.com
- [ ] Complete business information
- [ ] Verify email and phone
- [ ] Add business details (legal name, address, tax ID)
- [ ] Start identity verification (may take 1-2 days)

### Day 2-3: Development & Testing (While waiting for verification)
- [ ] Get test keys from Stripe Dashboard
- [ ] Add to `.env.local`:
  ```env
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_SECRET_KEY=sk_test_...
  ```
- [ ] Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
- [ ] Login: `stripe login`
- [ ] Start webhook listener: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
- [ ] Copy webhook secret to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`
- [ ] Fix webhook code (see code fix below)
- [ ] Test checkout with card `4242 4242 4242 4242`
- [ ] Verify order appears in WooCommerce
- [ ] Check stock was deducted

### Day 4: WooCommerce Configuration
- [ ] **Shipping Zones**:
  - Middle East (AE, SA, KW, QA, BH, OM) - AED 25 flat rate
  - United States - $15 flat rate
  - Rest of World - AED 50 flat rate
  - Free shipping over AED 500

- [ ] **Tax Rates**:
  - UAE: 5% VAT
  - Saudi Arabia: 15% VAT
  - US: State-based (optional)

- [ ] **Stock Management**:
  - Enable stock tracking globally
  - Set quantities for all products
  - Set low stock threshold: 5

- [ ] **Email Settings**:
  - Enable order confirmation emails
  - Test email delivery

### Day 5: Final Testing
- [ ] Test entire checkout flow
- [ ] Test with different countries (UAE, US, SA)
- [ ] Verify shipping calculated correctly
- [ ] Verify tax calculated correctly
- [ ] Test coupon codes
- [ ] Test bundle products
- [ ] Verify stock deduction
- [ ] Check all emails sent

### Day 6-7: Production Launch
- [ ] Complete Stripe verification (wait for approval)
- [ ] Add bank account for payouts
- [ ] Get live API keys
- [ ] Create production webhook:
  - URL: `https://yourdomain.com/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `payment_intent.payment_failed`
- [ ] Update production `.env`:
  ```env
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
  STRIPE_SECRET_KEY=sk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_... (new production secret)
  NEXT_PUBLIC_SITE_URL=https://yourdomain.com
  ```
- [ ] Deploy to production
- [ ] Test with real card ($1-5 test transaction)
- [ ] Monitor first 10 orders closely

---

## 🛒 Option 2: WooCommerce Gateway (2-3 Weeks)

### Week 1: Plugin Setup
- [ ] Install WooCommerce Stripe Gateway plugin
- [ ] Configure in WP Admin → WooCommerce → Settings → Payments
- [ ] Add Stripe keys
- [ ] Set up webhook in Stripe Dashboard
- [ ] Test payment in WooCommerce

### Week 2: Frontend Integration
- [ ] Migrate cart to use Store API
- [ ] Update checkout to use WooCommerce checkout
- [ ] Implement session management
- [ ] Create order success page
- [ ] Test full flow

### Week 3: Testing & Launch
- [ ] Configure shipping/tax (same as Stripe option)
- [ ] Test all payment methods
- [ ] Deploy to production

---

## 🔧 Critical Code Fixes

### Fix 1: Webhook Product ID Mapping

**File**: `app/api/webhooks/stripe/route.ts`

Replace the `createWooCommerceOrder` function with this:

```typescript
async function createWooCommerceOrder(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const billingDetails = JSON.parse(metadata.billingDetails || '{}');
  const shippingDetails = JSON.parse(metadata.shippingDetails || '{}');

  // Get line items with product metadata
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  });

  // Transform line items for WooCommerce
  const wooLineItems = lineItems.data.map((item: any) => {
    const product = item.price.product as Stripe.Product;
    const productId = product.metadata?.product_id || 
                     product.metadata?.woocommerce_product_id || '0';
    
    return {
      product_id: parseInt(productId),
      quantity: item.quantity || 1,
      meta_data: [
        {
          key: '_bundle_type',
          value: product.metadata?.bundle_type || '',
        },
        {
          key: '_bundle_label',
          value: product.metadata?.bundle_label || '',
        },
      ],
    };
  });

  // Create order in WooCommerce
  const orderData = {
    status: 'processing',
    set_paid: true,
    customer_id: 0,
    billing: {
      first_name: billingDetails.firstName || '',
      last_name: billingDetails.lastName || '',
      address_1: billingDetails.address1 || '',
      address_2: billingDetails.address2 || '',
      city: billingDetails.city || '',
      state: billingDetails.state || '',
      postcode: billingDetails.postcode || '',
      country: billingDetails.country || '',
      email: session.customer_email || billingDetails.email || '',
      phone: billingDetails.phone || '',
    },
    shipping: {
      first_name: shippingDetails.firstName || billingDetails.firstName || '',
      last_name: shippingDetails.lastName || billingDetails.lastName || '',
      address_1: shippingDetails.address1 || billingDetails.address1 || '',
      address_2: shippingDetails.address2 || billingDetails.address2 || '',
      city: shippingDetails.city || billingDetails.city || '',
      state: shippingDetails.state || billingDetails.state || '',
      postcode: shippingDetails.postcode || billingDetails.postcode || '',
      country: shippingDetails.country || billingDetails.country || '',
    },
    line_items: wooLineItems,
    payment_method: 'stripe',
    payment_method_title: 'Credit Card (Stripe)',
    transaction_id: session.payment_intent as string,
    meta_data: [
      { key: '_stripe_session_id', value: session.id },
      { key: '_stripe_payment_intent', value: session.payment_intent as string },
      { key: '_stripe_customer_email', value: session.customer_email || '' },
    ],
  };

  // Create WooCommerce API client
  const woocommerceAPI = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3`,
    auth: {
      username: process.env.WOOCOMMERCE_CONSUMER_KEY!,
      password: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const response = await woocommerceAPI.post('/orders', orderData);
  return response.data;
}
```

### Fix 2: Update Checkout Session Metadata

**File**: `app/api/create-checkout-session/route.ts`

Update the line items mapping:

```typescript
const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => ({
  price_data: {
    currency: 'aed',
    product_data: {
      name: item.bundleLabel ? `${item.name} (${item.bundleLabel})` : item.name,
      images: item.image ? [item.image] : [],
      description: item.shortDescription || '',
      metadata: {
        product_id: item.id.toString(), // ✅ Changed from woocommerce_product_id
        bundle_type: item.bundleType || 'one-month',
        bundle_label: item.bundleLabel || '',
        cart_item_id: item.cartItemId || '',
      },
    },
    unit_amount: Math.round(parseFloat(item.price) * 100),
  },
  quantity: item.quantity,
}));
```

---

## 📊 Environment Variables Needed

Create `.env.local` with:

```env
# ==================== STRIPE ====================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
STRIPE_SECRET_KEY=sk_test_51xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# ==================== WOOCOMMERCE ====================
NEXT_PUBLIC_WOOCOMMERCE_URL=http://peptivepeptides.local
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxx
WOOCOMMERCE_API_URL=http://peptivepeptides.local/wp-json/wc/v3

# ==================== SITE ====================
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_SITE_NAME=Peptive Peptides
```

---

## 🧪 Testing Checklist

### Basic Flow
- [ ] Add product to cart
- [ ] Update quantity
- [ ] Remove from cart
- [ ] View cart totals
- [ ] Proceed to checkout
- [ ] Fill billing information
- [ ] See shipping calculated
- [ ] See tax calculated
- [ ] Click "Complete Order"
- [ ] Redirected to Stripe
- [ ] Enter card: 4242 4242 4242 4242
- [ ] Payment succeeds
- [ ] Redirected to success page
- [ ] Order appears in WooCommerce
- [ ] Stock deducted
- [ ] Email received

### Edge Cases
- [ ] Empty cart checkout (should prevent)
- [ ] Invalid coupon code
- [ ] Out of stock product
- [ ] Payment declined (card: 4000 0000 0000 9995)
- [ ] 3D Secure required (card: 4000 0025 0000 3155)
- [ ] Session expired
- [ ] Network error handling

### Bundle Products
- [ ] Add bundle to cart
- [ ] Correct price shown
- [ ] Stock shows correctly
- [ ] Checkout with bundle
- [ ] Component stock deducted
- [ ] Bundle shows as out of stock when component runs out

### Multi-Country
- [ ] Checkout from UAE (AED 25 shipping, 5% tax)
- [ ] Checkout from Saudi Arabia (shipping, 15% tax)
- [ ] Checkout from US (USD pricing, shipping)

---

## 🚨 Common Issues & Solutions

**Webhook not working:**
```bash
# Check Stripe CLI is running
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Check webhook secret matches .env.local
echo $STRIPE_WEBHOOK_SECRET
```

**Order not created:**
```bash
# Check WooCommerce credentials
curl http://peptivepeptides.local/wp-json/wc/v3/orders \
  -u ck_xxxxx:cs_xxxxx

# Check WooCommerce logs
# WP Admin → WooCommerce → Status → Logs
```

**Stock not deducting:**
```bash
# Verify plugin is active
# WP Admin → Plugins → check "Peptive Product Bundles" is active

# Check product has "Manage stock" enabled
# WP Admin → Products → Edit Product → Inventory
```

**Shipping not calculating:**
```bash
# Verify shipping zones configured
# WP Admin → WooCommerce → Settings → Shipping → Shipping zones

# Test API directly
curl -X POST http://localhost:3001/api/calculate-shipping-tax \
  -H "Content-Type: application/json" \
  -d '{"items":[{"id":123,"quantity":1}],"country":"AE"}'
```

---

## 📞 Quick Reference

**Stripe Dashboard**: https://dashboard.stripe.com
**Test Cards**: https://stripe.com/docs/testing#cards
**WooCommerce Orders**: WP Admin → WooCommerce → Orders
**Product Stock**: WP Admin → Products → Inventory
**Shipping Zones**: WP Admin → WooCommerce → Settings → Shipping

---

## ✅ Launch Day Checklist

### Pre-Launch (Day Before)
- [ ] All tests passing
- [ ] Production keys configured
- [ ] Webhook endpoint verified
- [ ] Email templates tested
- [ ] Stock quantities set
- [ ] Shipping rates confirmed
- [ ] Tax rates confirmed
- [ ] Privacy policy updated
- [ ] Terms & conditions updated
- [ ] SSL certificate active
- [ ] Backup created

### Launch Day
- [ ] Deploy to production
- [ ] Test with $1 transaction
- [ ] Monitor error logs
- [ ] Watch for first real order
- [ ] Verify order created correctly
- [ ] Verify stock deducted
- [ ] Verify customer received email
- [ ] Verify you received notification
- [ ] Check funds in Stripe Dashboard
- [ ] Monitor for 24 hours

### Post-Launch (First Week)
- [ ] Check daily orders
- [ ] Monitor failed payments
- [ ] Review customer feedback
- [ ] Check inventory levels
- [ ] Review shipping costs vs charges
- [ ] Verify tax calculations
- [ ] Optimize based on data

---

**Time to Production**: ~7 days with Stripe Direct ⚡
**Confidence Level**: High (system is 90% ready) ✅

Good luck! 🚀
