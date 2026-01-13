<?php
/**
 * WordPress Configuration for Headless WooCommerce
 * 
 * Copy these code snippets to your WordPress installation
 * Location options:
 * 1. Theme's functions.php
 * 2. Custom plugin
 * 3. Code Snippets plugin
 */

// ==================== 1. ENABLE CORS ====================

add_action('rest_api_init', function() {
    // Remove default CORS headers
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    
    // Add custom CORS headers for headless setup
    add_filter('rest_pre_serve_request', function($value) {
        // ⚠️ IMPORTANT: Change this to your Next.js URL
        $allowed_origin = 'http://localhost:3001';
        
        // For production, you can check the origin dynamically:
        // $origin = get_http_origin();
        // $allowed_origins = ['https://yourdomain.com', 'https://www.yourdomain.com'];
        // if (in_array($origin, $allowed_origins)) {
        //     header('Access-Control-Allow-Origin: ' . $origin);
        // }
        
        header('Access-Control-Allow-Origin: ' . $allowed_origin);
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WC-Store-API-Nonce');
        
        return $value;
    });
}, 15);

// ==================== 2. REGISTER BANNERS CUSTOM POST TYPE ====================

function register_banners_post_type() {
    $args = array(
        'labels' => array(
            'name' => 'Banners',
            'singular_name' => 'Banner',
            'add_new' => 'Add New Banner',
            'add_new_item' => 'Add New Banner',
            'edit_item' => 'Edit Banner',
            'new_item' => 'New Banner',
            'view_item' => 'View Banner',
            'search_items' => 'Search Banners',
            'not_found' => 'No banners found',
            'not_found_in_trash' => 'No banners found in trash'
        ),
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true, // IMPORTANT: Enables REST API
        'supports' => array('title', 'editor', 'thumbnail', 'page-attributes'),
        'menu_icon' => 'dashicons-images-alt2',
        'menu_position' => 20,
        'rewrite' => array('slug' => 'banners'),
    );
    
    register_post_type('banners', $args);
}
add_action('init', 'register_banners_post_type');

// ==================== 3. ACF OPTIONS PAGE ====================

if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' => 'Global Settings',
        'menu_title' => 'Global Settings',
        'menu_slug' => 'global-settings',
        'capability' => 'edit_posts',
        'redirect' => false,
        'icon_url' => 'dashicons-admin-settings',
        'position' => 25
    ));
}

// ==================== 4. EXPOSE FEATURED IMAGE IN REST API ====================

add_action('rest_api_init', function() {
    // Add featured image URL to posts
    register_rest_field(
        ['post', 'page', 'banners'], // Add your custom post types here
        'featured_media_url',
        array(
            'get_callback' => function($object) {
                if ($object['featured_media']) {
                    $img = wp_get_attachment_image_src($object['featured_media'], 'full');
                    return $img ? $img[0] : null;
                }
                return null;
            },
            'schema' => array(
                'description' => 'Featured image URL',
                'type' => 'string'
            )
        )
    );
});

// ==================== 5. CUSTOM USER REGISTRATION ENDPOINT ====================

add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/users/register', array(
        'methods' => 'POST',
        'callback' => 'custom_user_registration',
        'permission_callback' => '__return_true'
    ));
});

function custom_user_registration($request) {
    $username = $request->get_param('username');
    $email = $request->get_param('email');
    $password = $request->get_param('password');
    $first_name = $request->get_param('first_name');
    $last_name = $request->get_param('last_name');
    
    // Validate required fields
    if (empty($username) || empty($email) || empty($password)) {
        return new WP_Error('missing_fields', 'Username, email, and password are required', array('status' => 400));
    }
    
    // Check if username exists
    if (username_exists($username)) {
        return new WP_Error('username_exists', 'Username already exists', array('status' => 400));
    }
    
    // Check if email exists
    if (email_exists($email)) {
        return new WP_Error('email_exists', 'Email already exists', array('status' => 400));
    }
    
    // Create user
    $user_id = wp_create_user($username, $password, $email);
    
    if (is_wp_error($user_id)) {
        return $user_id;
    }
    
    // Update user meta
    if ($first_name) {
        update_user_meta($user_id, 'first_name', $first_name);
    }
    if ($last_name) {
        update_user_meta($user_id, 'last_name', $last_name);
    }
    
    // Get user data
    $user = get_user_by('id', $user_id);
    
    return array(
        'id' => $user_id,
        'username' => $username,
        'email' => $email,
        'name' => $first_name . ' ' . $last_name,
        'message' => 'User registered successfully'
    );
}

// ==================== 6. ENABLE PRODUCT VARIATIONS IN REST API ====================

add_filter('woocommerce_rest_prepare_product_variation_object', function($response, $object, $request) {
    // Add any custom variation data you need here
    return $response;
}, 10, 3);

// ==================== 7. EXTEND WooCommerce PRODUCT REST API ====================

add_filter('woocommerce_rest_prepare_product_object', function($response, $object, $request) {
    // Add custom fields to product API response
    // Example: Add custom meta field
    // $response->data['custom_field'] = get_post_meta($object->get_id(), 'custom_field', true);
    
    return $response;
}, 10, 3);

// ==================== 8. ALLOW GUEST CHECKOUT ====================

// Make sure guest checkout is enabled for Store API
add_filter('woocommerce_checkout_registration_required', '__return_false');
add_filter('woocommerce_checkout_registration_enabled', '__return_false');

// ==================== 9. CUSTOM SHIPPING METHODS (OPTIONAL) ====================

// If you need custom shipping calculations, you can add them here
// See: https://docs.woocommerce.com/document/adding-a-custom-shipping-method-to-your-extension/

// ==================== 10. WEBHOOK NOTIFICATIONS (OPTIONAL) ====================

// You can set up webhooks to notify your Next.js app of WooCommerce events
// Go to: WooCommerce > Settings > Advanced > Webhooks

// Example: Send webhook when order is created
add_action('woocommerce_checkout_order_processed', function($order_id) {
    $order = wc_get_order($order_id);
    
    // Send notification to Next.js app
    // wp_remote_post('http://localhost:3001/api/webhooks/order-created', array(
    //     'body' => json_encode(array(
    //         'order_id' => $order_id,
    //         'status' => $order->get_status(),
    //         'total' => $order->get_total(),
    //     )),
    //     'headers' => array('Content-Type' => 'application/json'),
    // ));
});

// ==================== 11. DISABLE ADMIN BAR FOR CUSTOMERS ====================

add_action('after_setup_theme', function() {
    if (!current_user_can('administrator') && !is_admin()) {
        show_admin_bar(false);
    }
});

// ==================== 12. SECURITY: LIMIT LOGIN ATTEMPTS (OPTIONAL) ====================

// Consider installing a plugin like "Limit Login Attempts Reloaded"
// Or implement custom rate limiting for the JWT endpoint

// ==================== 13. PERFORMANCE: DISABLE UNNECESSARY FEATURES ====================

// Disable WordPress emoji scripts (minor performance boost)
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

// Disable embeds if not needed
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('wp_head', 'wp_oembed_add_host_js');

?>
