import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone } = body;

    // Get the GHL API key from environment variables
    const ghlApiKey = process.env.GOHIGHLEVEL_API_KEY;
    if (!ghlApiKey) {
      throw new Error('GoHighLevel API key not configured');
    }

    const calendarId = 'E0iPfKdrbUfDrCUCCXb8';

    // Try multiple potential endpoints for generating one-time booking links
    const endpointsToTry = [
      // API 2.0 endpoint
      {
        url: `https://services.leadconnectorhq.com/calendars/${calendarId}/bookingLink`,
        headers: {
          Authorization: `Bearer ${ghlApiKey}`,
          'Content-Type': 'application/json',
          Version: '2021-04-15',
        },
        body: {
          firstName,
          lastName,
          email,
          phone,
          oneTimeUse: true,
        },
      },
      // API 1.0 endpoint (fallback)
      {
        url: `https://rest.gohighlevel.com/v1/calendars/${calendarId}/bookingLink`,
        headers: {
          Authorization: `Bearer ${ghlApiKey}`,
          'Content-Type': 'application/json',
        },
        body: {
          firstName,
          lastName,
          email,
          phone,
          oneTimeUse: true,
        },
      },
    ];

    let bookingLinkResponse;
    let lastError;

    // Try each endpoint in sequence
    for (const endpoint of endpointsToTry) {
      try {
        bookingLinkResponse = await fetch(endpoint.url, {
          method: 'POST',
          headers: endpoint.headers,
          body: JSON.stringify(endpoint.body),
        });

        if (bookingLinkResponse.ok) {
          const bookingData = await bookingLinkResponse.json();

          return NextResponse.json({
            success: true,
            bookingLink: bookingData.link || bookingData.bookingLink || bookingData.url,
            data: bookingData,
            method: 'api-generated',
          });
        }

        lastError = await bookingLinkResponse.text();
        console.warn(`Endpoint ${endpoint.url} failed:`, bookingLinkResponse.status, lastError);
      } catch (endpointError) {
        console.warn(`Endpoint ${endpoint.url} error:`, endpointError.message);
        lastError = endpointError.message;
      }
    }

    // If API endpoints fail, fall back to regular booking widget with pre-populated parameters
    console.log('API endpoints failed, falling back to regular booking widget');

    const queryParams = new URLSearchParams();
    if (firstName) queryParams.append('firstName', firstName);
    if (lastName) queryParams.append('lastName', lastName);
    if (email) queryParams.append('email', email);
    if (phone) queryParams.append('phone', phone);

    const fallbackBookingLink = `https://api.leadconnectorhq.com/widget/booking/${calendarId}?${queryParams.toString()}`;

    return NextResponse.json({
      success: true,
      bookingLink: fallbackBookingLink,
      data: {
        calendarId,
        contactInfo: { firstName, lastName, email, phone },
        note: 'Using regular booking widget with pre-populated contact information',
      },
      method: 'widget-fallback',
    });
  } catch (error) {
    console.error('Error generating booking link:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to generate booking link' },
      { status: 500 },
    );
  }
}
