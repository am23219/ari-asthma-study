'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function FacebookPixel() {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Log for debugging
      console.log('Initializing Facebook Pixel...');
      
      // Reset any existing fbq to avoid duplication issues
      window.fbq = undefined;
      
      // Initialize Facebook Pixel
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      
      // Initialize with your Pixel ID
      window.fbq('init', '1398933401301342');
      
      // Track PageView
      window.fbq('track', 'PageView');
      
      // Log for debugging
      console.log('Facebook Pixel initialized with ID: 1398933401301342');
    }
  }, []);

  return (
    <>
      {/* Add the base pixel code as a script tag with Next.js Script component */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1398933401301342');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1398933401301342&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  );
}

// Helper function to track custom events
export function trackFbPixelEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    console.log(`Tracking FB Pixel event: ${eventName}`, params);
    window.fbq('track', eventName, params);
  } else {
    console.error('Facebook Pixel not initialized yet or not available');
  }
} 