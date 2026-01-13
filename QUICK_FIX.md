# 🔧 Quick Fix Guide - JWT & WordPress Issues

## Problem 1: JWT Constants Already Defined (DUPLICATE ERROR)

### ❌ What's Wrong
Your `wp-config.php` has the JWT constants defined **twice** (that's why you see the warnings). The plugin can't read them properly when duplicated.

### ✅ How to Fix

**Step 1:** Open your `wp-config.php` file:
```
C:\Users\skaps\Local Sites\peptivepeptides\app\public\wp-config.php
```

**Step 2:** Find and **DELETE** the duplicate lines (around line 98-99). Look for:
```php
define('JWT_AUTH_SECRET_KEY', '...');
define('JWT_AUTH_CORS_ENABLE', true);
```

**Step 3:** Make sure you have these lines **ONLY ONCE** in the file, right before this line:
```php
/* That's all, stop editing! Happy publishing. */
```

Your wp-config.php should have this **ONLY ONCE**:
```php
// ... other WordPress config above ...

// JWT Authentication Configuration
define('JWT_AUTH_SECRET_KEY', 'j{5yZy)5gf<9g+>r0PLyNlHb{QApReJ@RI_E0bnuy2fycB=%8hx()Op@]mT!99)H');
define('JWT_AUTH_CORS_ENABLE', true);

/* That's all, stop editing! Happy publishing. */
// ... rest of file below ...
```

**Step 4:** Save the file and restart Local (stop and start the site)

---

## Problem 2: No Products Found (0 Products)

### ❌ What's Wrong
Your WooCommerce has no products yet!

### ✅ How to Fix

**Option A: Add Products via WooCommerce**
1. Go to WordPress Admin: `http://peptivepeptides.local/wp-admin`
2. Navigate to: **Products > Add New**
3. Add at least 3-5 test products with:
   - Product name
   - Price (e.g., $29.99)
   - Description
   - Product image
   - Set to "Published" (not Draft!)
4. Click **Publish**

**Option B: Import Sample Products**
1. Go to: **WooCommerce > Home**
2. Look for "Import products" option
3. WooCommerce has sample data you can import

---

## Problem 3: Test JWT Endpoint

Once you fix the wp-config.php duplicate, test the JWT endpoint:

### Test in Browser
Visit: `http://peptivepeptides.local/wp-json/jwt-auth/v1/token`

You should see:
```json
{
  "code": "jwt_auth_bad_request",
  "message": "Username is required",
  "data": { "status": 403 }
}
```

This is **GOOD** - it means the endpoint is working! It's just asking for credentials.

### Test with Postman or cURL
```bash
curl -X POST http://peptivepeptides.local/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{"username":"skaps","password":"your_wp_password"}'
```

Replace `your_wp_password` with your WordPress admin password.

If it works, you'll get:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_email": "...",
  "user_nicename": "skaps",
  "user_display_name": "skaps"
}
```

---

## Problem 4: Update .env.local with Correct JWT Key

Update your `.env.local` file to match the key in wp-config.php:

```env
NEXT_PUBLIC_JWT_SECRET=your-super-secret-jwt-key-change-this
```

**Important:** The key must be **exactly the same** in both files!

After updating, restart your Next.js server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## Problem 5: .htaccess for Authorization Header

**If you're using Apache** (Local by Flywheel uses Nginx, so skip this):

Add this to your `.htaccess` file in WordPress root:
```apache
RewriteEngine on
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
```

**For Local by Flywheel (Nginx):**
You don't need to do anything - Nginx handles this automatically!

---

## ✅ Complete Checklist

### WordPress Side
- [ ] Remove duplicate JWT constants from wp-config.php
- [ ] Keep only ONE set of JWT_AUTH_SECRET_KEY and JWT_AUTH_CORS_ENABLE
- [ ] Restart Local site (stop and start)
- [ ] Add at least 3 products in WooCommerce
- [ ] Publish products (not Draft)
- [ ] Test JWT endpoint returns "Username is required" message

### Next.js Side
- [ ] Update NEXT_PUBLIC_JWT_SECRET in .env.local to match wp-config.php
- [ ] Restart Next.js dev server
- [ ] Visit /api-test page
- [ ] Should now show products!

---

## 🧪 Expected Results After Fix

When you visit `/api-test`, you should see:

### ✅ Products
```
✅ WooCommerce Products API
✓ Successfully fetched 3 products (or however many you added)
```

### ✅ JWT
```
ℹ️ JWT Authentication
Setup checklist:
✓ JWT plugin installed
✓ Secret key configured in wp-config.php
✓ Test endpoint works: http://peptivepeptides.local/wp-json/jwt-auth/v1/token
```

---

## 🆘 Still Having Issues?

### Issue: "Secret Key Not Configured" still shows

**Solution:**
1. Make 100% sure there are NO duplicate lines in wp-config.php
2. The constants must be BEFORE `/* That's all, stop editing! */`
3. After editing, fully restart Local (not just refresh)

### Issue: "0 products" still shows

**Solution:**
1. Check products are "Published" (not Draft or Private)
2. Go to WooCommerce > Products and verify they're there
3. Test API directly: `http://peptivepeptides.local/wp-json/wc/v3/products?consumer_key=ck_...&consumer_secret=cs_...`

### Issue: CORS errors in console

**Solution:**
1. Check you added the CORS code to functions.php
2. Make sure the allowed origin is: `http://localhost:3001`
3. Restart WordPress after changes

---

## 📝 Quick Commands

### Test Products API
Visit in browser:
```
http://peptivepeptides.local/wp-json/wc/v3/products?consumer_key=ck_3bb79d55d146a1b4f2ac8fd7a32160d326ed09b6&consumer_secret=cs_4b6c1846c48e9a0a7bdaac89d31dee3d636a778e
```

### Test JWT Endpoint
Visit in browser:
```
http://peptivepeptides.local/wp-json/jwt-auth/v1/token
```

Should say: `{"code":"jwt_auth_bad_request","message":"Username is required"}`

---

## 🎯 Do This Now (In Order)

1. **Fix wp-config.php** - Remove duplicate JWT lines (2 min)
2. **Restart Local** - Stop and start your site (1 min)
3. **Add Products** - Add 3-5 test products (5 min)
4. **Update .env.local** - Match JWT secret (1 min)
5. **Restart Next.js** - `npm run dev` (1 min)
6. **Test** - Visit `/api-test` page (1 min)

**Total time: ~10 minutes**

---

Let me know if you still see errors after following these steps!
