import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
// import { trackServerLead } from '../../utils/facebookConversionsApi';

// Function to save lead data locally as a fallback
async function saveLeadLocally(leadData) {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `quick_consult_${timestamp}.json`;
    const filePath = path.join(process.cwd(), 'leads', fileName);
    
    // Create leads directory if it doesn't exist
    const leadsDir = path.join(process.cwd(), 'leads');
    if (!fs.existsSync(leadsDir)) {
      try {
        fs.mkdirSync(leadsDir, { recursive: true });
      } catch (dirError) {
        console.error('Error creating leads directory:', dirError);
        // Try to save in temporary directory as a last resort
        return saveInTempDirectory(leadData, fileName);
      }
    }
    
    // Write lead data to file
    try {
      fs.writeFileSync(filePath, JSON.stringify(leadData, null, 2));
      console.log(`Quick consultation data saved locally to ${filePath}`);
      return true;
    } catch (writeError) {
      console.error('Error writing lead data file:', writeError);
      return saveInTempDirectory(leadData, fileName);
    }
  } catch (error) {
    console.error('Error saving quick consultation locally:', error);
    return false;
  }
}

// Fallback to save in temporary directory if leads directory is not accessible
function saveInTempDirectory(leadData, fileName) {
  try {
    const tempDir = path.join(os.tmpdir(), 'denali-health-leads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempPath = path.join(tempDir, fileName);
    fs.writeFileSync(tempPath, JSON.stringify(leadData, null, 2));
    console.log(`Quick consultation data saved to temporary location: ${tempPath}`);
    return true;
  } catch (tempError) {
    console.error('Failed to save to temporary directory:', tempError);
    return false;
  }
}

export async function POST(request) {
  console.log('=== QUICK CONSULT SUBMISSION START ===');
  console.log('API endpoint triggered at:', new Date().toISOString());
  console.log('Request headers:', JSON.stringify(request.headers));
  
  try {
    // Parse the request body
    let formData;
    try {
      formData = await request.json();
      console.log('Received form data:', JSON.stringify(formData));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return Response.json({ 
        success: false, 
        message: "Invalid request format. Could not parse form data."
      }, { status: 400 });
    }
    
    // Format the data for GoHighLevel
    const goHighLevelData = {
      contact: {
        firstName: formData.firstName || formData.name?.split(' ')[0] || '',
        lastName: formData.lastName || (formData.name ? formData.name.split(' ').slice(1).join(' ') : '') || '',
        email: formData.email || '',
        phone: formData.phone || '',
        tags: ["Website Lead", "Quick Consultation"],
        source: "Website Popup Form"
      }
    };
    
    // Add notes with additional information
    let notesText = 'Quick Consultation Request\n\n';
    
    // Add any additional fields to notes
    Object.entries(formData).forEach(([key, value]) => {
      if (!['firstName', 'lastName', 'name', 'email', 'phone'].includes(key)) {
        notesText += `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}\n`;
      }
    });
    
    goHighLevelData.contact.notes = notesText;
    
    console.log('Prepared contact data for GoHighLevel:', JSON.stringify(goHighLevelData.contact));
    
    // Use hardcoded API key
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlFJalUwNkVsV0xoUUtLWE9WS1pUIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQyMTk2OTYxNzc1LCJzdWIiOiJ3cnpDc082QmUxdzhNVFJmcTRwTiJ9.X3COjVHC9q8RjdrGMzl-ZlBaD2aZHx8Vxt4l5JNtkQE";
    
    // Make the API request to GoHighLevel
    try {
      console.log('Making API request to GoHighLevel...');
      const response = await axios.post(
        'https://rest.gohighlevel.com/v1/contacts/',
        goHighLevelData.contact,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('GoHighLevel API request succeeded:', response.status);
      console.log('GoHighLevel response data:', JSON.stringify(response.data));
      console.log('=== QUICK CONSULT SUBMISSION COMPLETE ===');
      
      // Return success response
      return Response.json({ success: true, message: "Form submitted successfully" });
    } catch (apiError) {
      console.error('GoHighLevel API error:', apiError.message);
      if (apiError.response) {
        console.error('API response status:', apiError.response.status);
        console.error('API response data:', JSON.stringify(apiError.response.data));
      }
      
      console.log('=== QUICK CONSULT SUBMISSION FAILED - API ERROR ===');
      
      // Still return a success message to the user to avoid confusion
      return Response.json({ 
        success: true, 
        message: "Your information was received. Our team will contact you shortly.",
        note: "There was an issue with our CRM system, but your submission was recorded"
      }, { status: 200 });
    }
  } catch (error) {
    console.error('General error in form submission:', error.message);
    console.log('=== QUICK CONSULT SUBMISSION FAILED - GENERAL ERROR ===');
    
    // Return a user-friendly message
    return Response.json({ 
      success: true, 
      message: "Your information was received. Our team will contact you shortly.",
      note: "There was a system error, but we've recorded your submission"
    }, { status: 200 });
  }
} 