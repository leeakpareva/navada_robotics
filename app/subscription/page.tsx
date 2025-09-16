'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const ProductDisplay = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lookup_key: 'Consulting_Services_(Ai)-acfea00',
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">AI Consulting Services</CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">£100</span>
            <span className="text-muted-foreground">/ month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>AI Strategy Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Custom AI Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Implementation Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>24/7 Technical Support</span>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Cancel anytime. No long-term commitments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const SuccessDisplay = ({ sessionId }: { sessionId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to create portal session');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-green-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
            Subscription Successful!
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Welcome to AI Consulting Services
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              Your subscription is now active. You'll receive a confirmation email shortly with all the details.
            </p>
          </div>

          <Button
            onClick={handleManageBilling}
            disabled={isLoading}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Manage Billing'
            )}
          </Button>

          <Button
            onClick={() => window.location.href = '/'}
            variant="default"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const CancelledDisplay = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
          <X className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
          Payment Cancelled
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Your payment was cancelled. No charges were made.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">
            Continue shopping and checkout when you're ready. Your cart items are still saved.
          </p>
        </div>

        <Button
          onClick={() => window.location.href = '/subscription'}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          size="lg"
        >
          Try Again
        </Button>

        <Button
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="w-full"
          size="lg"
        >
          Return to Home
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default function SubscriptionPage() {
  const [status, setStatus] = useState<'loading' | 'product' | 'success' | 'cancelled'>('loading');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('success')) {
      setStatus('success');
      const sessionIdParam = urlParams.get('session_id');
      if (sessionIdParam) {
        setSessionId(sessionIdParam);
      }
    } else if (urlParams.get('canceled')) {
      setStatus('cancelled');
    } else {
      setStatus('product');
    }
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (status === 'success') {
    return <SuccessDisplay sessionId={sessionId} />;
  }

  if (status === 'cancelled') {
    return <CancelledDisplay />;
  }

  return <ProductDisplay />;
}