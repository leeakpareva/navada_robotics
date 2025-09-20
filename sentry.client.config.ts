// Sentry Client Configuration
// This file initializes Sentry for client-side error tracking
import * as Sentry from "@sentry/nextjs";

// Only initialize if DSN is available
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    // DSN (Data Source Name) - connects your app to your Sentry project
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Sample rate for performance monitoring (1.0 = 100% of transactions)
    tracesSampleRate: 1,

    // Disable debug mode in production
    debug: false,

    // Replay configuration for session recordings
    replaysSessionSampleRate: 0.1, // 10% of sessions will be recorded
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors will be recorded
  });
}