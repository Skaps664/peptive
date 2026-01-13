# WordPress Authentication Setup Guide

This guide explains how to set up WordPress user authentication with JWT tokens for your Next.js application.

## Prerequisites

- WordPress installation (Local by Flywheel or live server)
- WooCommerce plugin installed
- Admin access to WordPress

## Step 1: Install Required WordPress Plugins

### JWT Authentication Plugin

1. Go to WordPress Admin → Plugins → Add New
2. Search for "JWT Authentication for WP REST API"
3. Install and activate the plugin
   - Plugin URL: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/

## Step 2: Configure WordPress

### Add JWT Secret Key to wp-config.php

1. Open your `wp-config.php` file (located in WordPress root directory)
2. Add the following lines **before** `/* That's all, stop editing! */`:

```php
// JWT Authentication Configuration
define('JWT_AUTH_SECRET_KEY', 'your-super-secret-key-change-this-to-something-unique');
define('JWT_AUTH_CORS_ENABLE', true);
```

**Important:** Replace `'your-super-secret-key-change-this-to-something-unique'` with a strong, random string. You can generate one at: https://api.wordpress.org/secret-key/1.1/salt/

### Enable CORS for REST API (Optional but Recommended)

Add this to your theme's `functions.php` or create a custom plugin:

```php
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        return $value;
    });
}, 15);
```

## Step 3: Enable User Registration (Optional)

If you want users to be able to register:

1. Go to WordPress Admin → Settings → General
2. Check "Anyone can register"
3. Set "New User Default Role" to "Customer" (for WooCommerce)
4. Save changes

OR add this code to enable registration via REST API:

```php
// Enable user registration via REST API
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
  
    // Validate
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
  
    // Add first and last name if provided
    if (!empty($request['first_name'])) {
        update_user_meta($user_id, 'first_name', sanitize_text_field($request['first_name']));
    }
  
    if (!empty($request['last_name'])) {
        update_user_meta($user_id, 'last_name', sanitize_text_field($request['last_name']));
    }
  
    // Set default role as customer for WooCommerce
    $user = new WP_User($user_id);
    $user->set_role('customer');
  
    return array(
        'id' => $user_id,
        'username' => $username,
        'email' => $email,
        'name' => $request['first_name'] . ' ' . $request['last_name']
    );
}
```

## Step 4: Test the Setup

### Test JWT Token Generation

Use Postman or curl to test:

```bash
curl -X POST http://your-wordpress-site.local/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your-username",
    "password": "your-password"
  }'
```

Expected response:

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_email": "user@example.com",
  "user_nicename": "username",
  "user_display_name": "Display Name"
}
```

### Test Token Validation

```bash
curl -X POST http://your-wordpress-site.local/wp-json/jwt-auth/v1/token/validate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Step 5: Update Next.js Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_WOOCOMMERCE_URL=http://your-wordpress-site.local
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxx
```

## Features Included

### User Authentication

- ✅ Login with JWT tokens
- ✅ User registration
- ✅ Token validation
- ✅ Auto-logout on token expiration
- ✅ Remember me functionality

### User Account Pages

- ✅ `/login` - User login page
- ✅ `/signup` - User registration page
- ✅ `/account` - User account dashboard with:
  - Profile management
  - Order history
  - Saved addresses
  - Logout functionality

### Protected Routes

- Account page requires authentication
- Automatic redirect to login if not authenticated
- Token stored in localStorage
- Auto-login after successful registration

## Troubleshooting

### CORS Errors

If you get CORS errors:

1. Make sure `JWT_AUTH_CORS_ENABLE` is set to `true`
2. Add the CORS headers code from Step 2
3. Clear browser cache and try again

### 404 on JWT Endpoints

1. Go to WordPress Admin → Settings → Permalinks
2. Click "Save Changes" (this refreshes the rewrite rules)
3. Try the endpoint again

### Token Not Working

1. Check that JWT_AUTH_SECRET_KEY is set correctly
2. Make sure the JWT plugin is activated
3. Test token generation with Postman first
4. Check browser console for errors

### Registration Not Working

1. Make sure user registration is enabled
2. Check that the registration endpoint code is added
3. Verify email doesn't already exist
4. Check WordPress error logs

## Security Best Practices

1. **Use HTTPS in production** - JWT tokens should only be transmitted over HTTPS
2. **Strong secret key** - Use a long, random string for JWT_AUTH_SECRET_KEY
3. **Token expiration** - Tokens expire after 7 days by default
4. **Secure storage** - Consider using httpOnly cookies instead of localStorage for production
5. **Rate limiting** - Implement rate limiting on login attempts
6. **Password strength** - Enforce strong passwords (6+ characters minimum)

## Next Steps

1. **Email Verification** - Add email verification on registration
2. **Password Reset** - Implement forgot password functionality
3. **Social Login** - Add Google/Facebook login options
4. **Two-Factor Authentication** - Add 2FA for enhanced security
5. **User Roles** - Implement role-based access control

## Support

For issues or questions:

- WordPress JWT Plugin: https://wordpress.org/support/plugin/jwt-authentication-for-wp-rest-api/
- WooCommerce REST API: https://woocommerce.github.io/woocommerce-rest-api-docs/
