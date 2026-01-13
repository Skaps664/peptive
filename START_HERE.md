# 🚀 Quick Start: Headless WooCommerce Integration

## What You Just Got

Your Next.js project now has **complete headless WooCommerce integration** with:

✅ **4 API Clients** ready to use:
- `woocommerce` - Products, Reviews, Categories
- `wordpress` - CMS Content (Hero, Banners, Settings)
- `storeAPI` - Cart, Checkout, Shipping, Tax
- `authAPI` - User Authentication (JWT)

✅ **Complete TypeScript Types** for all entities

✅ **Production-Ready Architecture** following best practices

---

## 🎯 Your Architecture

```
┌─────────────────────────────────────┐
│   Next.js Frontend (localhost:3001) │
│   - Your existing pages ✓           │
│   - NEW: API integrations           │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ WordPress + WooCommerce (localhost:3000)│
│ ✓ Products                           │
│ ✓ Cart & Checkout                    │
│ ✓ User Accounts                      │
│ ✓ Orders & Payments                  │
│ ✓ CMS Content (Hero, Banners)        │
└──────────────────────────────────────┘
```

---

## 📝 Step-by-Step Setup (15 minutes)

### Step 1: WordPress Plugins (5 min)

Install these in WordPress Admin:

1. **JWT Authentication for WP REST API**
   ```
   Plugins > Add New > Search "JWT Authentication"
   ```

2. **Advanced Custom Fields** (Optional, for CMS content)
   ```
   Plugins > Add New > Search "Advanced Custom Fields"
   ```

3. **ACF to REST API** (If using ACF)
   ```
   Plugins > Add New > Search "ACF to REST API"
   ```

### Step 2: WordPress Configuration (5 min)

#### A. Edit `wp-config.php`

Add before `/* That's all, stop editing! */`:

```php
define('JWT_AUTH_SECRET_KEY', 'your-super-secret-jwt-key-change-this');
define('JWT_AUTH_CORS_ENABLE', true);
```

#### B. Add Code Snippets

Copy code from `wordpress-config-snippets.php` to:
- Your theme's `functions.php`, OR
- Create a custom plugin, OR
- Use "Code Snippets" plugin

**IMPORTANT:** Update this line in the CORS section:
```php
$allowed_origin = 'http://localhost:3001'; // Your Next.js URL
```

### Step 3: WooCommerce API Keys (2 min)

1. Go to: **WooCommerce > Settings > Advanced > REST API**
2. Click **Add Key**
3. Set:
   - Description: "Next.js Frontend"
   - User: (your admin user)
   - Permissions: **Read/Write**
4. Click **Generate API Key**
5. **Copy the keys!** You'll need them next.

### Step 4: Next.js Environment (1 min)

Update `.env.local` with your WordPress credentials:

```env
NEXT_PUBLIC_WOOCOMMERCE_URL=http://peptivepeptides.local
WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here
```

### Step 5: Test Everything (2 min)

```bash
npm run dev
```

Visit: **http://localhost:3001/api-test**

This page will test all your API connections and show you exactly what's working and what needs configuration.

---

## 🎨 How to Use in Your Code

### Fetch Products

```typescript
import { woocommerce } from '@/lib/woocommerce';

// In any Server Component
const products = await woocommerce.getProducts({ perPage: 12 });
const product = await woocommerce.getProductBySlug('my-product');
const reviews = await woocommerce.getProductReviews(productId);
```

### Cart Operations (Client-Side)

```typescript
'use client';
import { storeAPI } from '@/lib/store-api';

// Add to cart
await storeAPI.addToCart(productId, quantity);

// Get current cart
const cart = await storeAPI.getCart();

// Update item
await storeAPI.updateCartItem(itemKey, newQuantity);

// Apply coupon
await storeAPI.applyCoupon('SUMMER20');
```

### User Authentication

```typescript
'use client';
import { authAPI } from '@/lib/auth';

// Login
const result = await authAPI.login({
  username: 'john',
  password: 'password123'
});

// Check if logged in
if (authAPI.isLoggedIn()) {
  const user = await authAPI.getCurrentUser();
}

// Logout
authAPI.logout();
```

### CMS Content

```typescript
import { wordpress } from '@/lib/wordpress';

// Get hero section for home page
const hero = await wordpress.getHeroSection('home');

// Get banners
const banners = await wordpress.getBanners();

// Get global settings
const settings = await wordpress.getGlobalSettings();
```

---

## 📂 New Files You Have

```
lib/
├── woocommerce.ts      ✅ Products & Reviews API
├── wordpress.ts        ✅ CMS Content API
├── store-api.ts        ✅ Cart & Checkout API
└── auth.ts             ✅ User Authentication

types/index.ts          ✅ All TypeScript types

Documentation:
├── HEADLESS_SETUP.md              📖 Detailed setup guide
├── IMPLEMENTATION_EXAMPLES.md     📖 Code examples
├── wordpress-config-snippets.php  📖 WordPress code
└── THIS_FILE.md                   📖 Quick reference
```

---

## 🔄 Migration Path

### Current State
- ✅ Next.js pages built
- ✅ WooCommerce running locally
- ✅ Basic cart (Zustand + localStorage)

### Next Steps

#### Phase 1: Products (EASY - Start Here)
1. Replace mock data with real products:
   ```typescript
   // Before:
   const products = mockProducts;
   
   // After:
   const products = await woocommerce.getProducts();
   ```

2. Add product reviews to product pages

3. Use real product data everywhere

#### Phase 2: Cart (RECOMMENDED)
1. Migrate from local cart to Store API cart
2. See `IMPLEMENTATION_EXAMPLES.md` for complete code
3. Benefits:
   - ✅ Automatic tax calculation
   - ✅ Real-time shipping rates
   - ✅ Coupon support
   - ✅ Inventory management

#### Phase 3: Checkout (CRITICAL)
1. Connect checkout form to WooCommerce
2. Orders appear in WooCommerce admin
3. Payment gateway integration
4. Email notifications

#### Phase 4: Authentication (USER ACCOUNTS)
1. Add login/register pages
2. User account dashboard
3. Order history
4. Address management

#### Phase 5: CMS Content (NICE TO HAVE)
1. Set up ACF fields
2. Manage hero sections from WordPress
3. Dynamic banners
4. Global settings

---

## 🎯 What Works Right Now

✅ **Fetch Products** - Use `woocommerce.getProducts()`  
✅ **Single Product** - Use `woocommerce.getProductBySlug()`  
✅ **Product Reviews** - Use `woocommerce.getProductReviews()`  
✅ **TypeScript Types** - Full type safety  

---

## ⚠️ What Needs WordPress Setup

⏳ **Cart API** - Requires CORS configuration  
⏳ **Checkout** - Requires Cart API working  
⏳ **Authentication** - Requires JWT plugin  
⏳ **CMS Content** - Requires ACF plugin (optional)  

---

## 🐛 Common Issues

### "Products not loading"
- Check `.env.local` has correct URL
- Verify API keys in WooCommerce settings
- Test: `http://localhost:3000/wp-json/wc/v3/products`

### "CORS errors"
- Add CORS code to WordPress (see `wordpress-config-snippets.php`)
- Restart WordPress server
- Check allowed origin matches your Next.js URL

### "Cart returns null"
- CORS must be working first
- Check `withCredentials: true` in store-api.ts (already set)
- Clear browser cookies and try again

### "JWT token invalid"
- Install JWT plugin
- Add JWT_AUTH_SECRET_KEY to wp-config.php
- Restart WordPress

---

## 📚 Documentation Reference

| Topic | File |
|-------|------|
| Setup instructions | `HEADLESS_SETUP.md` |
| Code examples | `IMPLEMENTATION_EXAMPLES.md` |
| WordPress code | `wordpress-config-snippets.php` |
| Test APIs | Visit `/api-test` page |

---

## 🎓 Learning Path

### Day 1: Products
- Get products displaying from WooCommerce
- Add reviews to product pages
- Test with your real products

### Day 2: Cart
- Migrate to Store API cart
- Test add to cart, update quantity, remove
- Verify tax/shipping calculations

### Day 3: Checkout
- Build checkout form
- Connect to WooCommerce orders
- Test full purchase flow

### Day 4: Authentication
- Add login/register pages
- User dashboard
- Order history

### Day 5: CMS & Polish
- Set up ACF fields
- Hero sections
- Banners
- Final testing

---

## 🚀 Production Checklist

Before going live:

- [ ] Update CORS to allow production domain
- [ ] Use HTTPS for all API calls
- [ ] Secure JWT secret key
- [ ] Enable rate limiting
- [ ] Set up caching (Redis recommended)
- [ ] Configure payment gateways
- [ ] Test checkout flow end-to-end
- [ ] Set up order email notifications
- [ ] Configure shipping zones
- [ ] Add proper error handling
- [ ] Enable WooCommerce webhooks
- [ ] Set up monitoring/logging

---

## 💡 Pro Tips

1. **Start Simple**: Get products working first, then cart, then checkout
2. **Test Early**: Use `/api-test` page to verify each integration
3. **Read Errors**: API errors in console tell you exactly what's wrong
4. **Use Types**: TypeScript will guide you - trust the autocomplete
5. **Cache Smart**: Products change rarely, cache them (Next.js does this by default in Server Components)

---

## 🆘 Need Help?

1. Check `/api-test` page for diagnostics
2. Read detailed docs in `HEADLESS_SETUP.md`
3. See code examples in `IMPLEMENTATION_EXAMPLES.md`
4. Check WordPress logs: `wp-content/debug.log`
5. Check Next.js console for API errors

---

## ✨ You're Ready!

Everything is set up. Now it's just a matter of:
1. Configure WordPress (15 min)
2. Test at `/api-test`
3. Start integrating into your pages

**Good luck! You're building a modern, scalable e-commerce platform.** 🚀
