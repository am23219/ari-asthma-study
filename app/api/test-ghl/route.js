import axios from 'axios';

export async function GET() {
  try {
    // Use the hardcoded API key for testing
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlFJalUwNkVsV0xoUUtLWE9WS1pUIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQyMTk2OTYxNzc1LCJzdWIiOiJ3cnpDc082QmUxdzhNVFJmcTRwTiJ9.X3COjVHC9q8RjdrGMzl-ZlBaD2aZHx8Vxt4l5JNtkQE";
    
    // Also check the environment variable
    const envApiKey = process.env.GOHIGHLEVEL_API_KEY;
    
    // Create a test contact for diagnostic purposes
    const testContact = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test' + Date.now() + '@example.com',  // Make email unique to avoid duplicates
      phone: '555-555-5555',
      tags: ["API Test", "Diagnostic"],
      source: "API Test",
      notes: "This is a test contact created to diagnose API issues."
    };
    
    // Test with hardcoded key
    let hardcodedKeyResponse = null;
    let hardcodedKeyError = null;
    try {
      hardcodedKeyResponse = await axios.post(
        'https://rest.gohighlevel.com/v1/contacts/',
        testContact,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      hardcodedKeyError = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
    
    // Test with env variable key
    let envKeyResponse = null;
    let envKeyError = null;
    
    if (envApiKey) {
      try {
        envKeyResponse = await axios.post(
          'https://rest.gohighlevel.com/v1/contacts/',
          {
            ...testContact,
            email: 'test_env_' + Date.now() + '@example.com', // Different email
          },
          {
            headers: {
              'Authorization': `Bearer ${envApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (error) {
        envKeyError = {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        };
      }
    }
    
    // Return the test results
    return Response.json({
      success: true,
      message: "GoHighLevel API test completed",
      hardcodedKeyTest: {
        keyExists: !!apiKey,
        keyLength: apiKey?.length,
        success: !!hardcodedKeyResponse,
        error: hardcodedKeyError,
        response: hardcodedKeyResponse ? {
          status: hardcodedKeyResponse.status,
          data: hardcodedKeyResponse.data
        } : null
      },
      envKeyTest: {
        keyExists: !!envApiKey,
        keyLength: envApiKey?.length,
        success: !!envKeyResponse,
        error: envKeyError,
        response: envKeyResponse ? {
          status: envKeyResponse.status,
          data: envKeyResponse.data
        } : null
      }
    });
  } catch (error) {
    console.error('Error testing GoHighLevel API:', error);
    return Response.json({
      success: false,
      message: "Error testing GoHighLevel API",
      error: error.message
    }, { status: 500 });
  }
} 