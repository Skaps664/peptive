# ✅ Implementation Checklist

Use this checklist to track your headless WooCommerce setup progress.

---

## 📦 Initial Setup

### WordPress & WooCommerce
- [ ] WordPress installed and running (http://localhost:3000)
- [ ] WooCommerce plugin activated
- [ ] Sample products added (at least 3-5 for testing)
- [ ] Product images uploaded
- [ ] Product categories created

### Next.js Project
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file created
- [ ] Development server runs (`npm run dev`)
- [ ] No TypeScript errors

---

## 🔌 API Configuration

### WooCommerce REST API
- [ ] WooCommerce API keys generated
  - Go to: WooCommerce > Settings > Advanced > REST API
  - Add Key with "Read/Write" permissions
- [ ] Consumer Key added to `.env.local`
- [ ] Consumer Secret added to `.env.local`
- [ ] Test endpoint works: `http://localhost:3000/wp-json/wc/v3/products`

### WordPress Plugins
- [ ] JWT Authentication for WP REST API installed
- [ ] ACF (Advanced Custom Fields) installed (optional)
- [ ] ACF to REST API installed (if using ACF)

### WordPress Configuration
- [ ] JWT_AUTH_SECRET_KEY added to `wp-config.php`
- [ ] JWT_AUTH_CORS_ENABLE set to true in `wp-config.php`
- [ ] Authorization header enabled in `.htaccess`
- [ ] CORS code added to `functions.php`
  - See: `wordpress-config-snippets.php`
  - Update allowed origin to match Next.js URL
- [ ] WordPress server restarted

---

## 🧪 Testing

### API Test Page
- [ ] Visit: http://localhost:3001/api-test
- [ ] ✅ WooCommerce Products API working
- [ ] ✅ Product Reviews API working
- [ ] ✅ WordPress CMS API working (if using ACF)
- [ ] ⚠️ Store API responds (cookies enabled)
- [ ] ⚠️ JWT endpoint responds

### Manual API Tests
Test these endpoints in browser or Postman:

#### Products
- [ ] GET `http://localhost:3000/wp-json/wc/v3/products`
  - Should return array of products

#### Store API
- [ ] GET `http://localhost:3000/wp-json/wc/store/v1/cart`
  - Should return cart object (may be empty)

#### JWT Auth
- [ ] POST `http://localhost:3000/wp-json/jwt-auth/v1/token`
  - Body: `{ "username": "admin", "password": "password" }`
  - Should return token

#### WordPress
- [ ] GET `http://localhost:3000/wp-json/wp/v2/pages`
  - Should return array of pages

---

## 🛍️ Products Integration

### Basic Product Display
- [ ] Products fetch from WooCommerce
- [ ] Product listing page shows real products
- [ ] Product images display correctly
- [ ] Product prices display correctly
- [ ] Product categories work
- [ ] Click product → goes to detail page

### Product Detail Page
- [ ] Single product loads by slug
- [ ] All product info displays (name, price, description)
- [ ] Product images show (main + gallery)
- [ ] Product categories display
- [ ] Stock status shows
- [ ] Rating displays (if reviews exist)

### Product Reviews
- [ ] Reviews fetch for product
- [ ] Reviews display on product page
- [ ] Rating count shows
- [ ] Verified badge shows for verified purchases

---

## 🛒 Cart Integration

### Current Cart (Zustand)
- [ ] Add to cart works
- [ ] Cart sidebar opens
- [ ] Item count updates
- [ ] Quantity update works
- [ ] Remove item works
- [ ] Subtotal calculates correctly
- [ ] Cart persists in localStorage

### Migration to Store API (Recommended)
- [ ] Store API cart fetches successfully
- [ ] Add to cart via Store API works
- [ ] Cart updates automatically
- [ ] Tax calculates (if configured in WooCommerce)
- [ ] Shipping rates show (if configured)
- [ ] Coupons can be applied
- [ ] Session persists across page reloads

---

## 💳 Checkout Integration

### Checkout Form
- [ ] Checkout page loads
- [ ] Form fields render
- [ ] Billing address fields work
- [ ] Shipping address toggle works
- [ ] Email validation works
- [ ] Phone validation works

### Order Creation
- [ ] Checkout submission works
- [ ] Order created in WooCommerce admin
- [ ] Order status is correct
- [ ] Customer receives email
- [ ] Order confirmation page shows
- [ ] Cart clears after order

### Payment Integration
- [ ] Payment method selector works
- [ ] Default payment (COD) works
- [ ] (Optional) Stripe integration
- [ ] (Optional) PayPal integration
- [ ] Payment confirmation works

---

## 🔐 Authentication

### JWT Setup
- [ ] JWT plugin installed
- [ ] Secret key configured
- [ ] Login endpoint works
- [ ] Token generation works
- [ ] Token validation works

### User Registration
- [ ] Registration form works
- [ ] New user created in WordPress
- [ ] Validation works (email, password)
- [ ] Error messages show
- [ ] Success redirect works

### User Login
- [ ] Login form works
- [ ] Token stored in localStorage
- [ ] User data fetches
- [ ] Protected routes work
- [ ] Logout works
- [ ] Token clears on logout

### User Dashboard
- [ ] Account page loads
- [ ] User info displays
- [ ] Order history shows
- [ ] Addresses display
- [ ] Profile update works

---

## 🎨 CMS Content

### ACF Setup (Optional)
- [ ] ACF plugin installed
- [ ] Hero section field group created
- [ ] Fields added (title, subtitle, image, CTA)
- [ ] Fields assigned to pages
- [ ] ACF to REST API plugin installed

### Hero Sections
- [ ] Hero data fetches from WordPress
- [ ] Hero displays on home page
- [ ] Hero image shows
- [ ] Hero CTA works
- [ ] Hero editable in WP admin

### Banners
- [ ] Banners custom post type created
- [ ] Banner fields created (ACF)
- [ ] Banners fetch via API
- [ ] Banners display on site
- [ ] Banner priority/order works
- [ ] Device targeting works (mobile/desktop)

### Global Settings
- [ ] ACF options page created
- [ ] Settings fields created
- [ ] Settings fetch via API
- [ ] Country selector uses settings
- [ ] Currency uses settings

---

## 🚀 Production Readiness

### Environment
- [ ] Production environment variables set
- [ ] HTTPS enabled
- [ ] Domain configured
- [ ] CORS updated for production domain
- [ ] JWT secret is strong and secret

### Security
- [ ] WordPress security plugin installed
- [ ] Rate limiting configured
- [ ] Strong admin passwords
- [ ] File permissions correct
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] API keys secured

### Performance
- [ ] Product caching enabled
- [ ] Redis configured (optional)
- [ ] CDN set up for images
- [ ] Database optimized
- [ ] Gzip compression enabled
- [ ] Browser caching configured

### Testing
- [ ] Full purchase flow tested
- [ ] Guest checkout tested
- [ ] User checkout tested
- [ ] Payment processing tested
- [ ] Email notifications tested
- [ ] Mobile responsiveness tested
- [ ] Cross-browser tested

### Monitoring
- [ ] Error tracking (Sentry, etc.)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Order notifications working

---

## 📊 Feature Completion

Track your overall progress:

| Category | Status | Progress |
|----------|--------|----------|
| **Setup** | 🟢 🟢 🟢 ⚪ ⚪ | 60% |
| **Products** | 🟢 🟢 🟢 🟢 ⚪ | 80% |
| **Cart** | 🟢 🟢 🟢 ⚪ ⚪ | 60% |
| **Checkout** | 🟢 🟢 ⚪ ⚪ ⚪ | 40% |
| **Auth** | 🟢 ⚪ ⚪ ⚪ ⚪ | 20% |
| **CMS** | 🟢 ⚪ ⚪ ⚪ ⚪ | 20% |
| **Production** | ⚪ ⚪ ⚪ ⚪ ⚪ | 0% |

**Legend:**
- 🟢 Complete
- 🟡 In Progress
- ⚪ Not Started

---

## 🎯 Quick Wins (Start Here)

If you're just getting started, tackle these in order:

1. **✅ Basic Setup** (30 min)
   - Install WordPress plugins
   - Generate API keys
   - Configure `.env.local`
   - Test `/api-test` page

2. **✅ Products Display** (1 hour)
   - Show products on home page
   - Make product links work
   - Display product details
   - Add reviews section

3. **✅ Cart Functionality** (2 hours)
   - Migrate to Store API
   - Test add to cart
   - Test quantity updates
   - Test remove items

4. **✅ Checkout Flow** (3 hours)
   - Build checkout form
   - Connect to Store API
   - Test order creation
   - Verify emails work

5. **✅ User Accounts** (2 hours)
   - Add login page
   - Add registration
   - Create account dashboard
   - Show order history

---

## 🆘 Common Issues Checklist

Having problems? Check these:

### Products not showing
- [ ] API credentials correct in `.env.local`
- [ ] Products exist in WooCommerce
- [ ] Products are published (not draft)
- [ ] Next.js server restarted after `.env` change

### CORS errors
- [ ] CORS code added to WordPress
- [ ] Allowed origin matches Next.js URL exactly
- [ ] WordPress server restarted
- [ ] Browser cache cleared

### Cart not persisting
- [ ] Cookies enabled in browser
- [ ] `withCredentials: true` in API client
- [ ] CORS configured correctly
- [ ] No ad blockers interfering

### JWT not working
- [ ] JWT plugin installed and activated
- [ ] Secret key in both wp-config.php AND .env.local
- [ ] Secret keys match exactly
- [ ] .htaccess has Authorization header

### Build errors
- [ ] All dependencies installed
- [ ] TypeScript errors fixed
- [ ] Environment variables set
- [ ] Node version 18+ being used

---

## 📝 Notes & Custom Tasks

Add your own tasks here:

- [ ] 
- [ ] 
- [ ] 
- [ ] 
- [ ] 

---

**Update this checklist as you progress through your implementation!**
