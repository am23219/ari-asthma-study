// Script to directly test the API endpoint
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testApiEndpoint() {
  console.log('=== TESTING API ENDPOINT ===');
  
  // Test data for a newsletter signup
  const testData = {
    formType: 'newsletter',
    name: 'Test User',
    email: 'test@example.com'
  };
  
  try {
    console.log('Sending request to API endpoint...');
    console.log('Request data:', testData);
    
    // Send request to the API endpoint
    const response = await axios.post('http://localhost:3000/api/gohighlevel', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\nResponse status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data.success) {
      console.log('\nAPI call successful!');
      if (response.data.contactId) {
        console.log('Contact ID:', response.data.contactId);
      } else if (response.data.note === "Data was saved locally") {
        console.log('Note: Data was saved locally due to CRM issue');
      }
    } else {
      console.error('\nAPI call failed!');
      console.error('Error message:', response.data.message);
      if (response.data.error) {
        console.error('Error details:', response.data.error);
      }
    }
  } catch (error) {
    console.error('\nError making API request:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
testApiEndpoint(); 