'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { GA_MEASUREMENT_ID, pageview } from '../utils/gtag';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  // Use a safer approach to handle searchParams
  const [searchParamsString, setSearchParamsString] = useState('');
  
  // Get search params safely
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search).toString();
      setSearchParamsString(searchParams ? `?${searchParams}` : '');
    } catch (e) {
      console.error('Error getting search params:', e);
      setSearchParamsString('');
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname) {
      const url = pathname + searchParamsString;
      pageview(url);
    }
  }, [pathname, searchParamsString]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
            gtag('config', 'AW-16915520694');
          `,
        }}
      />
    </>
  );
} 