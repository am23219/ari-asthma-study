// app/robots.js

// Replace 'YOUR_WEBSITE_URL' with your actual domain, e.g., 'https://www.yourdomain.com'
const URL = 'YOUR_WEBSITE_URL';

export default function robots() {
  return {
    rules: {
      userAgent: '*', // Applies to all user agents (crawlers)
      allow: '/', // Allows crawling of all paths
      // disallow: '/admin/', // Example: uncomment to disallow crawling of /admin path
    },
    sitemap: `${URL}/sitemap.xml`, // Location of your sitemap
  };
} 