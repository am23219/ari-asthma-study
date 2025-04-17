// Test script for GoHighLevel integration
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Sample form data for different form types
const testForms = [
  {
    formType: 'uc-study',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    hasUlcer: true,
    ulcerDuration: true,
    hasDisqualifyingCondition: false,
    canVisitClinic: true
  },
  {
    formType: 'contact',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '0987654321',
    message: 'I would like more information about the study.'
  },
  {
    formType: 'newsletter',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com'
  },
  {
    formType: 'custom',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '5551234567',
    interest: 'Research',
    referralSource: 'Google'
  }
];

// Function to simulate the API route
async function processForm(formData) {
  try {
    console.log(`\nProcessing ${formData.formType} form...`);
    
    // Format the data for GoHighLevel based on form type
    let contactData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      tags: ["Website Lead"],
      source: `Website Form - ${formData.formType}`
    };
    
    let customFields = [];
    
    // Process different form types
    switch (formData.formType) {
      case 'uc-study':
        // Format for the uc study form
        contactData.firstName = formData.firstName || '';
        contactData.lastName = formData.lastName || '';
        contactData.email = formData.email || '';
        contactData.phone = formData.phone || '';
        contactData.tags.push("UC Study");
        
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
        contactData.lastName = formData.lastName || (formData.name?.split(' ').slice(1).join(' ')) || '';
        contactData.email = formData.email || '';
        contactData.phone = formData.phone || '';
        
        // Process any additional fields as custom fields
        Object.keys(formData).forEach(key => {
          // Skip standard fields and formType
          if (!['firstName', 'lastName', 'name', 'email', 'phone', 'formType'].includes(key)) {
            customFields.push({
              name: key,
              value: typeof formData[key] === 'boolean' 
                ? (formData[key] ? "Yes" : "No") 
                : String(formData[key])
            });
          }
        });
        break;
    }
    
    console.log('Contact data:', contactData);
    console.log('Custom fields:', customFields);
    
    // Check if API key exists
    const apiKey = process.env.GOHIGHLEVEL_API_KEY;
    if (!apiKey) {
      throw new Error('GoHighLevel API key is missing in environment variables');
    }
    
    // Log a masked version of the API key for debugging
    const maskedKey = apiKey.length > 8 
      ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
      : '********';
    console.log('Using API key (masked):', maskedKey);
    
    try {
      // Create the contact in GoHighLevel
      console.log('Sending request to GoHighLevel...');
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
      
      console.log('Contact created successfully!');
      console.log('Response status:', response.status);
      console.log('Contact ID:', response.data.contact?.id);
      
      // If contact creation was successful and we have custom fields, update them
      if (response.data && response.data.contact && response.data.contact.id && customFields.length > 0) {
        const contactId = response.data.contact.id;
        
        console.log('Updating custom fields...');
        
        try {
          // Update custom fields for the contact
          // Note: In newer versions of GoHighLevel API, custom fields need to be created in the account first
          for (const field of customFields) {
            try {
              await axios.put(
                `https://rest.gohighlevel.com/v1/contacts/${contactId}/custom-field`,
                field,
                {
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              console.log(`Custom field "${field.name}" updated successfully`);
            } catch (fieldError) {
              console.warn(`Warning: Could not update custom field "${field.name}": ${fieldError.message}`);
              if (fieldError.response) {
                console.warn('Status:', fieldError.response.status);
                console.warn('Data:', fieldError.response.data);
              }
              // Continue with other fields even if one fails
            }
          }
          console.log('Custom fields update process completed');
        } catch (customFieldError) {
          console.warn('Warning: Could not update custom fields:', customFieldError.message);
          // Continue with the process even if custom fields update fails
        }
      }
      
      return { success: true, contactId: response.data.contact?.id };
    } catch (error) {
      console.error('Error creating contact in GoHighLevel:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        
        if (error.response.status === 401) {
          console.error('\nAUTHENTICATION ERROR (401):');
          console.error('Your API key is invalid or expired. Please check the following:');
          console.error('1. Verify you have copied the correct API key from GoHighLevel');
          console.error('2. Make sure you have the necessary permissions in your GoHighLevel account');
          console.error('3. Check if your API key has been revoked or regenerated recently');
        }
      } else {
        console.error(error.message);
      }
      
      // Save lead locally as fallback
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const fileName = `lead_${formData.formType}_${timestamp}.json`;
      const filePath = path.join(process.cwd(), 'leads', fileName);
      
      // Create leads directory if it doesn't exist
      const leadsDir = path.join(process.cwd(), 'leads');
      if (!fs.existsSync(leadsDir)) {
        fs.mkdirSync(leadsDir, { recursive: true });
      }
      
      // Write lead data to file
      fs.writeFileSync(filePath, JSON.stringify({
        formData,
        contactData,
        customFields,
        timestamp: new Date().toISOString(),
        error: error.response?.data || error.message
      }, null, 2));
      
      console.log(`Lead data saved locally to ${filePath}`);
      
      return { success: false, error: error.response?.data || error.message };
    }
  } catch (error) {
    console.error('Error processing form:', error.message);
    return { success: false, error: error.message };
  }
}

// Process each test form
async function runTests() {
  console.log('=== TESTING GOHIGHLEVEL INTEGRATION ===');
  
  for (const form of testForms) {
    const result = await processForm(form);
    console.log(`\nResult for ${form.formType} form:`, result.success ? 'SUCCESS' : 'FAILED');
    console.log('-----------------------------------');
  }
  
  console.log('\n=== TESTING COMPLETE ===');
}

runTests(); 