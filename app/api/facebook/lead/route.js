import { NextResponse } from 'next/server';

const FacebookConversionsAPI = require('../../../lib/facebook-conversions-api');

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      userData = {},
      customData = {},
      leadValue,
      formName,
      pageUrl 
    } = body;

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

    // Enhance custom data with lead-specific information
    const enhancedCustomData = {
      ...customData,
      currency: 'USD', // Default currency
      contentName: formName || 'Contact Form',
      contentCategory: 'Lead Generation'
    };

    // Add lead value if provided
    if (leadValue && !isNaN(leadValue)) {
      enhancedCustomData.value = parseFloat(leadValue);
    }

    // Validate that we have some user data for lead tracking
    if (!userData.email && !userData.phone) {
      return NextResponse.json(
        { error: 'Email or phone number is required for lead tracking' },
        { status: 400 }
      );
    }

    // Initialize Facebook API client
    const facebookAPI = new FacebookConversionsAPI();

    // Track lead using the dedicated method
    const result = await facebookAPI.trackLead(
      userData,
      enhancedCustomData,
      sourceUrl,
      userAgent,
      clientIpAddress
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        eventId: result.eventId,
        message: 'Lead tracked successfully'
      });
    } else {
      console.error('Failed to track lead:', result.error);
      return NextResponse.json(
        { error: 'Failed to track lead', details: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Lead tracking API error:', error);
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