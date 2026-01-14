# 🚀 Hostinger WordPress Backend Setup Guide

## Complete guide to set up a fresh WordPress backend on Hostinger for your Next.js Peptive frontend

---

## 📋 **OVERVIEW**

You're creating a **NEW** WordPress backend on Hostinger (not migrating from localhost). This will serve as the headless CMS and WooCommerce API for your Next.js frontend currently at `https://peptive.vercel.app/`.

**Current Setup:**
- ✅ Next.js Frontend: `https://peptive.vercel.app/` (Vercel)
- ❌ WordPress Backend: `http://peptivepeptides.local` (localhost - will be replaced)
- 🎯 New WordPress Backend: Your Hostinger domain (e.g., `https://yourdomain.com`)

---

## 🎯 **PHASE 1: WORDPRESS INSTALLATION ON HOSTINGER**

### Step 1: Install Fresh WordPress

1. **Upload WordPress via Hostinger Panel:**
   - Extract the full WordPress zip file
   - Upload ALL files to your domain's public_html folder:
     - `wp-admin/`
     - `wp-content/`
     - `wp-includes/`
     - `wp-config-sample.php`
     - `index.php`
     - `.htaccess`
     - All other root files

2. **OR Use Hostinger's Auto-Installer:**
   - Go to Hostinger Control Panel
   - Find "Auto Installer" or "WordPress"
   - Install WordPress (much easier!)

### Step 2: Database Configuration

Hostinger will provide you with:
- **Database Name:** (e.g., `u123456789_peptive`)
- **Database Username:** (e.g., `u123456789_admin`)
- **Database Password:** (your password)
- **Database Host:** `localhost` or an IP address

**Update `wp-config.php`:**
```php
/** The name of the database for WordPress */
define( 'DB_NAME', 'u123456789_peptive' );

/** Database username */
define( 'DB_USER', 'u123456789_admin' );

/** Database password */
define( 'DB_PASSWORD', 'your-database-password' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );
```

### Step 3: WordPress Initial Setup

1. Visit your domain: `https://yourdomain.com`
2. Complete the 5-minute WordPress installation:
   - Site Title: **Peptive Peptides**
   - Username: (choose admin username)
   - Password: (strong password)
   - Email: your email
   - ✅ Discourage search engines (for development)

---

## 🔌 **PHASE 2: INSTALL REQUIRED PLUGINS**

### Essential Plugins (Install in this order):

#### 1. **WooCommerce** 
- Purpose: E-commerce functionality, products, orders
- Install: WordPress Admin → Plugins → Add New → Search "WooCommerce"
- Setup Wizard: 
  - Skip store details (you'll configure manually)
  - Currency: USD or your currency
  - Payment methods: Configure later

#### 2. **JWT Authentication for WP REST API**
- Purpose: User login/authentication for Next.js
- Install: Search "JWT Authentication for WP REST API"
- Plugin URL: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
- **No configuration needed in dashboard** (we'll configure in wp-config.php)

#### 3. **Advanced Custom Fields (ACF) PRO** ⭐
- Purpose: Custom fields for hero sections, banners, global settings
- Install: Upload ACF PRO plugin zip OR use free version from plugin directory
- **This is CRITICAL** - your app fetches ACF data for homepage hero, banners, etc.

#### 4. **ACF to REST API**
- Purpose: Expose ACF fields to REST API
- Install: Search "ACF to REST API"
- Plugin URL: https://wordpress.org/plugins/acf-to-rest-api/
- **Activate immediately after ACF**

#### 5. **WooCommerce Store API** (Built into WooCommerce)
- Should be enabled by default in WooCommerce
- Check: WooCommerce → Settings → Advanced → REST API

---

## 📝 **PHASE 3: WP-CONFIG.PHP CONFIGURATION**

**IMPORTANT:** Add these lines to `wp-config.php` BEFORE `/* That's all, stop editing! Happy publishing. */`

```php
// ==================== JWT AUTHENTICATION ====================
define('JWT_AUTH_SECRET_KEY', 'YOUR-SUPER-SECRET-KEY-HERE-MAKE-IT-LONG-AND-RANDOM');
define('JWT_AUTH_CORS_ENABLE', true);

// Generate a secure key here: https://api.wordpress.org/secret-key/1.1/salt/
// Example: define('JWT_AUTH_SECRET_KEY', 'Gk$9mP#xL2wQ!vR8nH@jF5zT&cY7uB*eN4dA%sW6');

// ==================== DEBUGGING (Development Only) ====================
// Enable for development, DISABLE in production
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
@ini_set('display_errors', 0);

// ==================== SECURITY ====================
// Disable file editing in WordPress admin (recommended)
define('DISALLOW_FILE_EDIT', true);

// ==================== MEMORY LIMITS ====================
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');
```

**⚠️ CRITICAL:** Replace `'YOUR-SUPER-SECRET-KEY-HERE-MAKE-IT-LONG-AND-RANDOM'` with an actual secure key!

---

## 🌐 **PHASE 4: CORS CONFIGURATION**

### Add to `functions.php` in your theme (or create a custom plugin)

**Location:** `wp-content/themes/your-theme/functions.php`

```php
<?php
/**
 * ==================== CORS CONFIGURATION FOR HEADLESS NEXT.JS ====================
 * This allows your Next.js frontend to communicate with WordPress REST API
 */

add_action('rest_api_init', function() {
    // Remove default CORS headers
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    
    // Add custom CORS headers for headless setup
    add_filter('rest_pre_serve_request', function($value) {
        // Get the origin of the request
        $origin = get_http_origin();
        
        // Define allowed origins
        $allowed_origins = [
            'http://localhost:3000',           // Local development
            'https://peptive.vercel.app',      // Production Next.js
            'https://www.peptive.vercel.app'   // WWW version if applicable
            // Add your custom domain when you have one
        ];
        
        // Check if the origin is allowed
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WC-Store-API-Nonce');
        
        return $value;
    });
}, 15);

/**
 * ==================== WOOCOMMERCE STORE API NONCE FILTER ====================
 * Allow Store API access from external origins
 */
add_filter('woocommerce_store_api_disable_nonce_check', function() {
    return true; // Only for headless setups
});

/**
 * ==================== USER REGISTRATION ENDPOINT ====================
 * Custom endpoint for user registration from Next.js
 */
add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/users/register', array(
        'methods' => 'POST',
        'callback' => 'custom_user_registration',
        'permission_callback' => '__return_true'
    ));
});

function custom_user_registration($request) {
    $username = sanitize_user($request['username']);
    $email = sanitize_email($request['email']);
    $password = $request['password'];
    $first_name = sanitize_text_field($request['first_name'] ?? '');
    $last_name = sanitize_text_field($request['last_name'] ?? '');
  
    // Validate required fields
    if (empty($username) || empty($email) || empty($password)) {
        return new WP_Error('missing_fields', 'Required fields are missing', array('status' => 400));
    }
  
    if (username_exists($username)) {
        return new WP_Error('username_exists', 'Username already exists', array('status' => 400));
    }
  
    if (email_exists($email)) {
        return new WP_Error('email_exists', 'Email already exists', array('status' => 400));
    }
  
    // Create user
    $user_id = wp_create_user($username, $password, $email);
  
    if (is_wp_error($user_id)) {
        return $user_id;
    }
  
    // Add user meta
    if (!empty($first_name)) {
        update_user_meta($user_id, 'first_name', $first_name);
    }
    if (!empty($last_name)) {
        update_user_meta($user_id, 'last_name', $last_name);
    }
  
    // Set role to customer
    wp_update_user(array(
        'ID' => $user_id,
        'role' => 'customer'
    ));
  
    return array(
        'success' => true,
        'user_id' => $user_id,
        'message' => 'User registered successfully'
    );
}
```

---

## 🛒 **PHASE 5: WOOCOMMERCE CONFIGURATION**

### Step 1: Generate API Keys

1. Go to: **WooCommerce → Settings → Advanced → REST API**
2. Click **"Add Key"**
3. Settings:
   - **Description:** "Next.js Peptive Frontend"
   - **User:** Select admin user
   - **Permissions:** **Read/Write**
4. Click **"Generate API Key"**
5. **SAVE THESE IMMEDIATELY** (you can't see them again):
   - Consumer Key: `ck_xxxxxxxxxxxxxxxxxxxxxx`
   - Consumer Secret: `cs_xxxxxxxxxxxxxxxxxxxxxx`

### Step 2: WooCommerce Settings

**General Settings:**
- WooCommerce → Settings → General
- Store Address: Your business address
- Currency: USD (or your currency)
- ✅ Enable taxes (if needed)

**Products Settings:**
- Shop page: Create and assign
- Weight/Dimension units: Set as needed

**Shipping:**
- Configure your shipping zones and methods

**Payments:**
- Enable payment gateways (Stripe, PayPal, etc.)

---

## 📦 **PHASE 6: ACF CONFIGURATION**

Your Next.js app fetches **ACF data** for:
- Hero sections
- Banner slides
- Global settings (announcement bar, contact info, etc.)

### Step 1: Create ACF Options Page

Add to `functions.php`:

```php
/**
 * ==================== ACF OPTIONS PAGE ====================
 * Global settings for the site
 */
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title'    => 'Global Settings',
        'menu_title'    => 'Site Settings',
        'menu_slug'     => 'global-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false,
        'icon_url'      => 'dashicons-admin-site',
        'position'      => 2
    ));
}
```

### Step 2: Create ACF Field Groups

#### **A. Global Settings (Options Page)**

1. Go to: **Custom Fields → Add New**
2. Title: **"Global Settings"**
3. Add Fields:

```
Group: Header Settings
- announcement_bar_text (Text)
- announcement_bar_link (URL)
- announcement_bar_enabled (True/False)

Group: Contact Info
- phone_number (Text)
- email (Email)
- address (Textarea)

Group: Social Media
- facebook_url (URL)
- instagram_url (URL)
- twitter_url (URL)
```

4. **Location Rule:** Options Page is equal to "Site Settings"
5. **Publish**

#### **B. Hero Section (Home Page)**

1. **Custom Fields → Add New**
2. Title: **"Homepage Hero"**
3. Add Fields:

```
- hero_title (Text)
- hero_subtitle (Textarea)
- hero_background_image (Image)
- hero_cta_text (Text)
- hero_cta_link (URL)
```

4. **Location Rule:** Page Template is equal to "Default Template" AND Page is equal to "Home"
5. **Publish**

#### **C. Banner Slides (Repeater)**

1. **Custom Fields → Add New**
2. Title: **"Banner Slides"**
3. Add Field:

```
- banner_slides (Repeater)
  Sub Fields:
    - slide_image (Image)
    - slide_title (Text)
    - slide_description (Textarea)
    - slide_link (URL)
    - slide_cta_text (Text)
```

4. **Location Rule:** Page Template is equal to "Default Template" AND Page is equal to "Home"
5. **Publish**

### Step 3: Create Home Page and Add Content

1. **Pages → Add New**
2. Title: **"Home"**
3. Slug: `home` (important!)
4. Fill in ACF fields (hero section, banners, etc.)
5. **Publish**

6. **Settings → Reading**
7. "Your homepage displays" → Select **"A static page"**
8. Homepage: Select **"Home"**
9. **Save Changes**

---

## 🔐 **PHASE 7: WORDPRESS SETTINGS**

### Enable User Registration (Optional)

**Settings → General:**
- ✅ **Anyone can register**
- **New User Default Role:** Customer
- **Save Changes**

### Permalinks

**Settings → Permalinks:**
- Select: **Post name** (recommended for clean URLs)
- **Save Changes**

---

## 🌍 **PHASE 8: UPDATE NEXT.JS ENVIRONMENT VARIABLES**

Update your `.env.local` file (and Vercel environment variables):

```env
# ==================== WOOCOMMERCE CONFIGURATION ====================

# Your NEW Hostinger WordPress URL (without trailing slash)
NEXT_PUBLIC_WOOCOMMERCE_URL=https://yourdomain.com

# WooCommerce REST API Credentials (from Phase 5)
WOOCOMMERCE_CONSUMER_KEY=ck_your_new_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_new_consumer_secret_here

# ==================== JWT AUTHENTICATION ====================

# JWT Secret Key (must match wp-config.php JWT_AUTH_SECRET_KEY)
NEXT_PUBLIC_JWT_SECRET=Gk$9mP#xL2wQ!vR8nH@jF5zT&cY7uB*eN4dA%sW6

# ==================== OPTIONAL SETTINGS ====================

# Enable debug mode (shows API errors in console)
NEXT_PUBLIC_DEBUG_MODE=true

# Site name and metadata
NEXT_PUBLIC_SITE_NAME=Peptive Peptides
NEXT_PUBLIC_SITE_URL=https://peptive.vercel.app
```

### Update Vercel Environment Variables:

1. Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Add/Update all the variables above
3. Apply to: **Production, Preview, Development**
4. **Save**
5. **Redeploy your site** (Deployments → ... → Redeploy)

---

## ✅ **PHASE 9: TESTING & VERIFICATION**

### Test WordPress REST API

**Test these URLs in your browser:**

1. **WordPress API:**
   ```
   https://yourdomain.com/wp-json/
   ```
   Should return: JSON with API routes

2. **WooCommerce Products:**
   ```
   https://yourdomain.com/wp-json/wc/v3/products?consumer_key=ck_xxx&consumer_secret=cs_xxx
   ```
   Should return: Product list JSON

3. **JWT Token Endpoint:**
   ```
   POST https://yourdomain.com/wp-json/jwt-auth/v1/token
   Body: {"username": "admin", "password": "your-password"}
   ```
   Should return: JWT token

4. **ACF Global Settings:**
   ```
   https://yourdomain.com/wp-json/acf/v3/options/options
   ```
   Should return: Your global settings data

5. **Home Page with ACF:**
   ```
   https://yourdomain.com/wp-json/wp/v2/pages?slug=home
   ```
   Should include: `acf` object with hero/banner data

### Test from Next.js

1. **Start your Next.js app locally:**
   ```bash
   npm run dev
   ```

2. **Check console for API calls**
3. **Test functionality:**
   - ✅ Products loading
   - ✅ Add to cart
   - ✅ User login/registration
   - ✅ Homepage hero/banners
   - ✅ Announcement bar

---

## 🛡️ **PHASE 10: SECURITY & OPTIMIZATION**

### .htaccess Security (Add to root .htaccess)

```apache
# Disable directory browsing
Options -Indexes

# Protect wp-config.php
<files wp-config.php>
order allow,deny
deny from all
</files>

# Protect .htaccess
<files .htaccess>
order allow,deny
deny from all
</files>

# Block XML-RPC (if not needed)
<files xmlrpc.php>
order allow,deny
deny from all
</files>
```

### Security Plugins (Optional but Recommended)

1. **Wordfence Security** - Firewall & malware scanner
2. **Limit Login Attempts Reloaded** - Prevent brute force
3. **UpdraftPlus** - Automated backups

### Performance Optimization

1. **Install caching plugin:** WP Super Cache or W3 Total Cache
2. **Image optimization:** ShortPixel or Smush
3. **CDN:** Cloudflare (free tier works great)

---

## 📊 **WHAT YOUR NEXT.JS APP IS FETCHING**

Your app currently fetches:

### From WooCommerce API:
- **Products:** `/wp-json/wc/store/products`
- **Product Details:** `/wp-json/wc/store/products/{id}`
- **Categories:** `/wp-json/wc/v3/products/categories`
- **Cart Operations:** WooCommerce Store API endpoints
- **Reviews:** `/wp-json/wc/v3/products/{id}/reviews`

### From WordPress API:
- **Pages:** `/wp-json/wp/v2/pages?slug=home`
- **ACF Global Settings:** `/wp-json/acf/v3/options/options`
- **Hero Sections:** ACF fields on pages
- **Banner Slides:** ACF repeater fields

### Authentication:
- **Login:** `/wp-json/jwt-auth/v1/token` (POST)
- **Register:** `/wp-json/wp/v2/users/register` (POST - custom endpoint)
- **Validate Token:** `/wp-json/jwt-auth/v1/token/validate` (POST)

---

## 🚨 **COMMON ISSUES & FIXES**

### Issue 1: CORS Errors
**Error:** "Access to XMLHttpRequest blocked by CORS policy"

**Fix:**
- Verify CORS code is in `functions.php`
- Check allowed origins include your Vercel URL
- Clear browser cache

### Issue 2: JWT Authentication Not Working
**Error:** "JWT secret key is not configured properly"

**Fix:**
- Verify `JWT_AUTH_SECRET_KEY` is in `wp-config.php`
- Make sure it matches `.env.local` `NEXT_PUBLIC_JWT_SECRET`
- Regenerate and update both

### Issue 3: ACF Fields Not in API
**Error:** ACF data missing from API response

**Fix:**
- Activate **ACF to REST API** plugin
- Check field group location rules
- Visit the page in WordPress admin to trigger ACF

### Issue 4: WooCommerce API 401 Unauthorized
**Error:** "Consumer key is invalid"

**Fix:**
- Regenerate WooCommerce API keys
- Update `.env.local` with new keys
- Check key permissions are "Read/Write"

### Issue 5: 404 on REST API Endpoints
**Fix:**
- Go to **Settings → Permalinks** → Save Changes (flush rewrite rules)
- Check `.htaccess` file exists and is writable

---

## 📞 **NEXT STEPS CHECKLIST**

- [ ] WordPress installed on Hostinger
- [ ] Database configured in wp-config.php
- [ ] All required plugins installed and activated
- [ ] JWT secret key added to wp-config.php
- [ ] CORS code added to functions.php
- [ ] WooCommerce API keys generated
- [ ] ACF options page created
- [ ] ACF field groups created (Global Settings, Hero, Banners)
- [ ] Home page created with ACF content
- [ ] Permalinks set to "Post name"
- [ ] User registration enabled (optional)
- [ ] .env.local updated with new URLs and keys
- [ ] Vercel environment variables updated
- [ ] Vercel deployment redeployed
- [ ] Tested all API endpoints
- [ ] Tested Next.js app functionality
- [ ] Security measures implemented
- [ ] Backups configured

---

## 🎉 **YOU'RE DONE!**

Your WordPress backend on Hostinger is now ready to serve your Next.js frontend!

**Quick Reference:**
- WordPress Admin: `https://yourdomain.com/wp-admin`
- REST API: `https://yourdomain.com/wp-json/`
- WooCommerce: `https://yourdomain.com/wp-admin/admin.php?page=wc-admin`

**Need Help?** Check the other guides:
- [ACF_SETUP_GUIDE.md](ACF_SETUP_GUIDE.md) - Detailed ACF setup
- [WORDPRESS_AUTH_SETUP.md](WORDPRESS_AUTH_SETUP.md) - Authentication details
- [IMPLEMENTATION_EXAMPLES.md](IMPLEMENTATION_EXAMPLES.md) - Code examples
