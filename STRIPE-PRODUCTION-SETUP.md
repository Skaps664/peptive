# Going Live with Stripe - Production Setup Guide

Complete guide for switching from Stripe test mode to live production mode.

---

## 🔄 Test Mode vs Live Mode

### Current Setup (Test Mode):

- ✅ Stripe CLI forwarding webhooks locally
- ✅ Test keys in `.env.local`
- ✅ `sk_test_...` and `pk_test_...` keys
- ✅ Webhook secret: `whsec_...` (from CLI)

### Production Setup (Live Mode):

- 🔴 Need live Stripe keys
- 🔴 Need production webhook endpoint (no CLI forwarding)
- 🔴 Different webhook secret
- 🔴 Deploy to production domain

---

## Step 1: Get Live Stripe Keys

### 1.1 Activate Your Stripe Account

```
1. Go to dashboard.stripe.com
2. Click "Activate your account" (top banner)
3. Complete business verification:
   - Business details
   - Bank account information
   - Identity verification
   - Tax information
```

**⚠️ Important:** Stripe review can take 1-3 business days.

### 1.2 Get Live API Keys

```
1. Go to: dashboard.stripe.com/apikeys
2. Toggle from "Test mode" to "Live mode" (top right)
3. Click "Reveal live key" for Secret key
4. Copy both keys:
   - Publishable key: pk_live_...
   - Secret key: sk_live_...
```

**🔒 Security:** Never expose live secret keys. Keep them server-side only.

---

## Step 2: Update Environment Variables

### Local Development (.env.local)

Keep test keys for local development:

```bash
# DEVELOPMENT - Keep using test keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Production (Vercel/Hosting Platform)

Add live keys to your hosting platform:

**For Vercel:**

```
1. Go to: vercel.com/[your-project]/settings/environment-variables
2. Add production environment variables:
```

| Key                                    | Value                           | Environment |
| -------------------------------------- | ------------------------------- | ----------- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...`                 | Production  |
| `STRIPE_SECRET_KEY`                  | `sk_live_...`                 | Production  |
| `STRIPE_WEBHOOK_SECRET`              | `whsec_...` (see Step 3)      | Production  |
| `NEXT_PUBLIC_SITE_URL`               | `https://peptivepeptides.com` | Production  |

**For Other Hosting:**

- Netlify: Site settings → Environment variables
- Railway: Project → Variables
- Render: Dashboard → Environment

---

## Step 3: Setup Production Webhooks

**⚠️ Critical:** The Stripe CLI only works for local development. Production needs a real webhook endpoint.

### 3.1 Register Webhook Endpoint

```
1. Go to: dashboard.stripe.com/webhooks
2. Toggle to "Live mode" (top right)
3. Click "+ Add endpoint"
4. Enter your production URL:
   
   Endpoint URL: https://yoursite.com/api/webhooks/stripe
   
   Example: https://peptivepeptides.com/api/webhooks/stripe
```

### 3.2 Select Events to Listen To

Check these events:

**Essential Events:**

- ✅ `checkout.session.completed` - When payment succeeds
- ✅ `checkout.session.expired` - When session expires
- ✅ `payment_intent.succeeded` - Payment successful
- ✅ `payment_intent.payment_failed` - Payment failed

**Optional Events:**

- `charge.succeeded` - Charge successful
- `charge.updated` - Charge updated
- `charge.refunded` - Refund processed
- `customer.created` - New customer
- `invoice.paid` - Invoice paid (for subscriptions)

**Recommended:** Select all events (easier, your code ignores unknown ones)

### 3.3 Get Production Webhook Secret

```
1. After creating webhook, click on it
2. Click "Reveal" under "Signing secret"
3. Copy the secret: whsec_...
4. Add to production environment variables
```

**⚠️ Important:** This secret is DIFFERENT from your local CLI secret!

---

## Step 4: Verify Webhook Endpoint is Accessible

Before going live, test your webhook endpoint:

### 4.1 Deploy Your Site

```bash
# If using Vercel
vercel --prod

# If using other platforms, deploy normally
```

### 4.2 Test Webhook Endpoint

```
1. In Stripe Dashboard → Webhooks → Your endpoint
2. Click "Send test webhook"
3. Select event: checkout.session.completed
4. Click "Send test webhook"
```

✅ **Success:** You should see "200 OK" response

🔴 **Error:** Check:

- Is site deployed and live?
- Is URL correct?
- Are environment variables set?
- Check deployment logs

---

## Step 5: Test a Real Payment

### 5.1 Create Test Coupon in Live Mode

```bash
# First, login to CLI in live mode
stripe login

# Create live coupon
stripe coupons create --id WELCOME10 --percent-off 10 --duration once --name "Welcome 10% Off" --live
```

### 5.2 Test Payment Flow

```
1. Go to your production site
2. Add product to cart
3. Go to checkout
4. Use test card in LIVE mode:
   
   ⚠️ WAIT! Don't use real card for testing!
   
   In live mode, you CANNOT use test cards.
   You must use a real card OR test in test mode.
```

**Recommended Approach:**

Option A: **Test thoroughly in test mode first**

```
1. Use test mode extensively
2. Test all scenarios
3. Only switch to live when confident
```

Option B: **Use very small amount**

```
1. Create a $0.50 product
2. Process real payment
3. Immediately refund in Stripe Dashboard
```

---

## Step 6: Live Mode Checklist

Before going live, verify:

### Site Configuration:

- [ ] Production domain is set up
- [ ] SSL certificate is active (HTTPS)
- [ ] Environment variables are set in production
- [ ] Live Stripe keys are configured
- [ ] Production webhook endpoint is registered
- [ ] Webhook secret is updated

### Stripe Account:

- [ ] Business verification completed
- [ ] Bank account connected
- [ ] Payment methods enabled (cards, Apple Pay, etc.)
- [ ] Business name & branding set
- [ ] Email receipts configured
- [ ] Dispute settings reviewed

### Testing:

- [ ] Test mode payments work perfectly
- [ ] Webhooks receive events correctly
- [ ] WooCommerce orders are created
- [ ] Emails are sent to customers
- [ ] Order appears in WordPress admin
- [ ] Refund process tested (test mode)

### Legal & Compliance:

- [ ] Terms of Service page exists
- [ ] Privacy Policy page exists
- [ ] Refund policy is clear
- [ ] Product descriptions are accurate
- [ ] Shipping information is correct

---

## Step 7: Monitoring & Logs

### Stripe Dashboard

**Monitor payments:**

```
dashboard.stripe.com/payments
```

**Check webhook logs:**

```
dashboard.stripe.com/webhooks → Select your endpoint → Logs
```

**View customers:**

```
dashboard.stripe.com/customers
```

### Your Application Logs

Check for webhook errors:

```
Production logs (Vercel example):
vercel logs [deployment-url]
```

---

## FAQ: Production Setup

### Q: Do I need to keep the Stripe CLI running in production?

**A: NO!**

- ✅ **Local Development:** Use Stripe CLI (`stripe listen`)
- 🔴 **Production:** Use registered webhook endpoint

The CLI is only for local development. In production, Stripe sends webhooks directly to your URL.

---

### Q: Where do I see webhooks in WordPress/WooCommerce?

**A: You don't see Stripe webhooks in WordPress.**

Webhooks go to your Next.js API route (`/api/webhooks/stripe`), which then creates WooCommerce orders via REST API.

**What you WILL see in WordPress:**

- ✅ Orders in WooCommerce → Orders
- ✅ Customer data in WooCommerce → Customers
- ✅ Order emails sent to customers

**What you see in Stripe Dashboard:**

- ✅ Payments
- ✅ Webhook delivery logs
- ✅ Customer data
- ✅ Refunds

They are separate systems working together.

---

### Q: How do I know webhooks are working in production?

**Check these places:**

1. **Stripe Dashboard:**

   ```
   Webhooks → Your endpoint → Click it
   You'll see delivery attempts with response codes
   ```
2. **Next.js Logs:**

   ```
   Check your deployment logs
   Should see: "Payment successful!" messages
   ```
3. **WooCommerce Orders:**

   ```
   WordPress Admin → WooCommerce → Orders
   New orders should appear after payment
   ```

---

### Q: Can I use both test and live mode simultaneously?

**A: Yes!**

**Local Development:**

```bash
# Use test keys
STRIPE_SECRET_KEY=sk_test_...
```

**Production:**

```bash
# Use live keys
STRIPE_SECRET_KEY=sk_live_...
```

This way you can:

- Test locally with fake cards
- Accept real payments in production

---

### Q: What if webhook delivery fails?

Stripe automatically retries failed webhooks:

- Immediate retry
- 1 hour later
- 6 hours later
- 24 hours later

**How to handle:**

1. **See failed deliveries:**

   ```
   Stripe Dashboard → Webhooks → Your endpoint
   Failed events show in red
   ```
2. **Manually retry:**

   ```
   Click failed event → "Resend event"
   ```
3. **Check your logs:**

   ```
   See why webhook handler returned error
   Fix the issue
   Retry the webhook
   ```

---

## Quick Reference: Keys & Secrets

### Test Mode (Local Development):

```bash
# Public keys (safe to expose in frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Secret keys (server-side only)
STRIPE_SECRET_KEY=sk_test_...

# Webhook secrets
STRIPE_WEBHOOK_SECRET=whsec_... (from stripe listen)
```

### Live Mode (Production):

```bash
# Public keys (safe to expose in frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Secret keys (server-side only)  
STRIPE_SECRET_KEY=sk_live_...

# Webhook secrets
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe Dashboard)
```

---

## Deployment Guide (Vercel Example)

### 1. Install Vercel CLI

```bash
pnpm add -g vercel
```

### 2. Deploy

```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

### 3. Add Environment Variables

```bash
# Using CLI
vercel env add STRIPE_SECRET_KEY production

# Or manually in dashboard:
# vercel.com/[project]/settings/environment-variables
```

### 4. Set Production Domain

```
1. Go to vercel.com/[project]/settings/domains
2. Add your domain: peptivepeptides.com
3. Configure DNS with your registrar
4. Wait for SSL certificate (automatic)
```

### 5. Redeploy

```bash
vercel --prod
```

---

## Environment Variables Summary

Create these files in your project:

### `.env.local` (Local development - in .gitignore)

```bash
# Test mode keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (from CLI)

# Local URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### `.env.production` (Never commit! Document only)

```bash
# Live mode keys (add these to hosting platform)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe Dashboard)

# Production URLs
NEXT_PUBLIC_SITE_URL=https://peptivepeptides.com
```

---

## Next Steps

1. **Complete Stripe Activation** (1-3 days)

   - Submit business verification
   - Wait for approval
2. **Thoroughly Test in Test Mode** (1-2 days)

   - Test all payment scenarios
   - Verify order creation
   - Test email delivery
   - Test refund process
3. **Deploy to Production** (1 hour)

   - Deploy to Vercel/hosting
   - Configure custom domain
   - Set environment variables
4. **Configure Production Webhooks** (30 min)

   - Register webhook endpoint
   - Get production webhook secret
   - Test webhook delivery
5. **Go Live!** 🚀

   - Process first real payment
   - Monitor Stripe Dashboard
   - Check order in WooCommerce
   - Verify customer email

---

## Support & Troubleshooting

**Stripe Issues:**

- Dashboard: dashboard.stripe.com/support
- Docs: stripe.com/docs

**Webhook Issues:**

- Check: dashboard.stripe.com/webhooks
- Test: Click "Send test webhook"
- Debug: View delivery attempts

**Deployment Issues:**

- Check deployment logs
- Verify environment variables
- Test endpoint URL directly

---

Need help with any specific step? Let me know!
