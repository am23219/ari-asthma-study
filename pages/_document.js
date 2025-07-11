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
              (function() {
                function removeExtensionAttributes() {
                  const images = document.querySelectorAll('img');
                  images.forEach(img => {
                    // Remove common browser extension attributes
                    const attrs = img.getAttributeNames();
                    attrs.forEach(attr => {
                      if (attr.startsWith('data--h-') || attr.startsWith('data-h-')) {
                        img.removeAttribute(attr);
                      }
                    });
                  });
                }
                
                // Run immediately
                removeExtensionAttributes();
                
                // Run on DOMContentLoaded
                document.addEventListener('DOMContentLoaded', removeExtensionAttributes);
                
                // Run periodically to catch dynamically added images
                setInterval(removeExtensionAttributes, 1000);
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 