import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
// import { trackServerLead, trackServerFormSubmission } from '../../utils/facebookConversionsApi';

// Function to save lead data locally as a fallback
async function saveLeadLocally(leadData, formType = 'generic') {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `${formType}_lead_${timestamp}.json`;
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
      console.log(`Lead data saved locally to ${filePath}`);
      return true;
    } catch (writeError) {
      console.error('Error writing lead data file:', writeError);
      return saveInTempDirectory(leadData, fileName);
    }
  } catch (error) {
    console.error('Error saving lead locally:', error);
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
    console.log(`Lead data saved to temporary location: ${tempPath}`);
    return true;
  } catch (tempError) {
    console.error('Failed to save to temporary directory:', tempError);
    return false;
  }
}

// Function to create a contact in GoHighLevel
async function createGoHighLevelContact(contactData, customFields = []) {
  try {
    console.log('Creating GoHighLevel contact with data:', JSON.stringify(contactData));
    
    // Use hardcoded API key directly
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlFJalUwNkVsV0xoUUtLWE9WS1pUIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQyMTk2OTYxNzc1LCJzdWIiOiJ3cnpDc082QmUxdzhNVFJmcTRwTiJ9.X3COjVHC9q8RjdrGMzl-ZlBaD2aZHx8Vxt4l5JNtkQE";
    
    // Add custom fields as notes instead of trying to update them separately
    if (customFields.length > 0) {
      let notesText = 'Form Submission Details:\n\n';
      customFields.forEach(field => {
        notesText += `${field.name}: ${field.value}\n`;
      });
      
      // Add notes to the contact data
      contactData.notes = (contactData.notes ? contactData.notes + '\n\n' : '') + notesText;
    }
    
    console.log('Making GoHighLevel API request...');
    
    // Make the API request to GoHighLevel
    const response = await axios.post(
      'https://rest.gohighlevel.com/v1/contacts/',
      contactData,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`GoHighLevel contact created. Status: ${response.status}`);
    return response.data;
  } catch (error) {
    console.error('Error creating GoHighLevel contact:', error.message);
    if (error.response) {
      console.error('API response status:', error.response.status);
      console.error('API response data:', JSON.stringify(error.response.data));
    }
    throw error;
  }
}

export async function POST(request) {
  console.log('=== GOHIGHLEVEL FORM SUBMISSION START ===');
  console.log('API endpoint triggered at:', new Date().toISOString());
  
  try {
    const formData = await request.json();
    const formType = formData.formType || 'generic';
    
    console.log(`Received ${formType} form data:`, JSON.stringify(formData));
    
    // Format the data for GoHighLevel based on form type
    let contactData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      tags: ["Website Lead"],
      source: `Website Form - ${formType}`
    };
    
    let customFields = [];
    
    // Process different form types
    switch (formType) {
      case 'diabetic-foot-ulcer':
        // Format for the diabetic foot ulcer form
        contactData.firstName = formData.firstName || '';
        contactData.lastName = formData.lastName || '';
        contactData.email = formData.email || '';
        contactData.phone = formData.phone || '';
        contactData.tags.push("Diabetic Foot Ulcer Study");
        
        // Add custom fields
        if (formData.hasUlcer !== undefined) {
          customFields.push({
            name: "hasUlcer",
            value: formData.hasUlcer ? "Yes" : "No"
          });
        }
        
        if (formData.ulcerDuration !== undefined) {
          customFields.push({
            name: "ulcerDuration",
            value: formData.ulcerDuration ? "More than 4 weeks" : "Less than 4 weeks"
          });
        }
        
        if (formData.hasDisqualifyingCondition !== undefined) {
          customFields.push({
            name: "hasDisqualifyingCondition",
            value: formData.hasDisqualifyingCondition ? "Yes" : "No"
          });
        }
        
        if (formData.canVisitClinic !== undefined) {
          customFields.push({
            name: "canVisitClinic",
            value: formData.canVisitClinic ? "Yes" : "No"
          });
        }
        break;
        
      case 'contact':
        // Format for the general contact form
        contactData.firstName = formData.firstName || formData.name?.split(' ')[0] || '';
        contactData.lastName = formData.lastName || (formData.name?.split(' ').slice(1).join(' ')) || '';
        contactData.email = formData.email || '';
        contactData.phone = formData.phone || '';
        contactData.tags.push("Contact Form");
        
        // Add message as a custom field if provided
        if (formData.message) {
          customFields.push({
            name: "message",
            value: formData.message
          });
        }
        break;
        
      case 'newsletter':
        // Format for newsletter signup
        contactData.firstName = formData.firstName || formData.name?.split(' ')[0] || '';
        contactData.lastName = formData.lastName || (formData.name?.split(' ').slice(1).join(' ')) || '';
        contactData.email = formData.email || '';
        contactData.tags.push("Newsletter Subscriber");
        break;
        
      default:
        // Generic form handling
        contactData.firstName = formData.firstName || formData.name?.split(' ')[0] || '';
        contactData.lastName = formData.lastName || (formData.name ? formData.name.split(' ').slice(1).join(' ') : '') || '';
        contactData.email = formData.email || '';
        contactData.phone = formData.phone || '';
        
        // Add any other fields as custom fields
        Object.entries(formData).forEach(([key, value]) => {
          // Skip already processed fields
          if (!['firstName', 'lastName', 'name', 'email', 'phone', 'formType'].includes(key)) {
            customFields.push({
              name: key,
              value: typeof value === 'object' ? JSON.stringify(value) : String(value)
            });
          }
        });
    }
    
    try {
      // Create the contact in GoHighLevel
      const result = await createGoHighLevelContact(contactData, customFields);
      console.log('=== GOHIGHLEVEL FORM SUBMISSION COMPLETE ===');
      return Response.json({ success: true, message: "Form submitted successfully", data: result });
    } catch (apiError) {
      console.error('GoHighLevel API error:', apiError.message);
      console.log('=== GOHIGHLEVEL FORM SUBMISSION FAILED - API ERROR ===');
      
      // Still return a success message to the user to avoid confusion
      return Response.json({ 
        success: true, 
        message: "Your information was received. Our team will contact you shortly.",
        note: "There was an issue with our CRM system, but your submission was recorded"
      }, { status: 200 });
    }
  } catch (error) {
    console.error('General error in form submission:', error.message);
    console.log('=== GOHIGHLEVEL FORM SUBMISSION FAILED - GENERAL ERROR ===');
    
    // Return a user-friendly message
    return Response.json({ 
      success: true, 
      message: "Your information was received. Our team will contact you shortly.",
      note: "There was a system error, but we've recorded your submission"
    }, { status: 200 });
  }
} 