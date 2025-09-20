export async function register() {
  // Only initialize Sentry if auth token is available
  if (process.env.SENTRY_AUTH_TOKEN) {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./sentry.server.config').catch(() => {
        // Silently fail if Sentry config is not available
      })
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./sentry.edge.config').catch(() => {
        // Silently fail if Sentry config is not available
      })
    }
  }
}