# Stripe Webhooks: Development vs Production

Quick visual guide to understand how webhooks work differently in development and production.

---

## 🔵 Development Mode (Local Testing)

```
┌─────────────────────────────────────────────────────────────┐
│                     STRIPE (Test Mode)                       │
│                                                              │
│  Customer pays → Payment processed → Events generated       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Events sent to Stripe CLI
                           ↓
                  ┌─────────────────┐
                  │   Stripe CLI    │  Running: stripe listen
                  │  (Port forward) │  --forward-to localhost:3000/...
                  └────────┬────────┘
                           │
                           │ Forwards to local server
                           ↓
                  ┌─────────────────┐
                  │  Next.js Local  │  http://localhost:3000
                  │   Dev Server    │  /api/webhooks/stripe
                  └────────┬────────┘
                           │
                           │ Creates order via REST API
                           ↓
                  ┌─────────────────┐
                  │  WooCommerce    │  https://yoursite.com/wp-json/wc/v3
                  │   (WordPress)   │  
                  └─────────────────┘
```

**Key Points:**
- ✅ Stripe CLI must be running
- ✅ Use test keys (pk_test_..., sk_test_...)
- ✅ Webhook secret from CLI: `whsec_...`
- ✅ Works on localhost
- 🔴 Not for production use

**Command:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 🟢 Production Mode (Live Site)

```
┌─────────────────────────────────────────────────────────────┐
│                     STRIPE (Live Mode)                       │
│                                                              │
│  Customer pays → Payment processed → Events generated       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Direct HTTPS POST
                           │ (No CLI needed!)
                           ↓
                  ┌─────────────────┐
                  │   Next.js App   │  https://peptivepeptides.com
                  │   (Production)  │  /api/webhooks/stripe
                  └────────┬────────┘
                           │
                           │ Creates order via REST API
                           ↓
                  ┌─────────────────┐
                  │  WooCommerce    │  https://yoursite.com/wp-json/wc/v3
                  │   (WordPress)   │  
                  └─────────────────┘
```

**Key Points:**
- ✅ Direct webhook delivery from Stripe
- ✅ Use live keys (pk_live_..., sk_live_...)
- ✅ Webhook secret from Stripe Dashboard
- ✅ No CLI needed
- ✅ Must be HTTPS (SSL certificate required)

**Setup:**
```
1. Stripe Dashboard → Webhooks → Add endpoint
2. URL: https://peptivepeptides.com/api/webhooks/stripe
3. Events: Select all or specific events
4. Copy webhook signing secret
5. Add to production env vars
```

---

## 🔄 Side-by-Side Comparison

| Aspect | Development | Production |
|--------|-------------|------------|
| **Stripe Mode** | Test Mode | Live Mode |
| **Keys** | `pk_test_...` `sk_test_...` | `pk_live_...` `sk_live_...` |
| **Webhook Delivery** | Stripe CLI forwards | Direct HTTPS POST |
| **Webhook Secret** | From `stripe listen` | From Stripe Dashboard |
| **URL** | `localhost:3000` | `https://yourdomain.com` |
| **SSL Required?** | No | Yes (HTTPS) |
| **CLI Running?** | Yes (must run) | No (not needed) |
| **Webhook Endpoint** | Local machine | Public server |
| **Setup** | `stripe listen --forward-to` | Register in Dashboard |

---

## ⚙️ Environment Variables Breakdown

### Development (.env.local)
```bash
# Test mode - for local development
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Sk3Jn...  # Can use in React components
STRIPE_SECRET_KEY=sk_test_51Sk3JnEjHiqowRps...        # Server-side only
STRIPE_WEBHOOK_SECRET=whsec_e651bd910303c16...        # From: stripe listen --print-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Hosting Platform)
```bash
# Live mode - for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Can use in React components
STRIPE_SECRET_KEY=sk_live_...                   # Server-side only
STRIPE_WEBHOOK_SECRET=whsec_...                 # From: Stripe Dashboard → Webhooks
NEXT_PUBLIC_SITE_URL=https://peptivepeptides.com
```

---

## 📝 Webhook Registration Checklist

### Local Development:
- [ ] Stripe CLI installed
- [ ] Logged in: `stripe login`
- [ ] Listener running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Webhook secret copied to .env.local
- [ ] Test payment processed successfully

### Production:
- [ ] Site deployed with HTTPS
- [ ] Live Stripe keys added to hosting env vars
- [ ] Webhook endpoint registered in Stripe Dashboard
- [ ] Production webhook secret added to env vars
- [ ] Test webhook sent from Dashboard (200 OK)
- [ ] Real payment test completed

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Using CLI webhook secret in production
```bash
# WRONG - This only works locally
STRIPE_WEBHOOK_SECRET=whsec_e651bd910303c16...  (from stripe listen)
```

**Fix:** Get production secret from Stripe Dashboard → Webhooks

---

### ❌ Mistake 2: Not registering webhook endpoint
```
Error: "No webhook endpoint configured"
```

**Fix:** 
1. Go to dashboard.stripe.com/webhooks
2. Toggle to Live mode
3. Click "+ Add endpoint"
4. Enter production URL

---

### ❌ Mistake 3: Wrong webhook URL
```bash
# WRONG
https://peptivepeptides.com/webhooks/stripe

# CORRECT
https://peptivepeptides.com/api/webhooks/stripe
```

Must match your Next.js API route path!

---

### ❌ Mistake 4: Using test keys in production
```bash
# WRONG - These won't work with real payments
STRIPE_SECRET_KEY=sk_test_...
```

**Fix:** Use live keys (sk_live_... and pk_live_...)

---

### ❌ Mistake 5: Mixing test and live data
```
Test mode payment → Live mode webhook = ❌ Won't work
Live mode payment → Test mode webhook = ❌ Won't work
```

**Rule:** Test mode keys = Test webhooks | Live mode keys = Live webhooks

---

## 🔍 How to Verify Webhooks Work

### Development:
```bash
# Terminal 1: Run dev server
pnpm dev

# Terminal 2: Run Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3: Trigger test event
stripe trigger checkout.session.completed

# Check Terminal 2 for:
✔ Verified signature
→ checkout.session.completed [evt_...]
← 200 POST http://localhost:3000/api/webhooks/stripe
```

### Production:
```
1. Stripe Dashboard → Webhooks → Your endpoint
2. Click "Send test webhook"
3. Select: checkout.session.completed
4. Click "Send test webhook"
5. Check response: Should see "200 OK"
6. Check WordPress: Order should be created
```

---

## 🎯 Quick Reference

**Get test webhook secret:**
```bash
stripe listen --print-secret
```

**Get live webhook secret:**
```
dashboard.stripe.com/webhooks → Your endpoint → Reveal secret
```

**Test webhook endpoint:**
```bash
# Development
curl -X POST http://localhost:3000/api/webhooks/stripe

# Production
curl -X POST https://peptivepeptides.com/api/webhooks/stripe
```

**View webhook logs:**
```
dashboard.stripe.com/webhooks → Click endpoint → View attempts
```

---

## 📖 Related Documentation

- [STRIPE-PRODUCTION-SETUP.md](./STRIPE-PRODUCTION-SETUP.md) - Complete production guide
- [Stripe Webhooks Docs](https://stripe.com/docs/webhooks)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)

---

**Questions about webhooks? Check STRIPE-PRODUCTION-SETUP.md!**
