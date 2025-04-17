import "./globals.css";
import Navbar from "./components/Navbar";
import GoogleAnalytics from "./components/GoogleAnalytics";
import Script from 'next/script';
import Image from 'next/image';
import { GoogleTagManager } from '@next/third-parties/google'

export const metadata = {
  title: "UC Study",
  description: "Join our clinical study to improve ulcerative colitis treatment and care",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <GoogleTagManager gtmId="GTM-ML5FRTWF" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body className="antialiased bg-background text-foreground" suppressHydrationWarning>
        <GoogleAnalytics />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
