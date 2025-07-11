import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Script from 'next/script';
import FacebookPixel from './components/FacebookPixel';

const SITE_URL = process.env.SITE_URL || 'https://amariuc.netlify.app';
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

if (!FB_PIXEL_ID) {
  console.warn(
    'NEXT_PUBLIC_FACEBOOK_PIXEL_ID is not set; Facebook Pixel noscript tag will not render.'
  );
}

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Severe Asthma Clinical Trial | The IMAGINE Study | Access Research Institute",
  description: "Learn about the IMAGINE Study, a clinical trial for a new, long-acting treatment for severe asthma. Find out about eligibility, benefits, and how to enroll. Help advance asthma research with Access Research Institute.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Severe Asthma Clinical Trial | The IMAGINE Study | Access Research Institute",
    description: "Learn about the IMAGINE Study, a clinical trial for a new, long-acting treatment for severe asthma. Find out about eligibility, benefits, and how to enroll. Help advance asthma research with Access Research Institute.",
    url: '/',
    siteName: 'Access Research Institute',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'A doctor explaining a new asthma treatment to a patient.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Severe Asthma Clinical Trial | The IMAGINE Study | Access Research Institute",
    description: "Learn about the IMAGINE Study, a clinical trial for a new, long-acting treatment for severe asthma. Find out about eligibility, benefits, and how to enroll. Help advance asthma research with Access Research Institute.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  structuredData: {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Severe Asthma Clinical Trial | The IMAGINE Study | Access Research Institute",
    "description": "Learn about the IMAGINE Study, a clinical trial for a new, long-acting treatment for severe asthma. Find out about eligibility, benefits, and how to enroll. Help advance asthma research with Access Research Institute.",
    "url": SITE_URL,
    "publisher": {
      "@type": "Organization",
      "name": "Access Research Institute",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`
      }
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
                  "url": SITE_URL,
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
                  "@id": SITE_URL,
                  "url": SITE_URL,
                  "name": "Severe Asthma Clinical Trial | The IMAGINE Study | Access Research Institute",
                  "description": "Learn about the IMAGINE Study, a clinical trial for a new, long-acting treatment for severe asthma. Find out about eligibility, benefits, and how to enroll. Help advance asthma research with Access Research Institute.",
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
      <body className="antialiased bg-white-soft text-text-main font-body scroll-smooth" suppressHydrationWarning={true}>
        {/* Facebook Pixel noscript fallback */}
        {FB_PIXEL_ID && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
        <FacebookPixel />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
