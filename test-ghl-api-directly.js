// Script to directly test the GoHighLevel API
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testGoHighLevelApi() {
  console.log('=== TESTING GOHIGHLEVEL API DIRECTLY ===');
  
  // Get the API key from environment variables
  const apiKey = process.env.GOHIGHLEVEL_API_KEY;
  
  if (!apiKey) {
    console.error('GoHighLevel API key is missing in environment variables');
    return;
  }
  
  // Log a masked version of the API key for debugging
  const maskedKey = apiKey.length > 8 
    ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
    : '********';
  console.log('Using API key (masked):', maskedKey);
  
  // Test contact data
  const contactData = {
    firstName: 'Direct',
    lastName: 'Test',
    email: 'direct.test@example.com',
    phone: '1234567890',
    tags: ["API Test"],
    source: "Direct API Test"
  };
  
  try {
    console.log('Sending request to GoHighLevel API...');
    console.log('Contact data:', contactData);
    
    // Send request directly to GoHighLevel API
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
    
    console.log('\nResponse status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.id) {
      console.log('\nContact created successfully!');
      console.log('Contact ID:', response.data.id);
      
      // Test custom field update
      const customField = {
        name: "testField",
        value: "Test Value"
      };
      
      console.log('\nUpdating custom field...');
      console.log('Custom field:', customField);
      
      const updateResponse = await axios.put(
        `https://rest.gohighlevel.com/v1/contacts/${response.data.id}/custom-field`,
        customField,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Custom field update status:', updateResponse.status);
      console.log('Custom field update response:', JSON.stringify(updateResponse.data, null, 2));
    } else {
      console.log('\nContact created but no ID returned');
    }
  } catch (error) {
    console.error('\nError making API request:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      
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
  }
}

// Run the test
testGoHighLevelApi(); 