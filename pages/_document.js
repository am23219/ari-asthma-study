import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta Pixel Code */}
        <script
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
        {/* End Meta Pixel Code */}
      </Head>
      <body>
        {/* Meta Pixel Code */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1398933401301342&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove any data attributes added by browser extensions
              window.addEventListener('DOMContentLoaded', () => {
                const images = document.querySelectorAll('img[data--h-bstatus], img[data--h-bresult]');
                images.forEach(img => {
                  img.removeAttribute('data--h-bstatus');
                  img.removeAttribute('data--h-bresult');
                  img.removeAttribute('data--h-bfrom-bx');
                });
              });
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 