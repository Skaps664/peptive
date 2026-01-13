# Peptive Peptides - Headless WooCommerce E-commerce

A modern, production-ready headless e-commerce platform built with **Next.js 14** (frontend) and **WooCommerce** (backend).

---

## 🎯 What This Is

This is a **complete headless WooCommerce architecture** where:

- **Next.js** handles the frontend (UI, UX, SEO, performance)
- **WooCommerce** manages the backend (products, cart, checkout, orders, payments)
- **WordPress** provides CMS capabilities (hero sections, banners, settings)

**Result**: The power and reliability of WooCommerce with the flexibility and performance of Next.js.

---

## ✨ Features

### ✅ Products
- Fetch from WooCommerce REST API
- Product listings with filtering
- Single product pages with variants
- Product reviews and ratings
- Related products
- Search functionality
- Categories and tags

### ✅ Cart & Checkout
- WooCommerce Store API integration
- Server-side cart management
- Session-based persistence
- Real-time tax calculation
- Dynamic shipping rates
- Coupon/discount codes
- Guest and user checkout
- Multiple payment gateways

### ✅ User Authentication
- JWT-based authentication
- User registration
- Login/logout
- Protected routes
- Account dashboard
- Order history
- Address management

### ✅ CMS Content
- WordPress REST API integration
- Hero sections (ACF)
- Banner management
- Global settings
- Media library access
- Custom post types

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update with your WordPress/WooCommerce credentials:

```env
NEXT_PUBLIC_WOOCOMMERCE_URL=http://localhost:3000
WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here
```

### 3️⃣ Configure WordPress

**⚠️ IMPORTANT:** WordPress configuration is required for full functionality.

Follow the step-by-step guide in **[START_HERE.md](START_HERE.md)** (takes ~15 minutes).

Quick checklist:
- [ ] Install JWT Authentication plugin
- [ ] Add CORS configuration
- [ ] Generate WooCommerce API keys
- [ ] (Optional) Set up ACF for CMS content

### 4️⃣ Run Development Server

```bash
npm run dev
```

Visit:
- **Frontend**: http://localhost:3001
- **API Test**: http://localhost:3001/api-test ← **Start here!**

---

## 📚 Documentation

| Document | Description | When to Read |
|----------|-------------|--------------|
| **[START_HERE.md](START_HERE.md)** | Quick start guide | 👈 **Read this first!** |
| **[HEADLESS_SETUP.md](HEADLESS_SETUP.md)** | Detailed WordPress setup | When configuring WordPress |
| **[IMPLEMENTATION_EXAMPLES.md](IMPLEMENTATION_EXAMPLES.md)** | Code examples | When building features |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System architecture | Understanding data flow |
| **[wordpress-config-snippets.php](wordpress-config-snippets.php)** | WordPress code | Copy to functions.php |

---

## 🔌 API Clients

Four ready-to-use API clients are included:

```typescript
// Products & Reviews
import { woocommerce } from '@/lib/woocommerce';
const products = await woocommerce.getProducts({ perPage: 12 });
const reviews = await woocommerce.getProductReviews(productId);

// Cart & Checkout
import { storeAPI } from '@/lib/store-api';
await storeAPI.addToCart(productId, quantity);
const cart = await storeAPI.getCart();
const order = await storeAPI.checkout(formData);

// User Authentication
import { authAPI } from '@/lib/auth';
await authAPI.login({ username, password });
const user = await authAPI.getCurrentUser();

// WordPress CMS
import { wordpress } from '@/lib/wordpress';
const hero = await wordpress.getHeroSection('home');
const banners = await wordpress.getBanners();
```

---

## 📂 Project Structure

```
peptivepeptides/
│
├── app/                          # Next.js pages
│   ├── page.tsx                 # Home page
│   ├── products/                # Product pages
│   │   ├── page.tsx            # Product listing
│   │   └── [slug]/page.tsx     # Product details
│   ├── cart/page.tsx            # Cart page
│   ├── checkout/page.tsx        # Checkout page
│   └── api-test/page.tsx        # 🧪 API testing page
│
├── components/                   # React components
│   ├── products/               # ProductCard, ProductGrid, etc.
│   ├── cart/                   # CartSidebar, CartItem
│   ├── layout/                 # Header, Footer
│   └── ui/                     # Button, Input, etc.
│
├── lib/                         # 🔌 API Clients
│   ├── woocommerce.ts          # WooCommerce REST API
│   ├── store-api.ts            # WooCommerce Store API (Cart)
│   ├── wordpress.ts            # WordPress CMS API
│   ├── auth.ts                 # JWT Authentication
│   └── utils.ts                # Utilities
│
├── store/                       # State Management
│   └── cartStore.ts            # Zustand cart store
│
├── types/                       # TypeScript Types
│   └── index.ts                # All types
│
└── Documentation/
    ├── START_HERE.md                  📖 Quick start
    ├── HEADLESS_SETUP.md              📖 WordPress setup
    ├── IMPLEMENTATION_EXAMPLES.md     📖 Code examples
    ├── ARCHITECTURE.md                📖 Architecture
    └── wordpress-config-snippets.php  📖 WP code
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS |
| **State** | Zustand |
| **API Client** | Axios |
| **Backend** | WordPress + WooCommerce |
| **Auth** | JWT (JSON Web Tokens) |
| **Database** | MySQL (via WordPress) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   Next.js Frontend (localhost:3001) │
│   • UI/UX                           │
│   • SEO                             │
│   • Performance                     │
└──────────────┬──────────────────────┘
               │ REST API
               ▼
┌──────────────────────────────────────┐
│ WordPress + WooCommerce (localhost:3000)│
│ • Products & Inventory              │
│ • Cart & Checkout                   │
│ • Orders & Payments                 │
│ • User Management                   │
│ • CMS Content                       │
└──────────────────────────────────────┘
```

**Benefits:**
- ✅ Best of both worlds: WooCommerce reliability + Next.js performance
- ✅ Scales independently (frontend CDN, backend API server)
- ✅ Full control over user experience
- ✅ WooCommerce handles complex e-commerce logic (tax, shipping, payments)

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for detailed diagrams.

---

## 🧪 Testing APIs

Visit the **API Test Page** to verify all connections:

```
http://localhost:3001/api-test
```

This page will:
- ✅ Test WooCommerce Products API
- ✅ Test Product Reviews
- ✅ Test WordPress CMS integration
- ⚠️ Guide you through Store API setup
- ⚠️ Guide you through JWT auth setup

**Green checkmarks = working!**  
**Yellow warnings = needs setup**  
**Red errors = configuration issue**

---

## 🛠️ Development Roadmap

### Phase 1: Products ✅ DONE
- [x] WooCommerce API integration
- [x] Product listing page
- [x] Product detail pages
- [x] Product reviews & ratings
- [x] TypeScript types

### Phase 2: Cart & Checkout 🔄 IN PROGRESS
- [ ] Migrate cart to Store API
- [ ] Implement checkout flow
- [ ] Test order creation
- [ ] Payment gateway integration

### Phase 3: Authentication 📋 PLANNED
- [ ] Login/register pages
- [ ] User dashboard
- [ ] Order history
- [ ] Address management

### Phase 4: CMS Content 📋 PLANNED
- [ ] Set up ACF fields
- [ ] Hero sections
- [ ] Banner management
- [ ] Country selector

---

## 🚀 Deployment

### Frontend → Vercel/Netlify

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy
```

Update environment variables on your hosting platform.

### Backend → WordPress Hosting

Deploy WordPress + WooCommerce to:
- **Managed WordPress**: WP Engine, Kinsta, Flywheel
- **VPS**: DigitalOcean, Linode, AWS EC2
- **Cloud**: Google Cloud, AWS Elastic Beanstalk

**Important:** Update CORS settings to allow your production domain.

---

## 🔒 Security Checklist

- [x] JWT authentication for user sessions
- [x] Environment variables for sensitive data
- [x] CORS properly configured
- [ ] HTTPS in production (required)
- [ ] Rate limiting on API endpoints
- [ ] WordPress security plugins
- [ ] Regular WooCommerce updates
- [ ] Strong passwords for WP admin

---

## 📈 Performance

**Current Optimizations:**
- ✅ Next.js Server Components (fast initial load)
- ✅ Static Generation for product pages
- ✅ Image optimization (next/image)
- ✅ Code splitting (automatic)

**Recommended for Production:**
- Redis caching for API responses
- CDN for WordPress media files
- Database query optimization
- Edge caching (Cloudflare)

---

## 🐛 Troubleshooting

### Products not loading?

1. Check `.env.local` has correct credentials
2. Verify WooCommerce API keys in WP admin
3. Test endpoint: `http://localhost:3000/wp-json/wc/v3/products`
4. Check console for error messages

### CORS errors?

1. Add CORS code to WordPress (see `wordpress-config-snippets.php`)
2. Update allowed origin to match your Next.js URL
3. Restart WordPress server
4. Clear browser cache

### Cart not working?

1. Ensure CORS is properly configured
2. Check cookies are enabled in browser
3. Verify `withCredentials: true` in store-api.ts
4. Test: `http://localhost:3000/wp-json/wc/store/v1/cart`

### JWT authentication failing?

1. Install "JWT Authentication for WP REST API" plugin
2. Add JWT_AUTH_SECRET_KEY to wp-config.php
3. Add Authorization header support to .htaccess
4. Test: `http://localhost:3000/wp-json/jwt-auth/v1/token`

**See [START_HERE.md](START_HERE.md) for detailed troubleshooting.**

---

## 📖 Learn More

### WooCommerce APIs
- [WooCommerce REST API Docs](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [WooCommerce Store API](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/src/StoreApi)

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

### WordPress
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [JWT Authentication Plugin](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)

---

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

If you find a bug or have a feature request, feel free to open an issue.

---

## 📄 License

MIT License - feel free to use this project as a template for your own e-commerce site.

---

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [WooCommerce](https://woocommerce.com/) - E-commerce platform
- [WordPress](https://wordpress.org/) - CMS
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

## 📞 Support & Documentation

- **🚀 Start Here**: [START_HERE.md](START_HERE.md)
- **🧪 Test APIs**: Visit `/api-test`
- **📖 Full Docs**: Check the documentation files listed above
- **🐛 Debugging**: Check browser console and WordPress debug.log

---

**Ready to build a modern, scalable e-commerce platform! 🚀**
