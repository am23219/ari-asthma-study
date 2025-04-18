// app/sitemap.js

// Replace 'YOUR_WEBSITE_URL' with your actual domain, e.g., 'https://www.yourdomain.com'
const URL = 'YOUR_WEBSITE_URL'; 

export default function sitemap() {
  return [
    {
      url: URL,
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