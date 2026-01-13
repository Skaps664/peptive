# Headless WooCommerce + Next.js Setup Guide

## 🎯 Architecture Overview

```
Next.js Frontend (Port 3001)
    ↓
    ├─ WooCommerce REST API (Products, Reviews)
    ├─ WooCommerce Store API (Cart, Checkout)
    ├─ WordPress REST API (CMS Content)
    └─ JWT Auth API (User Authentication)
    ↓
WordPress + WooCommerce Backend (Port 3000)
```

## 📋 Prerequisites

- ✅ WordPress installed locally (http://localhost:3000)
- ✅ WooCommerce plugin activated
- ✅ Next.js project set up
- ✅ Products added in WooCommerce admin

---

## 🔧 WordPress Configuration

### Step 1: Install Required WordPress Plugins

Install these plugins in your WordPress admin:

1. **JWT Authentication for WP REST API**

   - Download: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
   - Or via WP Admin: Plugins > Add New > Search "JWT Authentication"
2. **Advanced Custom Fields (ACF)** _(Recommended for CMS content)_

   - Download: https://wordpress.org/plugins/advanced-custom-fields/
   - For hero sections, banners, and global settings
3. **ACF to REST API** _(If using ACF)_

   - Download: https://wordpress.org/plugins/acf-to-rest-api/
   - Exposes ACF fields to REST API

### Step 2: Configure JWT Authentication

Add these lines to your `wp-config.php` (before "That's all, stop editing!"):

```php
// JWT Authentication Configuration
define('JWT_AUTH_SECRET_KEY', 'your-super-secret-jwt-key-change-this');
define('JWT_AUTH_CORS_ENABLE', true);
```

Add this to your `.htaccess` file (if not already present):

```apache
# Enable Authorization Header
RewriteEngine on
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
```

### Step 3: Enable WooCommerce REST API

1. Go to **WooCommerce > Settings > Advanced > REST API**
2. Click **Add Key**
3. Set:
   - Description: "Next.js Frontend"
   - User: Your admin user
   - Permissions: **Read/Write**
4. Click **Generate API Key**
5. Copy the **Consumer Key** and **Consumer Secret** (you'll need these!)

### Step 4: Configure WooCommerce Store API

The Store API is enabled by default in WooCommerce 5.0+. To verify:

1. Visit: `http://localhost:3000/wp-json/wc/store/v1`
2. You should see a JSON response

### Step 5: Enable CORS (Cross-Origin Resource Sharing)

Add this to your theme's `functions.php` or create a custom plugin:

```php
<?php
// Enable CORS for headless setup
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: http://localhost:3001');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
        return $value;
    });
}, 15);
```

**Important:** Update `http://localhost:3001` to your actual Next.js URL.

---

## 🎨 Setting Up CMS Content (Optional)

### Create Hero Section Fields with ACF

1. Go to **Custom Fields > Add New**
2. Title: "Hero Section"
3. Add these fields:
   - `hero_title` (Text)
   - `hero_subtitle` (Text)
   - `hero_image` (Image)
   - `hero_cta_text` (Text)
   - `hero_cta_link` (URL)
4. Location Rules: **Post Type is equal to Page**
5. Publish

### Create Banners Custom Post Type

Add this to your `functions.php`:

```php
<?php
// Register Banners Custom Post Type
function register_banners_post_type() {
    register_post_type('banners', array(
        'labels' => array(
            'name' => 'Banners',
            'singular_name' => 'Banner'
        ),
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'page-attributes'),
        'menu_icon' => 'dashicons-images-alt2'
    ));
}
add_action('init', 'register_banners_post_type');
```

### Create Global Settings with ACF Options Page

Add this to your `functions.php`:

```php
<?php
// Create ACF Options Page
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' => 'Global Settings',
        'menu_title' => 'Global Settings',
        'menu_slug' => 'global-settings',
        'capability' => 'edit_posts',
        'redirect' => false
    ));
}
```

Then create ACF fields for:

- `supported_countries` (Repeater)
- `default_country` (Text)
- `currency_symbol` (Text)
- `tax_enabled` (True/False)

---

## 🚀 Next.js Configuration

### Step 1: Install Dependencies

```bash
npm install axios zustand
```

### Step 2: Update Environment Variables

Your `.env.local` should have:

```env
NEXT_PUBLIC_WOOCOMMERCE_URL=http://localhost:3000
WOOCOMMERCE_CONSUMER_KEY=ck_your_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_secret_here
NEXT_PUBLIC_JWT_SECRET=your-super-secret-jwt-key-change-this
```

**Important:** Make sure these match your WordPress configuration!

### Step 3: Test the APIs

You can test your API setup by creating a test page:

```typescript
// app/test-api/page.tsx
import { woocommerce } from '@/lib/woocommerce';
import { wordpress } from '@/lib/wordpress';
import { storeAPI } from '@/lib/store-api';

export default async function TestAPIPage() {
  const products = await woocommerce.getProducts({ perPage: 5 });
  const heroSection = await wordpress.getHeroSection('home');
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
    
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Products</h2>
        <pre>{JSON.stringify(products, null, 2)}</pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Hero Section</h2>
        <pre>{JSON.stringify(heroSection, null, 2)}</pre>
      </section>
    </div>
  );
}
```

---

## 🛒 Migrating to Store API Cart

Your current cart uses local storage (Zustand). To migrate to WooCommerce Store API:

### Option A: Hybrid Approach (Recommended)

- Keep Zustand for UI state (isOpen, quick actions)
- Sync with Store API for actual cart data
- Best of both worlds

### Option B: Full Store API

- All cart operations go through Store API
- No local state
- Better for tax/shipping calculations

**We'll implement Option A in the next step.**

---

## 🔐 Authentication Flow

1. **User Registration:**

   ```typescript
   import { authAPI } from '@/lib/auth';
   const result = await authAPI.register({
     username: 'john',
     email: 'john@example.com',
     password: 'password123'
   });
   ```
2. **User Login:**

   ```typescript
   const result = await authAPI.login({
     username: 'john',
     password: 'password123'
   });
   // Token stored in localStorage automatically
   ```
3. **Protected Routes:**

   ```typescript
   const isLoggedIn = authAPI.isLoggedIn();
   if (!isLoggedIn) {
     redirect('/login');
   }
   ```

---

## 🎯 Next Steps

1. ✅ Test all API endpoints
2. ✅ Create sample products in WooCommerce
3. ✅ Add hero section fields to your Home page
4. 🔄 Migrate cart to Store API (see next file)
5. 🔄 Implement checkout flow
6. 🔄 Add user authentication UI

---

## 🐛 Troubleshooting

### CORS Errors

- Make sure CORS is enabled in WordPress (see Step 5 above)
- Check that `withCredentials: true` is set in Store API client

### JWT Token Not Working

- Verify `JWT_AUTH_SECRET_KEY` matches in both wp-config.php and .env.local
- Check .htaccess has Authorization header enabled
- Test endpoint: `http://localhost:3000/wp-json/jwt-auth/v1/token`

### Store API Returns Empty Cart

- Make sure cookies are enabled
- Check `withCredentials: true` in axios config
- Try clearing browser cookies

### Products Not Showing

- Verify REST API credentials are correct
- Check products are published in WooCommerce
- Test endpoint: `http://localhost:3000/wp-json/wc/v3/products`

---

## 📚 API Reference

All API clients are now available:

```typescript
import { woocommerce } from '@/lib/woocommerce';  // Products, Reviews
import { wordpress } from '@/lib/wordpress';      // CMS Content
import { storeAPI } from '@/lib/store-api';       // Cart, Checkout
import { authAPI } from '@/lib/auth';             // Authentication
```

**See each file for detailed method documentation.**
