# 🎯 Step-by-Step Fix (Follow These Exactly)

## Your Issues:
1. ❌ JWT plugin says "Not Configured" (because constants are duplicated)
2. ❌ 0 products showing (no products in WooCommerce yet)
3. ❌ .env.local had wrong JWT key

---

## Step 1: Fix wp-config.php (CRITICAL)

### Open this file:
```
C:\Users\skaps\Local Sites\peptivepeptides\app\public\wp-config.php
```

### Find these lines (they appear TWICE in your file):
```php
define('JWT_AUTH_SECRET_KEY', 'j{5yZy)5gf<9g+>r0PLyNlHb{QApReJ@RI_E0bnuy2fycB=%8hx()Op@]mT!99)H');
define('JWT_AUTH_CORS_ENABLE', true);
```

### What to do:
1. **Search** for `JWT_AUTH_SECRET_KEY` in the file
2. You'll find it **TWO TIMES** (that's the problem!)
3. **DELETE ONE SET** - keep only the one that's right before this line:
   ```php
   /* That's all, stop editing! Happy publishing. */
   ```

### Your wp-config.php should look like this at the end:
```php
// ... lots of WordPress config above ...

/**
 * For developers: WordPress debugging mode.
 */
define( 'WP_DEBUG', false );

// JWT Authentication Configuration (ADD ONLY ONCE!)
define('JWT_AUTH_SECRET_KEY', 'j{5yZy)5gf<9g+>r0PLyNlHb{QApReJ@RI_E0bnuy2fycB=%8hx()Op@]mT!99)H');
define('JWT_AUTH_CORS_ENABLE', true);

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
// ... rest of file ...
```

**Save the file!**

---

## Step 2: Restart Local

1. Open **Local by Flywheel**
2. Click **STOP** on your `peptivepeptides` site
3. Wait 5 seconds
4. Click **START**

---

## Step 3: Verify JWT Plugin

1. Go to: `http://peptivepeptides.local/wp-admin`
2. Go to: **Settings > JWT Auth** (or wherever the JWT plugin is)
3. You should now see:
   - ✅ Secret Key: **Configured**
   - ✅ CORS Support: **Enabled**

---

## Step 4: Add Products to WooCommerce

### You have 0 products - let's add some!

1. Go to: `http://peptivepeptides.local/wp-admin`
2. Click: **Products > Add New**
3. Create 3-5 test products:

**Product 1:**
- Name: `Test Peptide 1`
- Price: `29.99`
- Description: `This is a test product`
- Click **Publish** (NOT Draft!)

**Product 2:**
- Name: `Test Peptide 2`
- Price: `39.99`
- Description: `Another test product`
- Click **Publish**

**Product 3:**
- Name: `Test Peptide 3`
- Price: `49.99`
- Description: `One more test product`
- Click **Publish**

**Important:** Make sure to click **PUBLISH** (not save as draft)!

---

## Step 5: Verify Products in WooCommerce

Visit this URL in your browser:
```
http://peptivepeptides.local/wp-json/wc/v3/products?consumer_key=ck_3bb79d55d146a1b4f2ac8fd7a32160d326ed09b6&consumer_secret=cs_4b6c1846c48e9a0a7bdaac89d31dee3d636a778e
```

You should see JSON with your products! If you see `[]` (empty array), go back and make sure products are **Published**.

---

## Step 6: Restart Next.js

Your `.env.local` has been updated with the correct JWT key.

In your terminal:
```bash
# Press Ctrl+C to stop the server
# Then run:
npm run dev
```

---

## Step 7: Test Everything

Visit: `http://localhost:3001/api-test`

### You should now see:

✅ **WooCommerce Products API**
```
✓ Successfully fetched 3 products
```

✅ **JWT Authentication**
```
✓ JWT plugin configured
✓ Test endpoint: http://peptivepeptides.local/wp-json/jwt-auth/v1/token
```

---

## Step 8: Test JWT Endpoint Manually

Visit in browser:
```
http://peptivepeptides.local/wp-json/jwt-auth/v1/token
```

You should see:
```json
{
  "code": "jwt_auth_bad_request",
  "message": "Username is required",
  "data": {
    "status": 403
  }
}
```

This is **CORRECT** ✅ - it means JWT is working! It's just asking for login credentials.

---

## ✅ Success Checklist

After following all steps:

- [ ] No more "Warning: Constant already defined" in WordPress
- [ ] JWT plugin shows "Secret Key: Configured"
- [ ] At least 3 products in WooCommerce (Published, not Draft)
- [ ] Products API returns products (not empty array)
- [ ] `/api-test` shows "✓ Successfully fetched X products"
- [ ] JWT endpoint returns "Username is required" error (this is good!)

---

## 🐛 Still Not Working?

### If JWT still says "Not Configured":

1. Make sure you deleted ALL duplicate lines
2. Search the entire wp-config.php for `JWT_AUTH_SECRET_KEY` - should appear ONLY ONCE
3. Make sure it's BEFORE the `/* That's all` comment
4. Fully restart Local (stop the site, quit Local, reopen, start site)

### If Products still show 0:

1. Go to WooCommerce > Products
2. Check the "Status" column - must say "Published" (not "Draft")
3. Click on a product and make sure "Publish" button was clicked
4. Test the products API URL directly (see Step 5)

### If you get CORS errors:

1. Make sure you added the CORS code from `wordpress-config-snippets.php` to your theme's `functions.php`
2. The allowed origin should be: `http://localhost:3001`
3. Restart WordPress after adding CORS code

---

## 🎯 Summary

**The main issues were:**
1. JWT constants defined twice in wp-config.php ✅ Fixed
2. No products in WooCommerce ✅ Add products now
3. Wrong JWT key in .env.local ✅ Already updated

**Now do:**
1. Remove duplicate JWT lines from wp-config.php
2. Restart Local
3. Add 3-5 products
4. Restart Next.js (`npm run dev`)
5. Visit `/api-test`

**You should be good to go!** 🚀
