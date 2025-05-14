import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta tags and other head elements can go here */}
      </Head>
      <body>
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