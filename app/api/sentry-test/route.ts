// API Route to test server-side Sentry error tracking
import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET(request: NextRequest) {
  const testType = request.nextUrl.searchParams.get('type') || 'basic';

  try {
    switch (testType) {
      case 'basic':
        // Basic server error
        throw new Error('Test Server Error - Basic API error test');

      case 'async':
        // Async error
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Test Async Server Error - Delayed rejection'));
          }, 100);
        });
        break;

      case 'database':
        // Simulated database error
        const dbError = new Error('Test Database Connection Error');
        (dbError as any).code = 'ECONNREFUSED';
        (dbError as any).syscall = 'connect';
        throw dbError;

      case 'validation':
        // Validation error with details
        const validationError = new Error('Test Validation Error');
        (validationError as any).statusCode = 400;
        (validationError as any).details = {
          field: 'email',
          message: 'Invalid email format',
        };
        throw validationError;

      case 'message':
        // Send a custom message
        Sentry.captureMessage('Test Server Message - API route test', 'warning');
        return NextResponse.json({
          success: true,
          message: 'Custom message sent to Sentry',
        });

      case 'context':
        // Error with context
        Sentry.withScope((scope) => {
          scope.setTag('api-route', 'sentry-test');
          scope.setTag('test-type', 'server-side');
          scope.setContext('request', {
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers.entries()),
          });
          scope.setLevel('error');

          const contextError = new Error('Test Server Error with Context');
          Sentry.captureException(contextError);
        });

        return NextResponse.json({
          success: true,
          message: 'Error with context sent to Sentry',
        });

      default:
        return NextResponse.json({
          error: 'Invalid test type',
          availableTypes: ['basic', 'async', 'database', 'validation', 'message', 'context'],
        }, { status: 400 });
    }
  } catch (error) {
    // Capture the error in Sentry
    Sentry.captureException(error);

    // Return error response
    return NextResponse.json(
      {
        error: 'Server error occurred',
        message: error instanceof Error ? error.message : 'Unknown error',
        testType,
        sentryCapture: 'Error has been sent to Sentry',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let requestBody = '';
  try {
    const body = await request.json();
    requestBody = JSON.stringify(body);

    // Simulate processing error
    if (body.triggerError) {
      throw new Error(`Test POST Error - Processing failed for: ${requestBody}`);
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: 'POST request processed successfully',
      data: body,
    });
  } catch (error) {
    // Capture error with request body context
    Sentry.withScope((scope) => {
      scope.setContext('request_body', requestBody || 'Could not read body');
      Sentry.captureException(error);
    });

    return NextResponse.json(
      {
        error: 'Failed to process POST request',
        message: error instanceof Error ? error.message : 'Unknown error',
        sentryCapture: 'Error has been sent to Sentry',
      },
      { status: 500 }
    );
  }
}