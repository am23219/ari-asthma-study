import "./globals.css";
import Navbar from "./components/Navbar";
import Script from 'next/script';
import Image from 'next/image';
import FacebookPixel from './components/FacebookPixel';

export const metadata = {
  title: "Fatty Liver & NASH/MASH Clinical Trials | Access Research Institute",
  description: "Explore clinical trials and studies for Fatty Liver and NASH/MASH treatments. Learn about participation benefits and enrollment. Access Research Institute is a leading provider of clinical research services.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Facebook Pixel Code - Base Code */}
        <Script
          id="facebook-pixel-base"
          strategy="beforeInteractive"
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
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "name": "Access Research Institute",
                  "url": "YOUR_WEBSITE_URL", // <-- Replace with your actual URL
                  // Optional: Add logo, address, telephone etc.
                  // "logo": "URL_TO_YOUR_LOGO.png",
                  // "address": {
                  //   "@type": "PostalAddress",
                  //   "streetAddress": "...",
                  //   "addressLocality": "...",
                  //   "addressRegion": "...",
                  //   "postalCode": "...",
                  //   "addressCountry": "..."
                  // },
                  // "telephone": "+1-XXX-XXX-XXXX"
                },
                {
                  "@type": "MedicalWebPage",
                  "@id": "YOUR_WEBSITE_URL", // <-- Replace with your actual URL
                  "url": "YOUR_WEBSITE_URL", // <-- Replace with your actual URL
                  "name": "Fatty Liver & NASH/MASH Clinical Trials | Access Research Institute",
                  "description": "Explore clinical trials and studies for Fatty Liver and NASH/MASH treatments. Learn about participation benefits and enrollment. Access Research Institute is a leading provider of clinical research services.",
                  "publisher": {
                    "@type": "Organization",
                    "name": "Access Research Institute"
                  },
                  "inLanguage": "en-US"
                  // Consider adding MedicalAudience, specialty etc. if applicable
                }
              ]
            }),
          }}
        />
      </head>
      <body className="antialiased bg-white-soft text-text-main font-body" suppressHydrationWarning>
        {/* Facebook Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1398933401301342&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <FacebookPixel />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
