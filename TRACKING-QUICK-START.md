# Quick Implementation Guide

Follow these steps to add tracking to your site.

## Step 1: Add Environment Variables

Add to your `.env.local`:

```bash
# Google Analytics 4 (Optional - get from analytics.google.com)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Meta Pixel (Optional - get from business.facebook.com)
NEXT_PUBLIC_META_PIXEL_ID=YOUR_PIXEL_ID

# Klaviyo (Optional - get from klaviyo.com)
NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY=pk_xxxxx
KLAVIYO_PRIVATE_KEY=sk_xxxxx
```

## Step 2: Update Root Layout

Update `app/layout.tsx`:

```typescript
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MetaPixel from '@/components/analytics/MetaPixel';
import { usePageTracking } from '@/lib/useTracking';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <MetaPixel />
      </head>
      <body>
        <PageTracker />
        {children}
      </body>
    </html>
  );
}

// Track page views
function PageTracker() {
  usePageTracking();
  return null;
}
```

## Step 3: Add Tracking to Cart

Update `store/cartStore.ts`:

```typescript
import { trackAddToCart, trackRemoveFromCart } from '@/lib/tracking';

// In addItem function
addItem: (item) => {
  set((state) => ({
    items: [...state.items, item],
  }));
  
  // Track add to cart
  trackAddToCart({
    id: item.id,
    name: item.name,
    price: parseFloat(item.price),
    quantity: item.quantity,
  });
},

// In removeItem function  
removeItem: (id) => {
  const item = get().items.find(i => i.id === id);
  
  set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  }));
  
  // Track remove from cart
  if (item) {
    trackRemoveFromCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      quantity: item.quantity,
    });
  }
},
```

## Step 4: Track Checkout

Update `app/checkout/page.tsx`:

```typescript
import { trackInitiateCheckout } from '@/lib/tracking';
import { useEffect } from 'react';

// Add to component
useEffect(() => {
  const items = cartStore.items;
  const total = items.reduce((sum, item) => 
    sum + (parseFloat(item.price) * item.quantity), 0
  );
  
  trackInitiateCheckout(
    items.map(item => ({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      quantity: item.quantity,
    })),
    total
  );
}, []);
```

## Step 5: Track Purchase

Update `app/checkout/success/page.tsx`:

```typescript
import { trackPurchase } from '@/lib/tracking';
import { useEffect } from 'react';

// Add to component when order data is fetched
useEffect(() => {
  if (session && orderData) {
    trackPurchase({
      id: session.id,
      email: session.customer_email || '',
      total: session.amount_total! / 100,
      items: orderData.line_items.map((item: any) => ({
        id: item.product_id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
      })),
    });
  }
}, [session, orderData]);
```

## Step 6: Track Product Views (Optional)

Update `app/products/[slug]/page.tsx`:

```typescript
import { trackViewProduct } from '@/lib/tracking';

// Add after product is loaded
useEffect(() => {
  if (product) {
    trackViewProduct({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      category: product.categories?.[0]?.name,
    });
  }
}, [product]);
```

## Done! 🎉

Your site now tracks:
- ✅ Page views
- ✅ Product views
- ✅ Add to cart
- ✅ Remove from cart
- ✅ Checkout initiation
- ✅ Purchases

## Testing

1. **Meta Pixel:**
   - Install "Meta Pixel Helper" Chrome extension
   - Visit your site
   - Check that pixel fires on each action

2. **Google Analytics:**
   - Go to analytics.google.com
   - Click "Realtime" → "Overview"
   - Perform actions on your site
   - See events appear in real-time

## Email Setup (Separate)

See `HEADLESS-WOOCOMMERCE-AUTOMATION-GUIDE.md` for email automation setup.

Quick version:
1. Go to WordPress Admin
2. Install "WP Mail SMTP" plugin
3. Configure with SendGrid (free 100 emails/day)
4. Done! Order emails work automatically
