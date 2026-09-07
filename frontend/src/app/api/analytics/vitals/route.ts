import { NextRequest, NextResponse } from 'next/server';

/**
 * Web Vitals Analytics Endpoint
 * 
 * Next.js automatically reports Core Web Vitals metrics.
 * This endpoint receives them for logging/analytics.
 * 
 * In production, you can:
 * - Send to Vercel Analytics (automatic if enabled)
 * - Log to your own analytics service
 * - Store in database for monitoring
 * 
 * For portfolio projects, we just acknowledge receipt.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In development, log metrics
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', body);
    }

    // In production, you could send to analytics service:
    // await fetch('https://your-analytics-service.com/vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body),
    // });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to process metrics' }, { status: 500 });
  }
}
