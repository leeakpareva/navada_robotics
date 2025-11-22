import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize stripe only when the key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const getStripe = () => {
  if (!stripeSecretKey) {
    return null;
  }
  return new Stripe(stripeSecretKey);
};

export async function POST(request: NextRequest) {
  try {
    // Check for Stripe configuration at runtime
    const stripe = getStripe();
    if (!stripe) {
      console.error('Stripe is not configured: STRIPE_SECRET_KEY is missing');
      return NextResponse.json(
        {
          error: 'Payment system is not configured. Please contact support.',
          details: 'Stripe configuration is missing'
        },
        { status: 503 }
      );
    }
    const body = await request.json();
    const { lookup_key } = body;

    if (!lookup_key) {
      return NextResponse.json(
        { error: 'lookup_key is required' },
        { status: 400 }
      );
    }

    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
    });

    if (prices.data.length === 0) {
      return NextResponse.json(
        { error: 'No price found for the provided lookup key' },
        { status: 404 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/subscription?canceled=true`,
      customer_email: body.customer_email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}