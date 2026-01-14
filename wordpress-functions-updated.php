<?php
/**
 * ==================== CORS CONFIGURATION FOR HEADLESS NEXT.JS ====================
 * This allows your Next.js frontend to communicate with WordPress REST API
 */

add_action('init', function() {
    // Get the request origin
    $http_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // Define allowed origins
    $allowed_origins = [
        'http://localhost:3000',
        'https://peptive.vercel.app',
        'https://www.peptive.vercel.app'
    ];
    
    // Check if origin is allowed and set CORS headers
    if (in_array($http_origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: {$http_origin}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WC-Store-API-Nonce');
        header('Access-Control-Max-Age: 86400'); // Cache preflight for 24 hours
    }
    
    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit;
    }
});

// Additional CORS headers for REST API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    
    add_filter('rest_pre_serve_request', function($served, $result, $request, $server) {
        // Get the request origin
        $http_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        // Define allowed origins
        $allowed_origins = [
            'http://localhost:3000',
            'https://peptive.vercel.app',
            'https://www.peptive.vercel.app'
        ];
        
        // Set CORS headers if origin is allowed
        if (in_array($http_origin, $allowed_origins)) {
            header("Access-Control-Allow-Origin: {$http_origin}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WC-Store-API-Nonce');
        }
        
        return $served;
    }, 15, 4);
});

/**
 * ==================== WOOCOMMERCE STORE API CORS ====================
 * Ensure WooCommerce Store API works with headless setup
 */
add_filter('woocommerce_store_api_disable_nonce_check', '__return_true');

// Add CORS headers specifically for WooCommerce Store API
add_filter('woocommerce_rest_check_permissions', function($permission, $context, $object_id, $post_type) {
    $http_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    $allowed_origins = [
        'http://localhost:3000',
        'https://peptive.vercel.app',
        'https://www.peptive.vercel.app'
    ];
    
    if (in_array($http_origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: {$http_origin}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WC-Store-API-Nonce');
    }
    
    return $permission;
}, 10, 4);

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
