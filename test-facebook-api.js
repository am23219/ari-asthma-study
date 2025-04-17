// Test script for Facebook Conversions API
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const crypto = require('crypto');

// Function to hash data as required by Facebook
function hashData(input) {
  if (!input) return '';
  const normalizedInput = input.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalizedInput).digest('hex');
}

// Function to generate a unique event ID
function generateEventId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

async function testFacebookConversionsAPI() {
  try {
    console.log('Testing Facebook Conversions API connection...');
    
    // Check if API token and Pixel ID exist
    const token = process.env.FACEBOOK_CONVERSIONS_API_TOKEN;
    const pixelId = process.env.FACEBOOK_PIXEL_ID;
    
    if (!token) {
      console.error('Facebook Conversions API token is missing in .env.local file');
      return;
    }
    
    if (!pixelId) {
      console.error('Facebook Pixel ID is missing in .env.local file');
      return;
    }
    
    // Log a masked version of the token for debugging
    const maskedToken = token.length > 16 
      ? `${token.substring(0, 8)}...${token.substring(token.length - 8)}`
      : '********';
    console.log('Using Access Token (masked):', maskedToken);
    console.log('Using Pixel ID:', pixelId);
    
    // Prepare a test event
    const eventId = generateEventId();
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Test user data (this would come from your forms)
    const testUserData = {
      email: 'test@example.com',
      phone: '1234567890',
      firstName: 'Test',
      lastName: 'User',
    };
    
    // Prepare user data with proper hashing as required by Facebook
    const hashedUserData = {
      em: [hashData(testUserData.email)],
      ph: [hashData(testUserData.phone.replace(/\D/g, ''))],
      fn: [hashData(testUserData.firstName)],
      ln: [hashData(testUserData.lastName)],
      client_user_agent: 'Mozilla/5.0 Test Agent',
      client_ip_address: '127.0.0.1'
    };
    
    // Create a test Lead event
    const eventData = {
      event_name: 'Lead',
      event_time: timestamp,
      event_source_url: 'https://denali-health.com/test-page',
      event_id: eventId,
      user_data: hashedUserData,
      custom_data: {
        lead_type: 'test-lead',
        form_name: 'Test Form',
        value: 0,
        currency: 'USD'
      },
      action_source: 'website'
    };
    
    // Prepare the API request
    const requestData = {
      data: [eventData],
      access_token: token,
      
      // Remove this for production, use only while testing
      test_event_code: 'TEST12345',
    };
    
    console.log('\nSending test Lead event to Facebook...');
    
    // Send the API request
    const response = await axios.post(
      `https://graph.facebook.com/v16.0/${pixelId}/events`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Facebook API response status:', response.status);
    console.log('Facebook API response data:', response.data);
    
    if (response.data && response.data.events_received === 1) {
      console.log('\nTest successful! Facebook received the test event.');
      
      // Check for any warnings or messages
      if (response.data.fbtrace_id) {
        console.log('Facebook Trace ID:', response.data.fbtrace_id);
      }
    } else {
      console.warn('Warning: Facebook may not have properly processed the event.');
    }
    
    console.log('\nAPI test completed.');
  } catch (error) {
    console.error('\nTest failed with error:');
    
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      
      if (error.response.data && error.response.data.error) {
        console.error('\nFacebook API error details:');
        console.error('Error type:', error.response.data.error.type);
        console.error('Error message:', error.response.data.error.message);
        console.error('Error code:', error.response.data.error.code);
        console.error('Error subcode:', error.response.data.error.error_subcode);
        
        if (error.response.data.error.code === 190) {
          console.error('\nToken error: Your access token may be invalid or expired.');
          console.error('Please generate a new token from Facebook Business Manager.');
        }
      }
    } else if (error.request) {
      console.error('No response received from server. Check your internet connection.');
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testFacebookConversionsAPI(); 