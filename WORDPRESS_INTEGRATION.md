# WordPress/WooCommerce Integration Setup

## Current Status

✅ **What's Working:**
- Stripe checkout session creation with coupon codes
- Cart management in Next.js
- Success/Cancel pages after payment

⚠️ **What Needs Configuration:**
- **Order data is NOT saved to WordPress yet** (requires webhook setup)
- Country/State/City data is hardcoded (can fetch from WooCommerce)

## How It Currently Works

### Current Flow:
1. User adds products to cart (from WooCommerce via Next.js)
2. User fills checkout form (data stored temporarily)
3. User redirected to Stripe for payment
4. Payment processed by Stripe
5. User redirected back to success page
6. **Cart cleared** ✅
7. **Order NOT created in WooCommerce** ❌ (webhook not configured)

## Setting Up Order Sync with WordPress

### Step 1: Configure Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **+ Add endpoint**
3. Enter your endpoint URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
   For local testing:
   ```
   http://localhost:3001/api/webhooks/stripe
   ```
   
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

5. Click **Add endpoint**

6. Copy the **Signing secret** (starts with `whsec_`)

### Step 2: Add Webhook Secret to Environment

Add to your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret_here
```

### Step 3: Test Webhook Locally

For local development, use Stripe CLI:

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

This will give you a webhook secret for testing (starts with `whsec_`).

### Step 4: Verify WooCommerce API Access

Make sure your WooCommerce API keys have **Read/Write** permissions:

1. Go to: WP Admin → WooCommerce → Settings → Advanced → REST API
2. Find your API key or create new one
3. Ensure **Permissions** are set to **Read/Write**
4. Save keys to `.env.local`

## What Happens After Webhook Setup

### Automatic Order Creation Flow:

1. ✅ Customer completes Stripe payment
2. ✅ Stripe sends webhook to your server
3. ✅ Webhook handler receives payment confirmation
4. ✅ **Order created in WooCommerce** with:
   - Customer billing information
   - Customer shipping information
   - Line items (products + quantities)
   - Payment status: "Processing"
   - Payment method: "Stripe"
   - Transaction ID from Stripe
5. ✅ Order appears in WP Admin → WooCommerce → Orders
6. ✅ Customer data saved to WordPress
7. ✅ Inventory automatically updated
8. ✅ WooCommerce sends order confirmation email (if enabled)

### Order Data Saved to WordPress:

```
✅ Customer Information:
- First Name, Last Name
- Email, Phone
- Billing Address (Address 1, Address 2, City, State, Postcode, Country)
- Shipping Address (Address 1, Address 2, City, State, Postcode, Country)

✅ Order Information:
- Products (ID, Name, Quantity, Price)
- Order Total
- Payment Method: Stripe
- Payment Status: Paid
- Transaction ID

✅ Stripe Metadata:
- Stripe Session ID
- Stripe Payment Intent ID

✅ Automatic Actions:
- Inventory reduced
- Order status set to "Processing"
- Order confirmation email sent
```

## Fetching Shipping Locations from WooCommerce

### Current Implementation:

I've created an API endpoint that fetches shipping zones from WooCommerce:

**Endpoint:** `/api/shipping-locations`

### How It Works:

1. Queries WooCommerce shipping zones
2. Extracts all countries and states configured in zones
3. Returns list of countries you ship to
4. Returns states for countries that have state-specific zones

### Using in Checkout Form:

The checkout page can fetch this data and populate the country/state dropdowns dynamically.

### Example Response:

```json
{
  "countries": ["AE", "SA", "KW", "QA", "BH", "OM", "US", "GB", "CA"],
  "countriesWithStates": {
    "US": ["CA", "NY", "TX", "FL"],
    "CA": ["ON", "QC", "BC"]
  },
  "zones": [
    { "id": 1, "name": "UAE & GCC" },
    { "id": 2, "name": "International" }
  ]
}
```

### Configure Shipping Zones in WooCommerce:

1. Go to: WP Admin → WooCommerce → Settings → Shipping
2. Create shipping zones (e.g., "UAE & GCC", "USA", "International")
3. Add locations to each zone:
   - Countries: AE, SA, KW, QA, BH, OM
   - Specific states: US:CA, US:NY, etc.
4. Set shipping methods for each zone
5. Save changes

The API will automatically fetch these configured locations.

## Environment Variables Needed

Complete `.env.local` setup:

```env
# WooCommerce
NEXT_PUBLIC_WOOCOMMERCE_URL=https://yourdomain.com
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

## Testing the Complete Flow

### 1. Test Payment + Order Creation:

1. Add products to cart
2. Go to checkout
3. Fill in billing/shipping information
4. Click "Continue to Payment"
5. Complete payment in Stripe (use test card: 4242 4242 4242 4242)
6. **Check WooCommerce Orders** in WordPress admin
7. Verify order was created with correct data

### 2. Verify Order in WordPress:

```
WP Admin → WooCommerce → Orders → [Latest Order]

Check:
✅ Customer name matches
✅ Email matches
✅ Billing address correct
✅ Shipping address correct
✅ Products correct
✅ Order total correct
✅ Payment status: Processing
✅ Payment method: Stripe
✅ Transaction ID present
```

### 3. Test Webhook Locally:

```bash
# Terminal 1: Run your Next.js app
npm run dev

# Terminal 2: Forward Stripe webhooks
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Terminal 3: Trigger test webhook
stripe trigger checkout.session.completed
```

Check console for "WooCommerce order created successfully" message.

## Troubleshooting

### Order Not Created in WooCommerce

**Problem:** Payment succeeds but no order in WordPress

**Solutions:**
1. Check webhook is configured in Stripe Dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` in `.env.local`
3. Check server logs for webhook errors
4. Verify WooCommerce API has Read/Write permissions
5. Test webhook manually: `stripe trigger checkout.session.completed`

### Invalid Webhook Signature

**Problem:** `Webhook Error: No signatures found matching the expected signature`

**Solutions:**
1. Copy correct webhook secret from Stripe Dashboard
2. Make sure you're using the right secret:
   - Production: Use webhook secret from live mode
   - Development: Use `stripe listen` webhook secret
3. Restart your Next.js server after adding secret

### WooCommerce Order Creation Failed

**Problem:** Webhook runs but order creation fails

**Solutions:**
1. Check WooCommerce API credentials are correct
2. Verify API has Read/Write permissions
3. Check product IDs exist in WooCommerce
4. Review server logs for specific error messages

## Production Deployment Checklist

Before going live:

- [ ] Create webhook in Stripe **live mode**
- [ ] Use live Stripe keys (pk_live_, sk_live_)
- [ ] Set correct production webhook URL
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Test complete flow in production
- [ ] Verify orders appear in WooCommerce
- [ ] Test email notifications
- [ ] Monitor webhook logs for errors

## Next Steps (Optional Enhancements)

1. **Email Notifications:**
   - WooCommerce handles this automatically
   - Configure in: WP Admin → WooCommerce → Settings → Emails

2. **Order Status Updates:**
   - Configure automatic status changes
   - Send tracking information

3. **Customer Accounts:**
   - Create WordPress user accounts for customers
   - Allow order history viewing

4. **Inventory Management:**
   - WooCommerce handles this automatically
   - Low stock notifications configured in WooCommerce

5. **Tax Calculation:**
   - Configure in WooCommerce → Settings → Tax
   - Automatic tax calculation based on location

## Support Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [WooCommerce Shipping Zones](https://woocommerce.com/document/setting-up-shipping-zones/)
