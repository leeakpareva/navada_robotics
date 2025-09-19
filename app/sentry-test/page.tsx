'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function SentryTestPage() {
  const [testStatus, setTestStatus] = useState<string>('');

  // Test client-side error
  const testClientError = () => {
    try {
      setTestStatus('Triggering client-side error...');
      throw new Error('Test Client Error - This is a test error for Sentry');
    } catch (error) {
      Sentry.captureException(error);
      setTestStatus('Client error sent to Sentry! Check your Sentry dashboard.');
      console.error('Test error captured:', error);
    }
  };

  // Test unhandled error
  const testUnhandledError = () => {
    setTestStatus('Triggering unhandled error in 2 seconds...');
    setTimeout(() => {
      // This will cause an unhandled error
      throw new Error('Test Unhandled Error - This should be caught by Sentry');
    }, 2000);
  };

  // Test custom message
  const testCustomMessage = () => {
    setTestStatus('Sending custom message to Sentry...');
    Sentry.captureMessage('Test Message - Custom message from Navada Robotics', 'info');
    setTestStatus('Custom message sent to Sentry!');
  };

  // Test with user context
  const testWithUserContext = () => {
    setTestStatus('Setting user context and sending error...');
    Sentry.setUser({
      id: 'test-user-123',
      email: 'test@navadarobotics.com',
      username: 'testuser',
    });

    const error = new Error('Test Error with User Context');
    Sentry.captureException(error);
    setTestStatus('Error with user context sent to Sentry!');
  };

  // Test with custom tags
  const testWithTags = () => {
    setTestStatus('Sending error with custom tags...');
    Sentry.withScope((scope) => {
      scope.setTag('environment', 'test');
      scope.setTag('feature', 'sentry-test');
      scope.setTag('priority', 'high');
      scope.setLevel('error');

      const error = new Error('Test Error with Custom Tags');
      Sentry.captureException(error);
    });
    setTestStatus('Error with custom tags sent to Sentry!');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Sentry Error Tracking Test Page</h1>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-blue-800">
          <strong>Sentry DSN:</strong> {process.env.NEXT_PUBLIC_SENTRY_DSN ? 'Configured ✓' : 'Not configured ✗'}
        </p>
        <p className="text-sm text-blue-800 mt-2">
          <strong>Project:</strong> sentry-purple-lamp | <strong>Org:</strong> generali-ki
        </p>
      </div>

      {testStatus && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <p className="text-yellow-800">{testStatus}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={testClientError}
          className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition"
        >
          Test Client Error
        </button>

        <button
          onClick={testUnhandledError}
          className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition"
        >
          Test Unhandled Error (2s delay)
        </button>

        <button
          onClick={testCustomMessage}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
        >
          Test Custom Message
        </button>

        <button
          onClick={testWithUserContext}
          className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 transition"
        >
          Test with User Context
        </button>

        <button
          onClick={testWithTags}
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
        >
          Test with Custom Tags
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">How to verify Sentry is working:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Click any of the test buttons above</li>
          <li>Check the console for error logs</li>
          <li>Visit your Sentry dashboard at <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">sentry.io</a></li>
          <li>Navigate to your project: <strong>generali-ki / sentry-purple-lamp</strong></li>
          <li>You should see the test errors appear in the Issues tab</li>
        </ol>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Sentry Features Tested:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Basic error capturing with try-catch</li>
          <li>Unhandled exceptions</li>
          <li>Custom messages with severity levels</li>
          <li>User context attachment</li>
          <li>Custom tags and scopes</li>
        </ul>
      </div>
    </div>
  );
}