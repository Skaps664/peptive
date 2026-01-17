import { NextResponse } from 'next/server';
import axios from 'axios';

const WOOCOMMERCE_API_URL = process.env.WOOCOMMERCE_API_URL;
const WOOCOMMERCE_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const WOOCOMMERCE_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// WooCommerce API client
const wooClient = axios.create({
  baseURL: WOOCOMMERCE_API_URL,
  auth: {
    username: WOOCOMMERCE_CONSUMER_KEY || '',
    password: WOOCOMMERCE_CONSUMER_SECRET || '',
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function POST(request: Request) {
  try {
    const { items, country, state, postcode, city } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    if (!country) {
      return NextResponse.json(
        { error: 'Country is required' },
        { status: 400 }
      );
    }

    // Prepare line items for WooCommerce
    const lineItems = items.map((item: any) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    // Create a temporary order to calculate shipping and tax
    // We'll use WooCommerce's calculate endpoint or create a draft order
    const orderData = {
      status: 'pending', // Draft status
      set_paid: false,
      billing: {
        country: country,
        state: state || '',
        postcode: postcode || '',
        city: city || '',
      },
      shipping: {
        country: country,
        state: state || '',
        postcode: postcode || '',
        city: city || '',
      },
      line_items: lineItems,
    };

    // Create order to get calculated shipping and tax
    const response = await wooClient.post('/orders', orderData);
    const order = response.data;

    // Extract shipping and tax information
    const shippingTotal = parseFloat(order.shipping_total || '0');
    const shippingTax = parseFloat(order.shipping_tax || '0');
    const totalTax = parseFloat(order.total_tax || '0');
    const subtotal = parseFloat(order.total || '0') - shippingTotal - totalTax;

    // Delete the temporary order
    try {
      await wooClient.delete(`/orders/${order.id}`, { params: { force: true } });
    } catch (deleteError) {
      console.error('Error deleting temporary order:', deleteError);
      // Continue even if deletion fails
    }

    return NextResponse.json({
      shipping: shippingTotal + shippingTax,
      tax: totalTax,
      subtotal: subtotal,
      shippingMethods: order.shipping_lines || [],
    });
  } catch (error: any) {
    console.error('Error calculating shipping and tax:', error.response?.data || error.message);
    
    // Return default values if WooCommerce is not available
    return NextResponse.json({
      shipping: 0,
      tax: 0,
      subtotal: 0,
      error: 'Unable to calculate shipping and tax. Please try again.',
    }, { status: 200 }); // Return 200 with default values
  }
}
