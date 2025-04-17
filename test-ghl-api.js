// Test script for GoHighLevel API
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testGoHighLevelAPI() {
  try {
    console.log('Testing GoHighLevel API connection...');
    
    // Check if API key exists and log a masked version for debugging
    const apiKey = process.env.GOHIGHLEVEL_API_KEY;
    if (!apiKey) {
      console.error('API key is missing in .env.local file');
      return;
    }
    
    // Log a masked version of the API key for debugging
    const maskedKey = apiKey.length > 8 
      ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
      : '********';
    console.log('Using API key (masked):', maskedKey);
    console.log('API key length:', apiKey.length);
    
    // First, try to get the account info to verify the API key
    try {
      console.log('\nTesting API key validity with GET request...');
      const accountResponse = await axios.get(
        'https://rest.gohighlevel.com/v1/users/me/',
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Account info request successful!');
      console.log('Response status:', accountResponse.status);
      console.log('User info:', accountResponse.data);
    } catch (accountError) {
      console.error('Account info request failed:');
      if (accountError.response) {
        console.error('Status:', accountError.response.status);
        console.error('Data:', accountError.response.data);
      } else {
        console.error(accountError.message);
      }
    }
    
    // Test data for contact creation
    console.log('\nTesting contact creation...');
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      tags: ["API Test"],
      source: "API Test"
    };
    
    // Make the API request to create a contact
    const response = await axios.post(
      'https://rest.gohighlevel.com/v1/contacts/',
      testData,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Contact creation successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    // If we got here, the test was successful
    console.log('\nAPI test completed successfully!');
  } catch (error) {
    console.error('\nTest failed with error:');
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('\nAUTHENTICATION ERROR (401):');
        console.error('Your API key is invalid or expired. Please check the following:');
        console.error('1. Verify you have copied the correct API key from GoHighLevel');
        console.error('2. Make sure you have the necessary permissions in your GoHighLevel account');
        console.error('3. Check if your API key has been revoked or regenerated recently');
        console.error('4. Ensure you are using a Location API key, not an Agency API key (if applicable)');
      }
    } else if (error.request) {
      console.error('No response received from server. Check your internet connection.');
    } else {
      console.error('Error message:', error.message);
    }
  }
}

testGoHighLevelAPI(); 