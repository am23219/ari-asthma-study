// app/robots.js

const SITE_URL = process.env.SITE_URL || 'https://amarimash.netlify.app';

export default function robots() {
  return {
    rules: {
      userAgent: '*', // Applies to all user agents (crawlers)
      allow: '/', // Allows crawling of all paths
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
