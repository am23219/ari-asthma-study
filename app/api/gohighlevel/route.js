import { NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV !== 'production';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { formType, firstName, lastName, email, phone } = body;
    
    if (!firstName || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: firstName, email, and phone are required' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GOHIGHLEVEL_API_KEY;
    
    if (!apiKey) {
      console.error('GoHighLevel API key not configured');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Prepare contact data for GoHighLevel
    const contactData = {
      firstName,
      lastName,
      email,
      phone,
      tags: ["NASH/MASH Study", "Website Lead"],
      source: "Website Eligibility Form",
      notes: `Eligibility Form Submission
Submitted at: ${new Date().toISOString()}
Form Type: ${formType || 'Unknown'}
Did Prescreen: ${body.hasDiagnosis !== undefined}
Has MASH/NASH Diagnosis: ${body.hasDiagnosis !== null ? (body.hasDiagnosis ? "Yes/Maybe" : "Definitely Not") : "Skipped"}
Has Other Liver Disease: ${body.hasOtherLiverDisease !== null ? (body.hasOtherLiverDisease ? "Yes" : "No") : "Skipped"}
Pregnancy Status (if applicable): ${body.pregnancyStatus !== null ? (body.pregnancyStatus ? "Yes" : "No") : "Skipped"}
Recent Cardiac Event: ${body.hadRecentCardiacEvent !== null ? (body.hadRecentCardiacEvent ? "Yes" : "No") : "Skipped"}`
    };

    // Make API call to GoHighLevel
    const ghlResponse = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      console.error('GoHighLevel API error:', ghlResponse.status, errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Failed to submit to GoHighLevel: ${ghlResponse.status}` 
        },
        { status: 500 }
      );
    }

    const result = await ghlResponse.json();
    if (isDev) {
      console.log('GoHighLevel API success:', result);
    }

    return NextResponse.json({
      success: true,
      message: 'Contact successfully submitted',
      contactId: result.contact?.id
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 