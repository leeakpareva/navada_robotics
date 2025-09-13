import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAnalytics } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const analytics = getCurrentAnalytics();

    return NextResponse.json(analytics, {
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    // Handle different types of analytics events
    switch (type) {
      case 'chat_start':
        // Track new chat session
        break;
      case 'chat_message':
        // Track message sent
        break;
      case 'chat_response':
        // Track response time
        break;
      case 'chat_end':
        // Track session completion
        break;
      case 'user_feedback':
        // Track user satisfaction rating
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown analytics event type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics event' },
      { status: 500 }
    );
  }
}