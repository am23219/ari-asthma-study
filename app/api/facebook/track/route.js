import { NextResponse } from 'next/server';

const FacebookConversionsAPI = require('../../../lib/facebook-conversions-api');

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      eventName,
      userData = {},
      customData = {},
      eventId
    } = body;

    // Get client information from request headers
    const userAgent = request.headers.get('user-agent') || '';
    const sourceUrl = request.headers.get('referer') || request.url;
    
    // Get client IP (handling various proxy scenarios)
    const clientIpAddress = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      request.ip ||
      '127.0.0.1';

    // Validate required fields
    if (!eventName) {
      return NextResponse.json(
        { error: 'eventName is required' },
        { status: 400 }
      );
    }

    // Create Facebook API instance
    const facebookAPI = new FacebookConversionsAPI();
    
    // Check if the API instance is valid
    if (!facebookAPI.isValid) {
      return NextResponse.json(
        { error: 'Facebook API not properly configured' },
        { status: 500 }
      );
    }

    // Send event to Facebook Conversions API
    const result = await facebookAPI.sendEvent({
      eventName,
      eventId,
      userData,
      customData,
      sourceUrl,
      userAgent,
      clientIpAddress
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        eventId: result.eventId,
        message: 'Event tracked successfully'
      });
    } else {
      console.error('Failed to track Facebook event:', result.error);
      return NextResponse.json(
        { error: 'Failed to track event', details: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Facebook tracking API error:', error);
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