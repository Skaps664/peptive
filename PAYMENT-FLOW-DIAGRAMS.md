# 🔄 Payment Flow Diagrams

**Visual guide to understand how payments work in your system**

---

## 📊 Current System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Product     │ -> │    Cart      │ -> │   Checkout   │      │
│  │   Pages      │    │   (Zustand)  │    │     Form     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS API ROUTES                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  /api/create-checkout-session                            │   │
│  │  - Receives cart items + customer info                   │   │
│  │  - Creates Stripe Checkout Session                       │   │
│  │  - Returns checkout URL                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         STRIPE                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Checkout Session                                        │   │
│  │  - Customer enters card details                          │   │
│  │  - Stripe processes payment                              │   │
│  │  - 3D Secure if needed                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE WEBHOOK                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  /api/webhooks/stripe                                    │   │
│  │  - Receives payment confirmation                         │   │
│  │  - Verifies signature                                    │   │
│  │  - Creates WooCommerce order                             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      WOOCOMMERCE                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Order Created                                           │   │
│  │  - Stock deducted (via plugin)                           │   │
│  │  - Confirmation email sent                               │   │
│  │  - Order visible in admin                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛒 Detailed Payment Flow (Stripe Direct)

### Step-by-Step Process

```
1️⃣  USER ADDS PRODUCTS TO CART
    ┌─────────────────────────────────────────┐
    │ User clicks "Add to Cart"               │
    │ ↓                                       │
    │ Zustand store updates                   │
    │ ↓                                       │
    │ Cart item saved to localStorage         │
    │ ↓                                       │
    │ Cart count badge updates                │
    └─────────────────────────────────────────┘

2️⃣  USER VIEWS CART
    ┌─────────────────────────────────────────┐
    │ Navigate to /cart                       │
    │ ↓                                       │
    │ Display all cart items                  │
    │ ↓                                       │
    │ Calculate subtotal (client-side)        │
    │ ↓                                       │
    │ Show estimated tax & shipping           │
    └─────────────────────────────────────────┘

3️⃣  USER PROCEEDS TO CHECKOUT
    ┌─────────────────────────────────────────┐
    │ Click "Proceed to Checkout"             │
    │ ↓                                       │
    │ Navigate to /checkout                   │
    │ ↓                                       │
    │ Display checkout form                   │
    └─────────────────────────────────────────┘

4️⃣  USER FILLS CHECKOUT FORM
    ┌─────────────────────────────────────────┐
    │ Enter billing information               │
    │ - First name, Last name                 │
    │ - Email, Phone                          │
    │ - Address, City, State, ZIP             │
    │ - Country                               │
    │ ↓                                       │
    │ Enter shipping information              │
    │ (or check "Same as billing")            │
    │ ↓                                       │
    │ Select shipping method (if applicable)  │
    └─────────────────────────────────────────┘

5️⃣  SHIPPING & TAX CALCULATION
    ┌─────────────────────────────────────────┐
    │ On country/state change                 │
    │ ↓                                       │
    │ POST /api/calculate-shipping-tax        │
    │ {                                       │
    │   items: [{ id, quantity }],            │
    │   country: "AE",                        │
    │   state: "Dubai"                        │
    │ }                                       │
    │ ↓                                       │
    │ API creates temporary WooCommerce order │
    │ ↓                                       │
    │ WooCommerce calculates shipping & tax   │
    │ ↓                                       │
    │ API deletes temporary order             │
    │ ↓                                       │
    │ Returns { shipping, tax, subtotal }     │
    │ ↓                                       │
    │ Frontend displays updated totals        │
    └─────────────────────────────────────────┘

6️⃣  USER SUBMITS CHECKOUT FORM
    ┌─────────────────────────────────────────┐
    │ Click "Complete Order"                  │
    │ ↓                                       │
    │ Validate form data                      │
    │ ↓                                       │
    │ Show loading state                      │
    │ ↓                                       │
    │ POST /api/create-checkout-session       │
    │ {                                       │
    │   items: [...cart items],               │
    │   customerEmail: "...",                 │
    │   billingDetails: {...},                │
    │   shippingDetails: {...}                │
    │ }                                       │
    └─────────────────────────────────────────┘

7️⃣  API CREATES STRIPE SESSION
    ┌─────────────────────────────────────────┐
    │ Transform cart items to Stripe format   │
    │ ↓                                       │
    │ Create line items with metadata:        │
    │ {                                       │
    │   product_data: {                       │
    │     name: "Product Name",               │
    │     metadata: {                         │
    │       product_id: "123",                │
    │       bundle_type: "3-month"            │
    │     }                                   │
    │   },                                    │
    │   unit_amount: 29900 (AED 299)          │
    │ }                                       │
    │ ↓                                       │
    │ Call Stripe API:                        │
    │ stripe.checkout.sessions.create({       │
    │   line_items: [...],                    │
    │   mode: 'payment',                      │
    │   success_url: '/checkout/success',     │
    │   cancel_url: '/checkout?cancelled=true'│
    │ })                                      │
    │ ↓                                       │
    │ Return { sessionId, url }               │
    └─────────────────────────────────────────┘

8️⃣  REDIRECT TO STRIPE
    ┌─────────────────────────────────────────┐
    │ Frontend receives checkout URL          │
    │ ↓                                       │
    │ window.location.href = session.url      │
    │ ↓                                       │
    │ User redirected to Stripe Checkout      │
    │ (https://checkout.stripe.com/...)       │
    └─────────────────────────────────────────┘

9️⃣  USER COMPLETES PAYMENT ON STRIPE
    ┌─────────────────────────────────────────┐
    │ User sees Stripe checkout page          │
    │ ↓                                       │
    │ Enter card details:                     │
    │ - Card number                           │
    │ - Expiry date                           │
    │ - CVC                                   │
    │ - ZIP code                              │
    │ ↓                                       │
    │ Stripe validates card                   │
    │ ↓                                       │
    │ 3D Secure authentication (if required)  │
    │ ↓                                       │
    │ Payment processed                       │
    └─────────────────────────────────────────┘

🔟  STRIPE SENDS WEBHOOK
    ┌─────────────────────────────────────────┐
    │ Payment successful                      │
    │ ↓                                       │
    │ Stripe creates webhook event:           │
    │ "checkout.session.completed"            │
    │ ↓                                       │
    │ POST /api/webhooks/stripe               │
    │ Headers: {                              │
    │   stripe-signature: "..."               │
    │ }                                       │
    │ Body: {                                 │
    │   type: "checkout.session.completed",   │
    │   data: {                               │
    │     object: {                           │
    │       id: "cs_...",                     │
    │       payment_intent: "pi_...",         │
    │       customer_email: "...",            │
    │       metadata: {...}                   │
    │     }                                   │
    │   }                                     │
    │ }                                       │
    └─────────────────────────────────────────┘

1️⃣1️⃣  WEBHOOK PROCESSES PAYMENT
    ┌─────────────────────────────────────────┐
    │ Verify webhook signature                │
    │ ↓                                       │
    │ stripe.webhooks.constructEvent(         │
    │   body, signature, webhookSecret        │
    │ )                                       │
    │ ↓                                       │
    │ Extract session data                    │
    │ ↓                                       │
    │ Parse metadata:                         │
    │ - billingDetails                        │
    │ - shippingDetails                       │
    │ ↓                                       │
    │ Get line items with product metadata    │
    │ ↓                                       │
    │ Create WooCommerce order                │
    └─────────────────────────────────────────┘

1️⃣2️⃣  CREATE WOOCOMMERCE ORDER
    ┌─────────────────────────────────────────┐
    │ POST /wp-json/wc/v3/orders              │
    │ {                                       │
    │   status: "processing",                 │
    │   set_paid: true,                       │
    │   billing: {...},                       │
    │   shipping: {...},                      │
    │   line_items: [                         │
    │     {                                   │
    │       product_id: 123,                  │
    │       quantity: 1                       │
    │     }                                   │
    │   ],                                    │
    │   payment_method: "stripe",             │
    │   transaction_id: "pi_..."              │
    │ }                                       │
    │ ↓                                       │
    │ WooCommerce creates order               │
    │ ↓                                       │
    │ Returns order object                    │
    └─────────────────────────────────────────┘

1️⃣3️⃣  STOCK DEDUCTION (AUTOMATIC)
    ┌─────────────────────────────────────────┐
    │ WooCommerce fires hook:                 │
    │ "woocommerce_reduce_order_stock"        │
    │ ↓                                       │
    │ Peptive Bundle Plugin intercepts        │
    │ ↓                                       │
    │ Check if product is bundle              │
    │ ↓                                       │
    │ Get bundle components                   │
    │ ↓                                       │
    │ For each component:                     │
    │   - Calculate qty to deduct             │
    │   - Reduce component stock              │
    │   - Add order note                      │
    │ ↓                                       │
    │ Update bundle stock status              │
    └─────────────────────────────────────────┘

1️⃣4️⃣  EMAIL NOTIFICATIONS
    ┌─────────────────────────────────────────┐
    │ Stripe sends email to customer:         │
    │ ✉️  "Payment successful"                 │
    │ ↓                                       │
    │ WooCommerce sends email to customer:    │
    │ ✉️  "Order confirmation #123"            │
    │ ↓                                       │
    │ WooCommerce sends email to admin:       │
    │ ✉️  "New order #123"                     │
    └─────────────────────────────────────────┘

1️⃣5️⃣  USER REDIRECTED TO SUCCESS PAGE
    ┌─────────────────────────────────────────┐
    │ Stripe redirects user to:               │
    │ /checkout/success?session_id=cs_...     │
    │ ↓                                       │
    │ Success page displays:                  │
    │ ✅ "Payment successful!"                 │
    │ ✅ Order number                          │
    │ ✅ Order summary                         │
    │ ✅ "Check your email"                    │
    │ ↓                                       │
    │ Cart is cleared (optional)              │
    └─────────────────────────────────────────┘
```

---

## 🔄 Stock Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUNDLE STOCK CALCULATION                      │
└─────────────────────────────────────────────────────────────────┘

Example: 3-Month Bundle
├─ Component A (need 3x) - Stock: 30 → Can make 10 bundles
├─ Component B (need 3x) - Stock: 15 → Can make 5 bundles
└─ Component C (need 3x) - Stock: 60 → Can make 20 bundles

Bundle Stock = MIN(10, 5, 20) = 5 bundles available ✅

┌─────────────────────────────────────────────────────────────────┐
│                    STOCK DEDUCTION PROCESS                       │
└─────────────────────────────────────────────────────────────────┘

Customer orders 2x 3-Month Bundles:

Step 1: Order placed (status: processing)
├─ Bundle stock: 5
└─ Order quantity: 2

Step 2: Hook fired: woocommerce_reduce_order_stock
├─ Plugin checks: Is this a bundle? ✅ Yes
└─ Get bundle components

Step 3: Deduct component stock
├─ Component A: 30 - (2 × 3) = 24 remaining
├─ Component B: 15 - (2 × 3) = 9 remaining
└─ Component C: 60 - (2 × 3) = 54 remaining

Step 4: Recalculate bundle stock
├─ Component A: 24 ÷ 3 = 8 bundles possible
├─ Component B: 9 ÷ 3 = 3 bundles possible
├─ Component C: 54 ÷ 3 = 18 bundles possible
└─ New bundle stock: MIN(8, 3, 18) = 3 bundles ✅

Step 5: Add order notes
└─ "Stock reduced: Component A (-6), Component B (-6), Component C (-6)"
```

---

## 💸 Shipping & Tax Calculation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              DYNAMIC SHIPPING/TAX CALCULATION                    │
└─────────────────────────────────────────────────────────────────┘

User enters checkout information:
├─ Country: AE (UAE)
├─ State: Dubai
├─ City: Dubai
└─ Postcode: 12345

Frontend debounces for 500ms, then:

POST /api/calculate-shipping-tax
{
  items: [
    { id: 123, quantity: 2 },
    { id: 456, quantity: 1 }
  ],
  country: "AE",
  state: "Dubai",
  postcode: "12345",
  city: "Dubai"
}

API Process:
├─ 1. Create temporary WooCommerce order
│   POST /wp-json/wc/v3/orders
│   {
│     status: "pending",
│     billing: { country: "AE", state: "Dubai", ... },
│     shipping: { country: "AE", state: "Dubai", ... },
│     line_items: [...]
│   }
│
├─ 2. WooCommerce calculates:
│   ├─ Matches shipping zone: "Middle East"
│   ├─ Applies shipping method: "Flat Rate" = AED 25
│   ├─ Calculates tax: 5% UAE VAT
│   └─ Returns order with calculated totals
│
├─ 3. Extract values:
│   ├─ shipping_total: "25.00"
│   ├─ shipping_tax: "1.25"
│   ├─ total_tax: "15.00"
│   └─ total: "340.25"
│
├─ 4. Delete temporary order
│   DELETE /wp-json/wc/v3/orders/{id}?force=true
│
└─ 5. Return to frontend
    {
      shipping: 26.25,  // 25.00 + 1.25 tax
      tax: 15.00,
      subtotal: 299.00
    }

Frontend updates display:
├─ Subtotal: AED 299.00
├─ Shipping: AED 26.25
├─ Tax: AED 15.00
└─ Total: AED 340.25
```

---

## ❌ Failed Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT FAILURE HANDLING                      │
└─────────────────────────────────────────────────────────────────┘

Scenario: Card declined

1️⃣  User on Stripe checkout
    ↓
2️⃣  Enters declined card: 4000 0000 0000 9995
    ↓
3️⃣  Stripe processes → DECLINED
    ↓
4️⃣  Stripe shows error: "Your card was declined"
    ↓
5️⃣  User can:
    ├─ Try different card
    ├─ Update card details
    └─ Cancel checkout
    ↓
6️⃣  If user cancels:
    ├─ Redirected to: /checkout?cancelled=true
    ├─ Cart still intact
    ├─ No order created
    ├─ No stock deducted
    └─ User can try again
    ↓
7️⃣  Stripe sends webhook: payment_intent.payment_failed
    ↓
8️⃣  Webhook handler logs failure
    ↓
9️⃣  Optional: Send recovery email
    ├─ "We noticed you had trouble completing your purchase"
    ├─ "Here's 10% off to try again"
    └─ Link back to cart

No order created ✅
No stock deducted ✅
Customer can retry ✅
```

---

## 🔁 Refund Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    REFUND PROCESS                                │
└─────────────────────────────────────────────────────────────────┘

Scenario: Customer requests refund

Option 1: Refund via Stripe Dashboard
├─ 1. Login to Stripe Dashboard
├─ 2. Find payment by customer email or amount
├─ 3. Click payment → Click "Refund"
├─ 4. Enter amount (full or partial)
├─ 5. Click "Refund"
├─ 6. Stripe sends webhook: charge.refunded
├─ 7. Manually update WooCommerce order status to "refunded"
└─ 8. Manually restore stock in WooCommerce

Option 2: Refund via WooCommerce (if plugin supports)
├─ 1. WP Admin → WooCommerce → Orders
├─ 2. Find order → Click "Refund"
├─ 3. Enter amount and reason
├─ 4. Check "Restock refunded items"
├─ 5. Click "Refund via Stripe"
├─ 6. Plugin calls Stripe API to process refund
├─ 7. Stock automatically restored
└─ 8. Order status updated to "refunded"

Recommended: Option 2 (integrated) or manual Option 1
```

---

## 🔐 Webhook Security

```
┌─────────────────────────────────────────────────────────────────┐
│                WEBHOOK SIGNATURE VERIFICATION                    │
└─────────────────────────────────────────────────────────────────┘

Stripe sends webhook:
POST /api/webhooks/stripe
Headers:
├─ stripe-signature: t=1234567890,v1=abc123...,v0=def456...
└─ content-type: application/json
Body:
└─ { type: "checkout.session.completed", data: {...} }

Your webhook handler:
├─ 1. Extract signature from header
│   const signature = request.headers.get('stripe-signature')
│
├─ 2. Extract raw body (important: must be raw text, not JSON)
│   const body = await request.text()
│
├─ 3. Verify signature
│   const event = stripe.webhooks.constructEvent(
│     body,
│     signature,
│     webhookSecret
│   )
│
├─ 4. If verification fails → throw error → return 400
│   ❌ Invalid signature
│   ❌ Timestamp too old
│   ❌ Wrong webhook secret
│
└─ 5. If verification succeeds → process event ✅

Why this matters:
├─ ✅ Prevents fake webhooks
├─ ✅ Ensures webhook came from Stripe
├─ ✅ Protects against replay attacks
└─ ✅ Validates webhook is recent (not replayed old event)
```

---

## 🌍 Multi-Currency Flow (Optional)

```
┌─────────────────────────────────────────────────────────────────┐
│              CURRENCY DETECTION & CONVERSION                     │
└─────────────────────────────────────────────────────────────────┘

User selects country:
├─ UAE (AE) → Currency: AED
├─ Saudi Arabia (SA) → Currency: SAR
├─ United States (US) → Currency: USD
└─ Kuwait (KW) → Currency: KWD

Checkout session creation:
├─ Detect currency from billing country
│   const currency = countryToCurrency[billingDetails.country]
│
├─ Convert prices (if multi-currency enabled)
│   const convertedPrice = convertCurrency(
│     item.price,
│     'AED', // base currency
│     currency // target currency
│   )
│
└─ Create Stripe session with detected currency
    price_data: {
      currency: currency.toLowerCase(), // 'aed', 'sar', 'usd'
      unit_amount: Math.round(convertedPrice * 100)
    }

Stripe processes in customer's currency ✅
Customer sees familiar pricing ✅
No confusion about exchange rates ✅
```

---

## 🧪 Testing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST MODE FLOW                                │
└─────────────────────────────────────────────────────────────────┘

Development environment:

1️⃣  Use test API keys
    ├─ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
    └─ STRIPE_SECRET_KEY=sk_test_...

2️⃣  Start Stripe CLI webhook listener
    $ stripe listen --forward-to localhost:3001/api/webhooks/stripe
    ├─ Generates webhook secret: whsec_test_...
    └─ Forwards webhooks to local server

3️⃣  Add test products to cart
    └─ Prices don't matter (test mode)

4️⃣  Checkout with test card
    ├─ Card: 4242 4242 4242 4242
    ├─ Expiry: 12/34 (any future date)
    ├─ CVC: 123 (any 3 digits)
    └─ ZIP: 12345 (any 5 digits)

5️⃣  Payment succeeds (test mode)
    └─ No real money charged ✅

6️⃣  Webhook received in terminal
    ├─ See event in Stripe CLI output
    └─ See handler logs in Next.js console

7️⃣  Order created in WooCommerce
    ├─ Check WP Admin → Orders
    └─ Order marked as "Processing" with test payment

8️⃣  Stock deducted (even in test)
    └─ Verify in product inventory

Test different scenarios:
├─ ✅ Successful payment: 4242 4242 4242 4242
├─ ❌ Declined card: 4000 0000 0000 9995
├─ 🔒 Requires 3D Secure: 4000 0025 0000 3155
└─ ⏰ Expired card: 4000 0000 0000 0069
```

---

## 📱 Mobile Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              APPLE PAY / GOOGLE PAY FLOW                         │
└─────────────────────────────────────────────────────────────────┘

User on mobile device:

1️⃣  Cart page shows "Apple Pay" / "Google Pay" button
    ↓
2️⃣  User clicks Apple Pay / Google Pay
    ↓
3️⃣  Device shows native payment sheet
    ├─ Card on file
    ├─ Billing address
    └─ Shipping address
    ↓
4️⃣  User authenticates (Face ID / Touch ID / PIN)
    ↓
5️⃣  Payment authorized instantly
    ↓
6️⃣  Stripe processes payment
    ↓
7️⃣  Webhook fires
    ↓
8️⃣  Order created
    ↓
9️⃣  Success page shown

Benefits:
├─ ⚡ Fastest checkout (< 30 seconds)
├─ 🔒 Most secure (biometric)
├─ 📱 Best mobile UX
└─ 📈 Highest conversion rate

Stripe handles everything automatically ✅
No extra code needed ✅
Enabled by default in Stripe Checkout ✅
```

---

## 🎯 Summary

### Your Payment Flow is:

✅ **Simple** - Straightforward path from cart to order  
✅ **Secure** - Stripe handles all sensitive data  
✅ **Automated** - Stock deduction happens automatically  
✅ **Reliable** - Webhook ensures order creation  
✅ **Scalable** - Can handle high volume  
✅ **User-friendly** - Clear steps, good UX  

### Key Components:

1. **Cart** - Client-side Zustand store
2. **Checkout** - Next.js page with form
3. **API** - Stripe session creation
4. **Stripe** - Payment processing
5. **Webhook** - Order creation trigger
6. **WooCommerce** - Order & stock management
7. **Plugin** - Bundle stock automation

### Everything is connected correctly! 🎉

---

*Visual guide created: February 4, 2026*
