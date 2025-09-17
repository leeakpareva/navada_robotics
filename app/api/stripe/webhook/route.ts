import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Initialize stripe only when the key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const getStripe = () => {
  if (!stripeSecretKey) {
    return null;
  }
  return new Stripe(stripeSecretKey, {
    apiVersion: '2025-08-27.basil',
  });
};

export async function POST(request: NextRequest) {
  // Check for Stripe configuration at runtime
  const stripe = getStripe();
  if (!stripe) {
    console.error('Stripe is not configured: STRIPE_SECRET_KEY is missing');
    return NextResponse.json(
      {
        error: 'Webhook processing unavailable',
        details: 'Stripe configuration is missing'
      },
      { status: 503 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      console.log('Missing stripe signature or webhook secret');
      return NextResponse.json(
        { error: 'Missing stripe signature or webhook secret' },
        { status: 400 }
      );
    }

    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object;
        console.log(`Subscription created: ${subscriptionCreated.id}`);
        // Handle subscription creation (e.g., update user in database)
        await handleSubscriptionCreated(subscriptionCreated);
        break;

      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object;
        console.log(`Subscription updated: ${subscriptionUpdated.id}`);
        // Handle subscription update (e.g., update user status in database)
        await handleSubscriptionUpdated(subscriptionUpdated);
        break;

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object;
        console.log(`Subscription deleted: ${subscriptionDeleted.id}`);
        // Handle subscription cancellation (e.g., revoke access)
        await handleSubscriptionDeleted(subscriptionDeleted);
        break;

      case 'customer.subscription.trial_will_end':
        const subscriptionTrialEnd = event.data.object;
        console.log(`Subscription trial ending: ${subscriptionTrialEnd.id}`);
        // Handle trial ending (e.g., send notification)
        await handleSubscriptionTrialEnding(subscriptionTrialEnd);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log(`Payment succeeded for invoice: ${invoice.id}`);
        // Handle successful payment
        await handlePaymentSucceeded(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log(`Payment failed for invoice: ${failedInvoice.id}`);
        // Handle failed payment
        await handlePaymentFailed(failedInvoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handler functions - implement these based on your business logic
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // TODO: Update user subscription status in your database
  console.log('Handling subscription created:', subscription.id);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // TODO: Update user subscription status in your database
  console.log('Handling subscription updated:', subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // TODO: Revoke user access in your database
  console.log('Handling subscription deleted:', subscription.id);
}

async function handleSubscriptionTrialEnding(subscription: Stripe.Subscription) {
  // TODO: Send notification to user about trial ending
  console.log('Handling subscription trial ending:', subscription.id);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // TODO: Update payment status in your database
  console.log('Handling payment succeeded:', invoice.id);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // TODO: Handle failed payment (send notification, retry, etc.)
  console.log('Handling payment failed:', invoice.id);
}