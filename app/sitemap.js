// app/sitemap.js

const SITE_URL = process.env.SITE_URL || 'https://amariuc.netlify.app';

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly', // Adjust as needed ('yearly', 'daily', 'weekly', 'always', 'never')
      priority: 1, // Priority from 0.0 to 1.0
    },
    // Add more URLs for other public pages here
    // Example:
    // {
    //   url: `${URL}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.8,
    // },
  ];
} 
