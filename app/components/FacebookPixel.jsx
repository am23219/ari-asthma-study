'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const isDev = process.env.NODE_ENV !== 'production';

export default function FacebookPixel() {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Log for debugging
      if (isDev) {
        console.log('Initializing Facebook Pixel...');
      }
      
      // Initialize Facebook Pixel only if not already initialized
      if (!window.fbq) {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      
        // Initialize with your Pixel ID
        const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
        if (pixelId) {
          window.fbq('init', pixelId);
          if (isDev) {
            console.log('Facebook Pixel initialized with ID:', pixelId);
          }
        } else {
          console.warn('Facebook Pixel ID is not configured in environment variables.');
        }
      }

      // Track initial page view. The Conversions API counterpart is handled by the server on first load.
      window.fbq('track', 'PageView');
    }
  }, []);

  return null; // No need to render anything since pixel is loaded via script
}

/**
 * Tracks a standard Facebook Pixel event on the client-side.
 * Server-side events (like 'Lead') are handled via the /api/submit-lead endpoint for better data and deduplication.
 * @param {string} eventName - Facebook event name (e.g., 'ViewContent', 'AddToCart')
 * @param {Object} params - Event parameters for the pixel.
 * @param {Object} [options] - Optional parameters for the event, like eventID for deduplication.
 * @param {string} [options.eventID] - A unique ID for the event to enable deduplication.
 */
export function trackFbPixelEvent(eventName, params = {}, options = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    if (isDev) {
      console.log(`Tracking FB Pixel event: ${eventName}`, { params, options });
    }
    
    // Send to client-side pixel with optional event ID
    window.fbq('track', eventName, params, options);

  } else {
    if (isDev) {
      console.error('Facebook Pixel not initialized yet or not available, cannot track event:', eventName);
    }
  }
} 