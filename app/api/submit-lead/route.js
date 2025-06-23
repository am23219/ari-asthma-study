import { NextResponse } from 'next/server';
import IPGeolocationAPI from 'ip-geolocation-api-javascript-sdk';
import GeolocationParams from 'ip-geolocation-api-javascript-sdk/GeolocationParams.js';
import FacebookConversionsAPI from '../../lib/facebook-conversions-api';

const isDev = process.env.NODE_ENV !== 'production';
const fbAPI = new FacebookConversionsAPI();
const ipgeolocationApi = new IPGeolocationAPI(process.env.IP_GEOLOCATION_API_KEY, false);

// Helper function to wrap the callback-based SDK in a Promise for async/await
function getGeolocationAsync(params) {
  return new Promise((resolve, reject) => {
    ipgeolocationApi.getGeolocation((json) => {
      // The API returns a `message` field on error
      if (json.message) {
        reject(new Error(json.message));
      } else {
        resolve(json);
      }
    }, params);
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { eventId, ...formData } = body;

    // --- 1. Get User Location from IP Address ---
    const headersList = request.headers;
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = headersList.get('x-nf-client-connection-ip') || (forwardedFor ? forwardedFor.split(',')[0].trim() : null) || '8.8.8.8';
    const userAgent = headersList.get('user-agent');
    const referer = headersList.get('referer');
    
    let locationData = { city: '', state: '', postalCode: '', country: 'US' };
    try {
      const geolocationParams = new GeolocationParams();
      geolocationParams.setIPAddress(ip);
      // We explicitly ask for the fields we need to be efficient.
      geolocationParams.setFields("geo,zipcode");

      const geo = await getGeolocationAsync(geolocationParams);
      
      locationData = {
        city: geo.city || '',
        state: geo.state_prov || '',
        postalCode: geo.zipcode || '',
        country: geo.country_code2 || 'US'
      };
    } catch (geoError) {
      console.warn(`IP Geolocation lookup failed for IP ${ip}. Proceeding with default location data (US). Error:`, geoError.message);
      // We proceed with default location data, so the lead can still be submitted.
    }

    if (isDev) {
      console.log(`IP Lookup for ${ip}:`, locationData);
    }

    // --- 2. Submit to GoHighLevel ---
    const ghlApiKey = process.env.GOHIGHLEVEL_API_KEY;
    if (!ghlApiKey) {
      throw new Error('Server configuration error: GHL API Key not found.');
    }

    const contactData = {
      ...formData,
      ...locationData,
      tags: ["Clinical Trial Screening", "Website Lead"],
      source: "Website Eligibility Form",
      notes: `Quick Eligibility Form Submission
Submitted at: ${new Date().toISOString()}
Location: ${locationData.city}, ${locationData.state}, ${locationData.postalCode}
Did Prescreen: ${!formData.skippedPrescreen}
Is Non-Alcoholic Fatty Liver: ${formData.isNonAlcoholicFattyLiver !== null ? (formData.isNonAlcoholicFattyLiver ? "Yes" : "No") : "Skipped"}
On Ozempic/Wegovy/Mounjaro/Phentermine: ${formData.onSpecificMedications !== null ? (formData.onSpecificMedications ? "Yes" : "No") : "Skipped"}
On Methotrexate/Amiodarone/Prednisone: ${formData.onOtherMedications !== null ? (formData.onOtherMedications ? "Yes" : "No") : "Skipped"}
Has Autoimmune Liver Treatment: ${formData.hasAutoimmuneLiverTreatment !== null ? (formData.hasAutoimmuneLiverTreatment ? "Yes" : "No") : "Skipped"}
Has Cancer History: ${formData.hasCancerHistory !== null ? (formData.hasCancerHistory ? "Yes" : "No") : "Skipped"}`
    };

    const ghlResponse = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ghlApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error('GoHighLevel API error:', ghlResponse.status, errorText);
      throw new Error(`Failed to submit to GoHighLevel: ${ghlResponse.status}`);
    }
    const ghlResult = await ghlResponse.json();
    if (isDev) console.log('GoHighLevel API success:', ghlResult);


    // --- 3. Submit to Facebook Conversions API ---
    const userData = {
      email: formData.email,
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      city: locationData.city,
      state: locationData.state,
      zipCode: locationData.postalCode,
      country: locationData.country
    };
    
    const customData = {
        formName: 'Clinical Trial Screening Form',
        value: 100,
        currency: 'USD',
        contentCategory: 'Clinical Trial Lead',
        eligibility_status: formData.skippedPrescreen ? 'skipped_prescreen' : 'completed_prescreen',
        is_non_alcoholic_fatty_liver: formData.isNonAlcoholicFattyLiver,
        on_specific_medications: formData.onSpecificMedications,
        study_type: 'Clinical Trial Screening'
    };
    
    await fbAPI.sendEvent({
      eventName: 'Lead',
      eventId: eventId, // For deduplication
      userData,
      customData,
      sourceUrl: referer,
      userAgent,
      clientIpAddress: ip
    });
    
    if (isDev) console.log('Facebook Conversions API event ("Lead") sent successfully.');

    return NextResponse.json({ success: true, message: 'Lead submitted successfully' });

  } catch (error) {
    console.error('API route /api/submit-lead error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 