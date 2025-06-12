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
        window.fbq('init', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1398933401301342');
      
      // Log for debugging
        if (isDev) {
          console.log('Facebook Pixel initialized with ID:', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1398933401301342');
        }
      }

      // Track initial page view with event ID for deduplication
      const pageViewEventId = `pageview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      window.fbq('track', 'PageView', {}, { eventID: pageViewEventId });
      
      // Also send to Conversions API for server-side tracking
      sendToConversionsAPI('PageView', {}, {}, pageViewEventId);
    }
  }, []);

  return null; // No need to render anything since pixel is loaded via script
}

/**
 * Send event to Facebook Conversions API for server-side tracking
 */
async function sendToConversionsAPI(eventName, userData = {}, customData = {}, eventId = null) {
  try {
    const response = await fetch('/api/facebook/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        userData,
        customData,
        eventId: eventId || `${eventName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }),
    });

    if (!response.ok) {
      console.error('Failed to send event to Conversions API:', response.statusText);
    } else {
      const result = await response.json();
      if (isDev) {
        console.log('Event sent to Conversions API:', result);
      }
    }
  } catch (error) {
    console.error('Error sending event to Conversions API:', error);
  }
}

/**
 * Track Facebook Pixel event with automatic deduplication
 * This function sends events to both the client-side pixel and server-side Conversions API
 * @param {string} eventName - Facebook event name (e.g., 'Lead', 'Purchase', 'ViewContent')
 * @param {Object} params - Event parameters for the pixel
 * @param {Object} userData - User data for server-side tracking (email, phone, etc.)
 * @param {Object} customData - Custom data for server-side tracking
 */
export function trackFbPixelEvent(eventName, params = {}, userData = {}, customData = {}) {
  // Generate unique event ID for deduplication
  const eventId = `${eventName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  if (typeof window !== 'undefined' && window.fbq) {
    if (isDev) {
      console.log(`Tracking FB Pixel event: ${eventName}`, params);
    }
    
    // Send to client-side pixel with event ID
    window.fbq('track', eventName, params, { eventID: eventId });
    
    // Send to server-side Conversions API
    sendToConversionsAPI(eventName, userData, customData, eventId);
  } else {
    console.error('Facebook Pixel not initialized yet or not available');
  }
}

/**
 * Track a lead event (form submission)
 * @param {Object} userData - User data (email, phone, name, etc.)
 * @param {Object} customData - Additional data (value, content_name, etc.)
 */
export function trackLead(userData = {}, customData = {}) {
  trackFbPixelEvent('Lead', {
    content_name: customData.formName || 'Contact Form',
    value: customData.value || undefined,
    currency: customData.currency || 'USD'
  }, userData, customData);
}

/**
 * Track a page view event
 * @param {string} pageUrl - URL of the page being viewed
 * @param {Object} userData - User data if available
 */
export function trackPageView(pageUrl = window.location.href, userData = {}) {
  const eventId = `pageview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  if (typeof window !== 'undefined' && window.fbq) {
    // Client-side tracking
    window.fbq('track', 'PageView', {}, { eventID: eventId });
    
    // Server-side tracking
    fetch('/api/facebook/pageview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userData,
        pageUrl
      }),
    }).catch(error => {
      console.error('Error tracking page view on server:', error);
    });
  }
}

/**
 * Track a custom event
 * @param {string} eventName - Custom event name
 * @param {Object} params - Event parameters
 * @param {Object} userData - User data for server-side tracking
 * @param {Object} customData - Custom data for server-side tracking
 */
export function trackCustomEvent(eventName, params = {}, userData = {}, customData = {}) {
  trackFbPixelEvent(eventName, params, userData, customData);
} 