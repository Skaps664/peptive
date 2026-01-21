<?php
/**
 * Bundle Admin
 * Admin interface customizations
 */

if (!defined('ABSPATH')) {
    exit;
}

class Peptive_Bundle_Admin {
    
    public function __construct() {
        add_action('admin_enqueue_scripts', array($this, 'admin_scripts'));
        add_filter('woocommerce_product_data_tabs', array($this, 'hide_unused_tabs'));
    }
    
    /**
     * Enqueue admin scripts
     */
    public function admin_scripts($hook) {
        if ('post.php' === $hook || 'post-new.php' === $hook) {
            global $post;
            if ($post && $post->post_type === 'product') {
                // Enqueue WooCommerce product search
                wp_enqueue_script('wc-enhanced-select');
                wp_enqueue_style('woocommerce_admin_styles');
            }
        }
    }
    
    /**
     * Hide unused tabs for bundle products
     */
    public function hide_unused_tabs($tabs) {
        // Add hide_if_bundle class to tabs that don't make sense for bundles
        $tabs['inventory']['class'][] = 'hide_if_bundle';
        $tabs['shipping']['class'][] = 'hide_if_bundle';
        
        return $tabs;
    }
}
