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
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session to get the customer ID
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    if (!checkoutSession.customer) {
      return NextResponse.json(
        { error: 'No customer found for this session' },
        { status: 404 }
      );
    }

    // Create a portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}