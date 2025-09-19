'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold">Something went wrong!</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              We apologize for the inconvenience. The error has been reported and we're working on a fix.
            </p>
            <button
              onClick={() => reset()}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}