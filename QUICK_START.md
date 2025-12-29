# Quick Start Guide - PeptivePeptides E-commerce

## ✅ Project Successfully Initialized!

Your Next.js e-commerce site with WooCommerce headless CMS is ready to go.

## 🚀 Next Steps

### 1. Configure WooCommerce API Credentials

Edit `.env.local` with your actual WooCommerce site credentials:

```bash
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-wordpress-site.com
WOOCOMMERCE_CONSUMER_KEY=ck_your_actual_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=cs_your_actual_consumer_secret
```

**How to get WooCommerce API credentials:**
1. Log in to your WordPress admin
2. Go to **WooCommerce → Settings → Advanced → REST API**
3. Click **Add Key**
4. Set permissions to **Read/Write**
5. Copy the Consumer Key and Consumer Secret

### 2. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.

### 3. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
peptivepeptides/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Homepage
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart
│   └── checkout/          # Checkout flow
├── components/            # React components
│   ├── layout/           # Header, Footer
│   ├── products/         # Product cards, grids
│   ├── cart/             # Cart sidebar, items
│   └── ui/               # Buttons, Inputs
├── lib/                  # Utilities
│   ├── woocommerce.ts   # WooCommerce API client
│   └── utils.ts         # Helper functions
├── store/               # State management
│   └── cartStore.ts    # Zustand cart store
└── types/              # TypeScript types
    └── index.ts       # Product, Cart types
```

## 🎨 Features Implemented

### ✅ Core Features
- [x] Next.js 14 with App Router
- [x] TypeScript for type safety
- [x] Tailwind CSS for styling
- [x] WooCommerce headless CMS integration
- [x] Zustand for cart state management

### ✅ Pages & Components
- [x] Homepage with hero banner and featured products
- [x] Product listing page with grid layout
- [x] Product detail pages with image gallery
- [x] Shopping cart page
- [x] Cart sidebar/modal
- [x] Checkout page with billing/shipping forms
- [x] Responsive header with mobile menu
- [x] Footer with links and social media

### ✅ E-commerce Functionality
- [x] Add to cart
- [x] Remove from cart
- [x] Update quantities
- [x] Cart persistence (localStorage)
- [x] Price calculations
- [x] Stock status display
- [x] Product ratings
- [x] Related products

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📋 WooCommerce API Endpoints Used

- `GET /wp-json/wc/v3/products` - Fetch products
- `GET /wp-json/wc/v3/products?slug={slug}` - Fetch product by slug
- `GET /wp-json/wc/v3/products?include={ids}` - Fetch products by IDs
- `GET /wp-json/wc/v3/products?featured=true` - Fetch featured products

## 🎯 Customization Tips

### Change Brand Colors

Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR',
        600: '#YOUR_DARKER_COLOR',
        // ...
      },
    },
  },
}
```

### Modify Homepage Hero

Edit `app/page.tsx` - update the hero section text and styling.

### Add Custom Components

Create components in `components/` directory and import them in your pages.

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_WOOCOMMERCE_URL` | Yes | Your WordPress site URL |
| `WOOCOMMERCE_CONSUMER_KEY` | Yes | WooCommerce API consumer key |
| `WOOCOMMERCE_CONSUMER_SECRET` | Yes | WooCommerce API consumer secret |

## 🚧 Future Enhancements to Consider

- [ ] User authentication (login/signup)
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Product search
- [ ] Category filtering
- [ ] Product reviews
- [ ] Wishlist
- [ ] Order history
- [ ] Email notifications
- [ ] Coupon codes
- [ ] Multi-currency support

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

## ❓ Troubleshooting

### Build Errors about WooCommerce
Make sure `.env.local` exists with valid credentials.

### Products Not Showing
1. Verify WooCommerce is installed on your WordPress site
2. Check API credentials are correct
3. Ensure products exist in WooCommerce
4. Verify CORS settings allow your Next.js domain

### Cart Not Persisting
Clear browser localStorage and try again. Make sure you're using a client component for cart interactions.

## 🎉 You're All Set!

Your professional e-commerce platform is ready. Configure your WooCommerce credentials and start selling!

For questions or issues, refer to the main README.md file.

---

Built with ❤️ using Next.js 14, TypeScript, and WooCommerce
