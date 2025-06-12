'use client';

import { useState, useEffect } from 'react';
import { trackFbPixelEvent } from './components/FacebookPixel';

const isDev = process.env.NODE_ENV !== 'production';

export default function PixelTest() {
  const [eventFired, setEventFired] = useState(false);

  useEffect(() => {
    // Fire a test PageView event when the component mounts
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
      if (isDev) {
        console.log('Test page loaded - PageView event fired');
      }
    } else {
      console.error('Facebook Pixel not available on test page load');
    }
  }, []);

  const fireTestEvent = () => {
    trackFbPixelEvent('Lead', {
      content_name: 'Test Lead Event',
      content_category: 'Test'
    });
    setEventFired(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Facebook Pixel Test Page</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">About This Page</h2>
        <p className="mb-4">
          This page is designed to test if the Facebook Pixel is properly implemented on your website.
          Open your browser&apos;s developer console to see debugging information.
        </p>
        <p className="mb-4">
          You should also use Facebook&apos;s Pixel Helper browser extension to verify events are being sent.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Test Manual Event</h2>
        <button
          onClick={fireTestEvent}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fire Test Lead Event
        </button>
        
        {eventFired && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
            Test event fired! Check your browser console and Facebook Pixel Helper.
          </div>
        )}
      </div>

      <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
        <p className="mb-2">
          If your pixel is working correctly, you should see:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Events in the Facebook Pixel Helper</li>
          <li>Console logs showing initialization and events</li>
          <li>Events appearing in your Facebook Events Manager (may take a few minutes)</li>
        </ul>
      </div>
    </div>
  );
} 