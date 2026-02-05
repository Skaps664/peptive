# Headless WooCommerce Automation & Marketing Guide

Complete guide for managing automated emails, tracking, and marketing in your headless WooCommerce + Next.js setup.

---

## Table of Contents

1. [Email Automation (Order, Shipping, Tracking)](#email-automation)
2. [Klaviyo Integration](#klaviyo-integration)
3. [Google Analytics & Google Pixel](#google-analytics--google-pixel)
4. [Meta Pixel (Facebook Pixel)](#meta-pixel-facebook-pixel)
5. [Implementation Strategy](#implementation-strategy)

---

## Email Automation

### Option 1: WooCommerce Native Emails (Recommended for Headless)

**✅ Advantages:**
- Works automatically without any frontend code
- Emails trigger from backend when order is created
- Standard WooCommerce email templates
- Easy to customize in WP Admin

**How It Works:**
Your Stripe webhook already creates WooCommerce orders on the backend:

```typescript
// app/api/webhooks/stripe/route.ts (already implemented)
case 'checkout.session.completed': {
  await createWooCommerceOrder(session); // ✅ This triggers WooCommerce emails
}
```

**WooCommerce Emails That Fire Automatically:**
- ✅ **New Order** (to admin)
- ✅ **Order Confirmation** (to customer)
- ✅ **Processing Order** (to customer)
- ✅ **Completed Order** (to customer)
- ✅ **Order Notes** (when you add notes)

**Setup Steps:**

1. **Enable WooCommerce Emails:**
   ```
   WP Admin → WooCommerce → Settings → Emails
   ```
   - Enable all customer emails
   - Customize sender name/email
   - Customize email templates

2. **SMTP Configuration (Important!):**
   
   WooCommerce uses WordPress `wp_mail()` which may not deliver reliably. Use SMTP:

   **Recommended Plugins:**
   - **WP Mail SMTP** (Free)
   - **Post SMTP** (Free)
   - **FluentSMTP** (Free)

   **SMTP Providers:**
   - **SendGrid** (100 emails/day free)
   - **Mailgun** (First 1,000 free)
   - **Amazon SES** (Very cheap, $0.10/1000 emails)
   - **Gmail** (Limited to 500/day)

3. **Install WP Mail SMTP:**
   ```bash
   # In WordPress admin
   Plugins → Add New → Search "WP Mail SMTP"
   Install & Activate
   ```

4. **Configure SMTP Settings:**
   ```
   Settings → WP Mail SMTP
   
   From Email: orders@peptivepeptides.com
   From Name: Peptive Peptides
   
   Mailer: SendGrid (or your choice)
   API Key: [Your SendGrid API Key]
   ```

5. **Test Email:**
   ```
   WP Mail SMTP → Email Test
   Send test email to verify configuration
   ```

---

### Option 2: Klaviyo for Advanced Email Marketing

**✅ Advantages:**
- Advanced segmentation & automation
- Better deliverability than WooCommerce
- A/B testing, analytics, flows
- SMS marketing included
- Pre-made ecommerce templates

**Setup:**

#### Step 1: Install Klaviyo WooCommerce Plugin

```bash
# In WordPress Admin
Plugins → Add New → Search "Klaviyo"
Install "Klaviyo - WooCommerce Extension"
```

#### Step 2: Get Klaviyo API Keys

```
1. Sign up at klaviyo.com
2. Go to Account → Settings → API Keys
3. Create Private API Key
4. Copy Public API Key
```

#### Step 3: Configure Plugin

```
WooCommerce → Klaviyo
- Public API Key: pk_xxxxx
- Private API Key: sk_xxxxx
- Enable "Track Orders"
- Enable "Track Customer Data"
```

#### Step 4: Set Up Email Flows

Klaviyo will automatically create these flows:

**Core Automated Flows:**
- **Welcome Series** - New subscriber onboarding
- **Abandoned Cart** - Recover lost sales (3-email series)
- **Order Confirmation** - Professional receipts
- **Shipping Confirmation** - Tracking updates
- **Post-Purchase** - Review requests, upsells
- **Win-Back Campaign** - Re-engage inactive customers
- **Birthday/Anniversary** - Special offers

#### Step 5: Disable WooCommerce Emails

```
WooCommerce → Settings → Emails
Disable these (Klaviyo handles them):
- Processing Order
- Completed Order
- Customer Note

Keep these enabled:
- New Order (admin notification)
- Failed Order
```

#### Step 6: Frontend Tracking (Optional - for better data)

Add to your Next.js site:

```typescript
// lib/klaviyo.ts
export const klaviyoTrack = async (event: string, properties: any) => {
  const API_KEY = process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY;
  
  await fetch('https://a.klaviyo.com/api/events/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'revision': '2024-10-15',
    },
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          profile: {
            email: properties.email,
          },
          metric: {
            name: event,
          },
          properties,
        },
      },
    }),
  });
};

// Usage in checkout success page
// app/checkout/success/page.tsx
import { klaviyoTrack } from '@/lib/klaviyo';

useEffect(() => {
  if (orderData) {
    klaviyoTrack('Placed Order', {
      email: orderData.email,
      value: orderData.total,
      items: orderData.items,
    });
  }
}, [orderData]);
```

**Cost:**
- Free up to 250 contacts
- $20/month for 251-500 contacts
- Includes email + SMS

---

## Google Analytics & Google Pixel

### Google Analytics 4 (GA4)

**Purpose:** Track website traffic, user behavior, conversions

#### Setup:

1. **Create GA4 Property:**
   ```
   analytics.google.com
   → Create Property
   → Copy Measurement ID (G-XXXXXXXXXX)
   ```

2. **Install in Next.js:**

   ```typescript
   // app/layout.tsx
   import Script from 'next/script';
   
   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en">
         <head>
           {/* Google Analytics */}
           <Script
             src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
             strategy="afterInteractive"
           />
           <Script id="google-analytics" strategy="afterInteractive">
             {`
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
               gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                 page_path: window.location.pathname,
               });
             `}
           </Script>
         </head>
         <body>{children}</body>
       </html>
     );
   }
   ```

3. **Add to .env.local:**
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

4. **Track E-commerce Events:**

   ```typescript
   // lib/analytics.ts
   export const trackPurchase = (orderData: any) => {
     if (typeof window !== 'undefined' && (window as any).gtag) {
       (window as any).gtag('event', 'purchase', {
         transaction_id: orderData.id,
         value: orderData.total,
         currency: 'AED',
         items: orderData.items.map((item: any) => ({
           item_id: item.id,
           item_name: item.name,
           price: item.price,
           quantity: item.quantity,
         })),
       });
     }
   };
   
   export const trackAddToCart = (product: any) => {
     if (typeof window !== 'undefined' && (window as any).gtag) {
       (window as any).gtag('event', 'add_to_cart', {
         currency: 'AED',
         value: product.price,
         items: [{
           item_id: product.id,
           item_name: product.name,
           price: product.price,
           quantity: 1,
         }],
       });
     }
   };
   ```

5. **Use in Components:**

   ```typescript
   // app/checkout/success/page.tsx
   import { trackPurchase } from '@/lib/analytics';
   
   useEffect(() => {
     if (orderData) {
       trackPurchase(orderData);
     }
   }, [orderData]);
   ```

---

## Meta Pixel (Facebook Pixel)

**Purpose:** Track conversions for Facebook/Instagram ads, build custom audiences

### Setup:

1. **Create Meta Pixel:**
   ```
   business.facebook.com → Events Manager
   → Data Sources → Add → Meta Pixel
   → Copy Pixel ID
   ```

2. **Install in Next.js:**

   ```typescript
   // app/layout.tsx
   import Script from 'next/script';
   
   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en">
         <head>
           {/* Meta Pixel */}
           <Script id="meta-pixel" strategy="afterInteractive">
             {`
               !function(f,b,e,v,n,t,s)
               {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
               n.callMethod.apply(n,arguments):n.queue.push(arguments)};
               if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
               n.queue=[];t=b.createElement(e);t.async=!0;
               t.src=v;s=b.getElementsByTagName(e)[0];
               s.parentNode.insertBefore(t,s)}(window, document,'script',
               'https://connect.facebook.net/en_US/fbevents.js');
               fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
               fbq('track', 'PageView');
             `}
           </Script>
           <noscript>
             <img
               height="1"
               width="1"
               style={{ display: 'none' }}
               src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
             />
           </noscript>
         </head>
         <body>{children}</body>
       </html>
     );
   }
   ```

3. **Add to .env.local:**
   ```bash
   NEXT_PUBLIC_META_PIXEL_ID=YOUR_PIXEL_ID
   ```

4. **Track E-commerce Events:**

   ```typescript
   // lib/metaPixel.ts
   declare global {
     interface Window {
       fbq: any;
     }
   }
   
   export const metaPixelTrack = (event: string, data?: any) => {
     if (typeof window !== 'undefined' && window.fbq) {
       window.fbq('track', event, data);
     }
   };
   
   export const trackMetaPurchase = (orderData: any) => {
     metaPixelTrack('Purchase', {
       value: orderData.total,
       currency: 'AED',
       contents: orderData.items.map((item: any) => ({
         id: item.id,
         quantity: item.quantity,
       })),
       content_type: 'product',
     });
   };
   
   export const trackMetaAddToCart = (product: any) => {
     metaPixelTrack('AddToCart', {
       value: product.price,
       currency: 'AED',
       content_ids: [product.id],
       content_type: 'product',
     });
   };
   
   export const trackMetaInitiateCheckout = (cartData: any) => {
     metaPixelTrack('InitiateCheckout', {
       value: cartData.total,
       currency: 'AED',
       contents: cartData.items,
       content_type: 'product',
     });
   };
   ```

5. **Use in Components:**

   ```typescript
   // components/cart/CartItem.tsx
   import { trackMetaAddToCart } from '@/lib/metaPixel';
   
   const handleAddToCart = () => {
     addToCart(product);
     trackMetaAddToCart(product);
   };
   ```

---

## Implementation Strategy

### Recommended Setup for Peptive Peptides:

#### Phase 1: Core Emails (Week 1)
✅ **Already Working:**
- Stripe payments ✓
- WooCommerce order creation ✓

**Add Now:**
1. Install WP Mail SMTP plugin
2. Configure SendGrid SMTP
3. Enable WooCommerce emails
4. Test order flow

**Time:** 30 minutes

---

#### Phase 2: Analytics & Tracking (Week 1)
1. Set up Meta Pixel (for Facebook ads)
2. Set up Google Analytics 4
3. Implement tracking code in Next.js
4. Test with Facebook Pixel Helper & GA Debug

**Time:** 2-3 hours

**Implementation:**

```typescript
// Create lib/tracking.ts with all tracking functions
// Update layout.tsx with Meta Pixel & GA4
// Add tracking to:
// - Add to cart buttons
// - Checkout initiation
// - Purchase completion
```

---

#### Phase 3: Klaviyo (Week 2-3)
1. Sign up for Klaviyo
2. Install WooCommerce extension
3. Set up core flows:
   - Order confirmation
   - Shipping notification
   - Abandoned cart
4. Disable duplicate WooCommerce emails

**Time:** 4-5 hours

---

### Quick Win: Just Use WooCommerce + SMTP

**If you want the simplest solution:**

```bash
# 1. Install SMTP Plugin
WordPress Admin → Plugins → Add New → "WP Mail SMTP"

# 2. Sign up for SendGrid (free)
sendgrid.com/free → Get API Key

# 3. Configure
WP Mail SMTP → Settings
- From Email: noreply@peptivepeptides.com
- Mailer: SendGrid
- API Key: [paste]

# 4. Test
Send test email

# Done! ✅
# All order emails now work automatically
```

**Emails that will work:**
- ✅ Order confirmation (customer)
- ✅ Processing order (customer)
- ✅ Shipped order (customer)
- ✅ New order (admin notification)

---

## Complete Tracking Implementation

### Create Centralized Tracking Library

```typescript
// lib/tracking.ts
// Google Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }: any) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Meta Pixel
export const metaEvent = (eventName: string, data?: any) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, data);
  }
};

// Combined E-commerce Tracking
export const trackPurchase = (orderData: any) => {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: orderData.id,
      value: orderData.total,
      currency: 'AED',
      items: orderData.items,
    });
  }
  
  // Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Purchase', {
      value: orderData.total,
      currency: 'AED',
      contents: orderData.items,
      content_type: 'product',
    });
  }
};

export const trackAddToCart = (product: any) => {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      currency: 'AED',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1,
      }],
    });
  }
  
  // Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'AddToCart', {
      value: product.price,
      currency: 'AED',
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
    });
  }
};

export const trackInitiateCheckout = (cartData: any) => {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'begin_checkout', {
      currency: 'AED',
      value: cartData.total,
      items: cartData.items,
    });
  }
  
  // Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', {
      value: cartData.total,
      currency: 'AED',
      contents: cartData.items,
      content_type: 'product',
    });
  }
};
```

---

## Environment Variables Summary

Add to `.env.local`:

```bash
# Email (if using custom SMTP from Next.js)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key

# Klaviyo (optional)
NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY=pk_xxxxx
KLAVIYO_PRIVATE_KEY=sk_xxxxx

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Meta Pixel
NEXT_PUBLIC_META_PIXEL_ID=YOUR_PIXEL_ID
```

---

## Testing Checklist

### Email Testing:
- [ ] Place test order
- [ ] Verify customer receives order confirmation
- [ ] Verify admin receives new order notification
- [ ] Mark order as completed
- [ ] Verify customer receives completion email

### Analytics Testing:
- [ ] Install Facebook Pixel Helper Chrome extension
- [ ] Add product to cart → verify "AddToCart" fires
- [ ] Go to checkout → verify "InitiateCheckout" fires
- [ ] Complete purchase → verify "Purchase" fires
- [ ] Check GA4 Real-time reports
- [ ] Check Meta Events Manager

---

## Costs Summary

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **WP Mail SMTP** | Free plugin | Pro: $49+/year (optional) |
| **SendGrid** | 100 emails/day | $15/mo for 40k emails |
| **Klaviyo** | 250 contacts | $20/mo for 500 contacts |
| **Google Analytics** | Free | Free (no limits) |
| **Meta Pixel** | Free | Free (tracking only) |

**Recommended Start:**
- WP Mail SMTP (free) + SendGrid (free tier) = **$0/month**
- Add Klaviyo later when you have 100+ customers

---

## FAQs

**Q: Will WooCommerce emails work even though my frontend is Next.js?**  
A: Yes! Emails are triggered by backend order creation (via Stripe webhook), not the frontend.

**Q: Do I need both GA4 and Meta Pixel?**  
A: Yes if running both Google and Meta ads. Use GA4 for site analytics, Meta Pixel for Facebook/Instagram retargeting.

**Q: Can Klaviyo replace WooCommerce emails?**  
A: Yes, Klaviyo can handle all transactional emails + marketing automation.

**Q: What about order tracking emails?**  
A: WooCommerce sends tracking emails when you add tracking info to orders. Plugins like "ShipStation" automate this.

---

## Next Steps

1. **Today:** Install WP Mail SMTP + configure SendGrid (30 min)
2. **This Week:** Add Meta Pixel & GA4 to Next.js (2 hours)
3. **Next Week:** Consider Klaviyo if you want advanced marketing (4 hours)

Need help implementing? Let me know which part to tackle first!
