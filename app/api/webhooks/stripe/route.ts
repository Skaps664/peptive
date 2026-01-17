import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// This is your Stripe webhook secret (get it from Stripe Dashboard → Webhooks)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// WooCommerce API setup
const woocommerceAPI = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3`,
  auth: {
    username: process.env.WOOCOMMERCE_CONSUMER_KEY!,
    password: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Payment successful!', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total,
        });

        // Create order in WooCommerce
        try {
          await createWooCommerceOrder(session);
          console.log('WooCommerce order created successfully');
        } catch (error) {
          console.error('Failed to create WooCommerce order:', error);
          // Don't fail the webhook - order payment is already successful
        }
        
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session expired:', session.id);
        // Handle expired sessions (optional)
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        // Handle successful payment
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent failed:', paymentIntent.id);
        // Handle failed payment (send notification, etc.)
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Create WooCommerce order from Stripe session
async function createWooCommerceOrder(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const billingDetails = JSON.parse(metadata.billingDetails || '{}');
  const shippingDetails = JSON.parse(metadata.shippingDetails || '{}');

  // Get line items from Stripe session
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  });

  // Transform line items for WooCommerce
  const wooLineItems = lineItems.data.map((item) => ({
    product_id: parseInt(item.description || '0'), // You'll need to store product ID in description
    quantity: item.quantity || 1,
  }));

  // Create order in WooCommerce
  const orderData = {
    status: 'processing',
    set_paid: true,
    customer_id: 0, // Guest checkout
    billing: {
      first_name: billingDetails.firstName || '',
      last_name: billingDetails.lastName || '',
      address_1: billingDetails.address1 || '',
      address_2: billingDetails.address2 || '',
      city: billingDetails.city || '',
      state: billingDetails.state || '',
      postcode: billingDetails.postcode || '',
      country: billingDetails.country || '',
      email: session.customer_email || billingDetails.email || '',
      phone: billingDetails.phone || '',
    },
    shipping: {
      first_name: shippingDetails.firstName || billingDetails.firstName || '',
      last_name: shippingDetails.lastName || billingDetails.lastName || '',
      address_1: shippingDetails.address1 || billingDetails.address1 || '',
      address_2: shippingDetails.address2 || billingDetails.address2 || '',
      city: shippingDetails.city || billingDetails.city || '',
      state: shippingDetails.state || billingDetails.state || '',
      postcode: shippingDetails.postcode || billingDetails.postcode || '',
      country: shippingDetails.country || billingDetails.country || '',
    },
    line_items: wooLineItems,
    payment_method: 'stripe',
    payment_method_title: 'Credit Card (Stripe)',
    transaction_id: session.payment_intent as string,
    meta_data: [
      {
        key: 'stripe_session_id',
        value: session.id,
      },
      {
        key: 'stripe_payment_intent',
        value: session.payment_intent,
      },
    ],
  };

  const response = await woocommerceAPI.post('/orders', orderData);
  return response.data;
}
//   // const order = await woocommerce.post('orders', {
//   //   billing: billingDetails,
//   //   shipping: shippingDetails,
//   //   line_items: [...], // Extract from session
//   //   payment_method: 'stripe',
//   //   payment_method_title: 'Credit Card (Stripe)',
//   //   set_paid: true,
//   // });
//
//   // return order;
// }
