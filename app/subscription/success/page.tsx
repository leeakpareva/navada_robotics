'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  if (sessionId) {
    // Redirect to main subscription page with success params
    window.location.href = `/subscription?success=true&session_id=${sessionId}`;
  } else {
    // Fallback redirect
    window.location.href = '/subscription?success=true';
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>}>
      <SuccessContent />
    </Suspense>
  );
}