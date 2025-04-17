'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testStatus, setTestStatus] = useState('not-started');
  
  const runGhlTest = async () => {
    setLoading(true);
    setError(null);
    setTestStatus('running');
    
    try {
      // Create a test contact directly from the browser
      const testData = {
        firstName: 'Test',
        lastName: 'User',
        email: `test_${Date.now()}@example.com`,
        phone: '555-555-5555',
        hasUlcer: true,
        ulcerDuration: 'More than 1 month',
        hasDisqualifyingCondition: false,
        canVisitClinic: true,
        questions: 'This is a test submission from the API test page.'
      };
      
      // Call the regular form submission endpoint
      const response = await axios.post('/api/submit-consult', testData);
      
      setTestResults(response.data);
      setTestStatus(response.data.success ? 'success' : 'failed');
      console.log('Response data:', response.data);
    } catch (err) {
      setError(err.message);
      setTestStatus('failed');
      console.error('Test failed:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Integration Test</h1>
      
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">GoHighLevel Integration Test</h2>
        <p className="mb-4">
          This test will attempt to create a test contact in GoHighLevel using the same endpoint 
          that the consultation form uses.
        </p>
        
        <button 
          onClick={runGhlTest}
          disabled={loading}
          className={`px-4 py-2 rounded font-medium ${
            loading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {loading ? 'Running Test...' : 'Run GoHighLevel Test'}
        </button>
        
        {testStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">
            <p className="font-semibold">Test Successful!</p>
            <p>The test contact was successfully created in GoHighLevel.</p>
          </div>
        )}
        
        {testStatus === 'failed' && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded">
            <p className="font-semibold">Test Failed</p>
            <p>{error || 'There was an error creating the test contact in GoHighLevel.'}</p>
          </div>
        )}
        
        {testResults && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">API Response:</h3>
            <pre className="p-3 bg-gray-200 dark:bg-gray-700 rounded overflow-auto text-sm">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
        <p>
          <strong>Test URL:</strong> <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">/api-test</code>
        </p>
        <p className="mt-2">
          <strong>Form Submission Endpoint:</strong> <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">/api/submit-consult</code>
        </p>
        <p className="mt-6">
          If the test above was successful, then your form integration with GoHighLevel is working correctly.
          If it failed, check the console logs for more detailed error information.
        </p>
      </div>
    </div>
  );
} 