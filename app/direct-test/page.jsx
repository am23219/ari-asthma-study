import axios from 'axios';

export const dynamic = 'force-dynamic'; // Ensure this page is not cached

async function testGhlApi() {
  try {
    // Use the hardcoded API key for direct testing
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlFJalUwNkVsV0xoUUtLWE9WS1pUIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQyMTk2OTYxNzc1LCJzdWIiOiJ3cnpDc082QmUxdzhNVFJmcTRwTiJ9.X3COjVHC9q8RjdrGMzl-ZlBaD2aZHx8Vxt4l5JNtkQE";
    
    // Create a test contact
    const testContact = {
      firstName: 'Direct',
      lastName: 'Test',
      email: `direct_test_${Date.now()}@example.com`, 
      phone: '555-555-5555',
      tags: ["Direct Server Test"],
      source: "Direct Server Test",
      notes: "This is a test contact created directly from the server page."
    };
    
    // Make the API request
    const response = await axios.post(
      'https://rest.gohighlevel.com/v1/contacts/',
      testContact,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Test failed:', error);
    return {
      success: false,
      errorMessage: error.message,
      errorStatus: error.response?.status,
      errorData: error.response?.data
    };
  }
}

export default async function DirectTestPage() {
  const testResult = await testGhlApi();
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Direct Server Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        
        {testResult.success ? (
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded">
            <p className="font-semibold text-green-800 dark:text-green-200">
              ✅ Success! Contact created in GoHighLevel.
            </p>
            <p className="mt-2 text-green-700 dark:text-green-300">
              This confirms your API key and GoHighLevel integration are working.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded">
            <p className="font-semibold text-red-800 dark:text-red-200">
              ❌ Test Failed
            </p>
            <p className="mt-2 text-red-700 dark:text-red-300">
              Error: {testResult.errorMessage}
            </p>
            {testResult.errorStatus && (
              <p className="text-red-700 dark:text-red-300">
                Status: {testResult.errorStatus}
              </p>
            )}
          </div>
        )}
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Complete Result:</h3>
          <pre className="p-3 bg-gray-200 dark:bg-gray-700 rounded overflow-auto text-sm">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">How This Works</h2>
        <p className="mb-2">
          This is a server-side test page that directly calls the GoHighLevel API to create a test contact.
          It uses the same API key and endpoint that your form uses.
        </p>
        <p className="mb-2">
          If this test succeeds but your form still doesn't work:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>The issue is likely with the form submission process, not the API key or GoHighLevel integration</li>
          <li>Check the server logs for any errors related to the form submission</li>
          <li>Try submitting a test from the <a href="/api-test" className="text-blue-500 hover:underline">client-side test page</a></li>
        </ul>
      </div>
    </div>
  );
} 