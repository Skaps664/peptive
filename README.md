# PeptivePeptides - Next.js E-commerce with WooCommerce

A modern, high-performance e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and WooCommerce as a headless CMS.

## 🚀 Features

- **Next.js 14 App Router** - Modern React framework with server components
- **TypeScript** - Type-safe codebase
- **Tailwind CSS** - Utility-first styling
- **WooCommerce Headless CMS** - Product management via WordPress + WooCommerce
- **Zustand State Management** - Lightweight cart state management
- **Responsive Design** - Mobile-first, fully responsive UI
- **Server-Side Rendering** - Fast page loads with SSR
- **Image Optimization** - Next.js Image component for optimized images

## 📋 Project Structure

```
peptivepeptides/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx             # Root layout with header/footer
│   ├── page.tsx               # Homepage
│   ├── products/              # Product pages
│   │   ├── page.tsx          # Product listing
│   │   └── [slug]/           # Dynamic product detail pages
│   ├── cart/                  # Shopping cart page
│   └── checkout/              # Checkout page
├── components/                # React components
│   ├── layout/               # Header, Footer
│   ├── products/             # Product cards, grids
│   ├── cart/                 # Cart sidebar and items
│   └── ui/                   # Reusable UI components
├── lib/                       # Utilities and API clients
│   ├── woocommerce.ts        # WooCommerce API client
│   └── utils.ts              # Helper functions
├── store/                     # State management
│   └── cartStore.ts          # Zustand cart store
├── types/                     # TypeScript types
│   └── index.ts              # Product, Cart, Order types
└── public/                    # Static assets
```

## 🛠️ Technology Stack

- **Framework:** Next.js 14+
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **CMS:** WooCommerce (WordPress)
- **API Client:** Axios
- **Image Handling:** Next.js Image

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd /home/skaps/freelance/peptivepeptides
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your WooCommerce credentials:
   ```env
   NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-wordpress-site.com
   WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
   WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here
   ```

## 🔧 WooCommerce Setup

### Prerequisites
- WordPress site with WooCommerce installed
- Products added to WooCommerce
- REST API enabled

### Getting API Credentials

1. Log in to your WordPress admin panel
2. Navigate to **WooCommerce > Settings > Advanced > REST API**
3. Click **Add Key**
4. Set permissions to **Read/Write**
5. Copy the **Consumer Key** and **Consumer Secret**
6. Add them to your `.env.local` file

### API Endpoints Used

- `GET /wp-json/wc/v3/products` - Fetch all products
- `GET /wp-json/wc/v3/products/{id}` - Fetch single product
- `GET /wp-json/wc/v3/products?slug={slug}` - Fetch product by slug

## 🚀 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 📱 Pages & Features

### Homepage (`/`)
- Hero banner with CTA
- Featured products section
- About section
- Responsive design

### Products Page (`/products`)
- Grid layout of all products
- Product cards with images, prices, ratings
- Filter options (placeholder for future enhancement)
- Add to cart functionality

### Product Detail Page (`/products/[slug]`)
- High-quality product images with thumbnail gallery
- Product information (name, price, description, stock)
- Customer ratings
- Quantity selector
- Add to cart button
- Related products section

### Shopping Cart (`/cart`)
- Cart items list with images
- Quantity adjustment
- Remove items
- Order summary with totals
- Proceed to checkout

### Checkout (`/checkout`)
- Billing information form
- Shipping information (with "same as billing" option)
- Order summary
- Payment section (placeholder for Stripe/PayPal integration)

### Cart Sidebar
- Slide-in cart overlay
- Quick view of cart items
- Subtotal calculation
- Links to cart and checkout

## 🎨 Customization

### Tailwind Theme

Edit `tailwind.config.ts` to customize colors, fonts, and spacing:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Customize your brand colors
        500: '#0ea5e9',
        600: '#0284c7',
        // ...
      },
    },
  },
}
```

### Component Styling

All components use Tailwind CSS classes. Modify classes in component files to change styling.

## 🔌 State Management

The cart uses Zustand for state management:

```typescript
// Add item to cart
const addItem = useCartStore((state) => state.addItem);
addItem({
  id: product.id,
  name: product.name,
  slug: product.slug,
  price: product.price,
  image: product.image,
});

// Get cart total
const subtotal = useCartStore((state) => state.getSubtotal());

// Clear cart
const clearCart = useCartStore((state) => state.clearCart);
clearCart();
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WOOCOMMERCE_URL` | Your WordPress site URL | Yes |
| `WOOCOMMERCE_CONSUMER_KEY` | WooCommerce REST API consumer key | Yes |
| `WOOCOMMERCE_CONSUMER_SECRET` | WooCommerce REST API consumer secret | Yes |

## 🚧 Future Enhancements

- [ ] User authentication (login/signup)
- [ ] Order history for logged-in users
- [ ] Product search functionality
- [ ] Product filtering by category, price, etc.
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Wishlist functionality
- [ ] Product reviews and ratings submission
- [ ] Coupon code support
- [ ] Email notifications
- [ ] Multi-currency support
- [ ] SEO optimizations with metadata

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and WooCommerce
