'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TestPopupForm() {
  const [formData, setFormData] = useState({
    name: 'Test User',
    phone: '555-555-5555',
    testNotes: 'This is a test submission from the popup test page'
  });
  
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      console.log('Sending test data to /api/submit-quick-consult:', formData);
      
      // Submit to the quick consult API endpoint
      const response = await axios.post('/api/submit-quick-consult', formData, {
        // Add timeout to prevent long-hanging requests
        timeout: 10000
      });
      
      console.log('Response received:', response.data);
      setTestResult(response.data);
    } catch (error) {
      console.error('Error submitting test form:', error);
      
      // Set detailed error information
      setError({
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Alternative test using fetch instead of axios
  const handleSubmitWithFetch = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      console.log('Sending test data to /api/submit-quick-consult using fetch:', formData);
      
      const response = await fetch('/api/submit-quick-consult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      console.log('Fetch response received:', data);
      setTestResult({
        ...data,
        _fetchMethod: true
      });
    } catch (error) {
      console.error('Error submitting test form with fetch:', error);
      setError({
        message: error.message,
        _fetchMethod: true
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Direct test making a request to the GoHighLevel API
  const handleDirectApiTest = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      console.log('Testing direct API call to GoHighLevel');
      
      // Format the data for GoHighLevel
      const contactData = {
        firstName: formData.name.split(' ')[0] || '',
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
        phone: formData.phone,
        tags: ["Website Lead", "Test Call"],
        source: "API Test",
        notes: "Direct API test from test-popup page"
      };
      
      const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlFJalUwNkVsV0xoUUtLWE9WS1pUIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQyMTk2OTYxNzc1LCJzdWIiOiJ3cnpDc082QmUxdzhNVFJmcTRwTiJ9.X3COjVHC9q8RjdrGMzl-ZlBaD2aZHx8Vxt4l5JNtkQE";
      
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
      
      setTestResult({
        success: true,
        message: "Direct API call successful",
        _directApi: true,
        data: response.data
      });
    } catch (error) {
      console.error('Error making direct API call:', error);
      setError({
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null,
        _directApi: true
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Popup Form Test</h1>
      
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Test Notes</label>
            <input
              type="text"
              name="testNotes"
              value={formData.testNotes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test with Axios'}
            </button>
            
            <button
              type="button"
              onClick={handleSubmitWithFetch}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              Test with Fetch
            </button>
            
            <button
              type="button"
              onClick={handleDirectApiTest}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
            >
              Direct API Test
            </button>
          </div>
        </form>
      </div>
      
      {testResult && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Test Result:</h3>
          <pre className="bg-white dark:bg-slate-800 p-3 rounded-md overflow-auto text-sm">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Error:</h3>
          <pre className="bg-white dark:bg-slate-800 p-3 rounded-md overflow-auto text-sm">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
        <p className="mb-4">
          This test page helps identify why the popup form isn't connecting to GoHighLevel by:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Testing with Axios (same as the popup form)</li>
          <li>Testing with Fetch (alternative method)</li>
          <li>Testing direct API call to GoHighLevel (bypassing your API)</li>
        </ul>
        <p className="mt-4">
          If the direct API test works but the others fail, the issue is in your API implementation.
          If all tests fail, there may be an issue with the API key or network connectivity.
        </p>
      </div>
    </div>
  );
} 