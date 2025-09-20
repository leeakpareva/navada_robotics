// Sentry Server Configuration
// This file initializes Sentry for server-side error tracking in Next.js
import * as Sentry from "@sentry/nextjs";

// Only initialize if DSN is available
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    // DSN (Data Source Name) - connects your app to your Sentry project
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Sample rate for performance monitoring (1.0 = 100% of transactions)
    // Consider lowering in production for high-traffic apps
    tracesSampleRate: 1,

    // Disable debug mode in production
    debug: false,
  });
}