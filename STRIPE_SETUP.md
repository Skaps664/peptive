# Stripe Checkout Integration Setup Guide

This guide will help you set up Stripe checkout for your WooCommerce products with coupon code support.

## 📋 What's Been Set Up

### 1. **Installed Packages**
- `stripe` - Server-side Stripe SDK
- `@stripe/stripe-js` - Client-side Stripe SDK

### 2. **Created Files**

#### API Route
- **`app/api/create-checkout-session/route.ts`**
  - Creates Stripe checkout sessions
  - Handles coupon code validation
  - Processes cart items from your Next.js cart

#### Pages
- **`app/checkout/success/page.tsx`** - Success page after payment
- **`app/checkout/cancel/page.tsx`** - Cancel page if user abandons checkout

#### Updated Files
- **`app/checkout/page.tsx`** - Modified to integrate with Stripe
  - Added coupon code input
  - Redirects to Stripe Checkout
  - Shows error messages

## 🔑 Configuration Steps

### Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or login
3. Navigate to **Developers → API keys**
4. Copy your:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

### Step 2: Add Keys to Environment Variables

Create or edit `.env.local` file in your project root:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Your site URL (for redirect URLs)
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

⚠️ **IMPORTANT**: Never commit `.env.local` to git. It should be in `.gitignore`.

### Step 3: Configure Success/Cancel URLs

The checkout session uses these URLs:
- **Success**: `{SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
- **Cancel**: `{SITE_URL}/checkout/cancel`

Make sure `NEXT_PUBLIC_SITE_URL` is set correctly for your environment.

## 💳 Creating Coupon Codes in Stripe

### Option 1: Via Stripe Dashboard

1. Go to **Products → Coupons** in Stripe Dashboard
2. Click **+ New** to create a coupon
3. Set:
   - **Name**: Internal name (e.g., "WELCOME10")
   - **ID**: Customer-facing code (e.g., "WELCOME10")
   - **Type**: Percentage off or Fixed amount
   - **Amount**: Discount value
   - **Duration**: Once, Forever, or Repeating

### Option 2: Via Stripe API

Create coupons programmatically:

```typescript
const coupon = await stripe.coupons.create({
  id: 'WELCOME10',
  percent_off: 10,
  duration: 'once',
});
```

### Option 3: Promotion Codes

For more advanced codes:

1. Create a coupon first (as above)
2. Go to **Products → Promotion codes**
3. Create a promotion code linked to your coupon
4. Set usage limits, expiration dates, etc.

## 🔄 How It Works

### User Flow

1. User adds products to cart (from WooCommerce via your Next.js app)
2. User clicks "Proceed to Checkout"
3. User fills in billing/shipping information
4. User optionally enters a coupon code
5. User clicks "Continue to Payment"
6. Backend creates Stripe Checkout Session:
   - Validates coupon code
   - Converts cart items to Stripe line items
   - Applies discount if coupon is valid
7. User is redirected to Stripe Checkout page
8. User completes payment on Stripe
9. User is redirected back to:
   - `/checkout/success` if payment succeeds
   - `/checkout/cancel` if payment is cancelled

### Coupon Code Handling

The API route tries two methods to apply coupons:

1. **Promotion Code**: Searches for active promotion codes matching the input
2. **Coupon ID**: Falls back to direct coupon ID lookup

This allows flexibility in how you create and distribute codes.

## 🧪 Testing

### Test Mode

Use Stripe test mode for development:

1. Use test API keys (start with `pk_test_` and `sk_test_`)
2. Use [Stripe test cards](https://stripe.com/docs/testing):
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0025 0000 3155`

### Test Coupons

Create test coupons in Stripe Dashboard:

```
Code: TEST10
Type: 10% off
Duration: Once
```

Then test in your checkout with code "TEST10"

## 💰 Currency Configuration

Currently set to **AED (UAE Dirham)**. To change:

Edit `app/api/create-checkout-session/route.ts`:

```typescript
price_data: {
  currency: 'usd', // Change to your currency (usd, eur, gbp, etc.)
  // ... rest of config
}
```

## 🌍 Shipping Countries

Currently configured for:
- UAE, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman
- US, UK, Canada

To modify, edit `app/api/create-checkout-session/route.ts`:

```typescript
shipping_address_collection: {
  allowed_countries: ['AE', 'SA', 'US', 'GB', 'CA'], // Add/remove country codes
}
```

## 🔒 Security Best Practices

1. **Never expose secret key**: Keep `STRIPE_SECRET_KEY` server-side only
2. **Validate on server**: All coupon validation happens server-side
3. **HTTPS in production**: Always use HTTPS for production
4. **Webhook verification**: Set up webhooks for order fulfillment

## 📦 Next Steps (Optional Enhancements)

### 1. Webhook Integration

Create `app/api/webhooks/stripe/route.ts` to handle:
- Payment success confirmations
- Create WooCommerce orders after payment
- Send confirmation emails
- Update inventory

### 2. WooCommerce Sync

After successful payment:
- Create order in WooCommerce via API
- Sync customer data
- Update stock levels

### 3. Email Notifications

Integrate with:
- SendGrid
- Mailgun
- Resend

### 4. Analytics

Track checkout events:
- Checkout started
- Payment completed
- Coupon usage

## 🐛 Troubleshooting

### "Stripe failed to load"
- Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- Ensure key starts with `pk_test_` or `pk_live_`

### "Failed to create checkout session"
- Check `STRIPE_SECRET_KEY` is set
- Verify cart has items
- Check server console for detailed errors

### Coupon not working
- Verify coupon exists in Stripe Dashboard
- Check coupon is active
- Ensure code matches exactly (case-sensitive)

### Redirect issues
- Verify `NEXT_PUBLIC_SITE_URL` is correct
- Check success/cancel URLs are accessible

## 📚 Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
- [Stripe Coupons Documentation](https://stripe.com/docs/billing/subscriptions/coupons)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

## 🎉 You're All Set!

Your checkout is now configured to:
- ✅ Accept payments via Stripe
- ✅ Handle coupon codes
- ✅ Process cart items from WooCommerce
- ✅ Redirect users after payment
- ✅ Clear cart on successful payment

Just add your Stripe keys to `.env.local` and you're ready to test!
