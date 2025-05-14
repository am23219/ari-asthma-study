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
        <FacebookPixel />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
