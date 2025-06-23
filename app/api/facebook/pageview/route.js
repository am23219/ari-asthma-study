import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const FacebookConversionsAPI = require('../../../lib/facebook-conversions-api');

export async function POST(request) {
  try {
    const body = await request.json();
    const { userData = {}, pageUrl } = body;

    // Get fbp and fbc from cookies
    const cookieStore = cookies();
    const fbp = cookieStore.get('_fbp')?.value;
    const fbc = cookieStore.get('_fbc')?.value;

    if (fbp) {
      userData.fbp = fbp;
    }
    if (fbc) {
      userData.fbc = fbc;
    }

    // Get client information from request headers
    const userAgent = request.headers.get('user-agent') || '';
    const sourceUrl = pageUrl || request.headers.get('referer') || request.url;
    
    // Get client IP (handling various proxy scenarios)
    const clientIpAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      request.ip ||
      '127.0.0.1';

    // Initialize Facebook API client
    const facebookAPI = new FacebookConversionsAPI();

    // Track page view using the dedicated method
    const result = await facebookAPI.trackPageView(
      userData,
      sourceUrl,
      userAgent,
      clientIpAddress
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        eventId: result.eventId,
        message: 'Page view tracked successfully'
      });
    } else {
      console.error('Failed to track page view:', result.error);
      return NextResponse.json(
        { error: 'Failed to track page view', details: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Page view tracking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 