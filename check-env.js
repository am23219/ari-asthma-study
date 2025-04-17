/**
 * This script checks if environment variables are properly loaded
 * Run with: node check-env.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

console.log('===== Environment Variables Check =====');
console.log('GoHighLevel API Key exists:', !!process.env.GOHIGHLEVEL_API_KEY);
if (process.env.GOHIGHLEVEL_API_KEY) {
  const key = process.env.GOHIGHLEVEL_API_KEY;
  console.log('  API key length:', key.length);
  console.log('  API key first 10 chars:', key.substring(0, 10) + '...');
  console.log('  API key last 10 chars:', '...' + key.substring(key.length - 10));
} else {
  console.error('  ERROR: GoHighLevel API key is missing!');
}

console.log('\nFacebook Pixel ID exists:', !!process.env.FACEBOOK_PIXEL_ID);
if (process.env.FACEBOOK_PIXEL_ID) {
  console.log('  Pixel ID:', process.env.FACEBOOK_PIXEL_ID);
} else {
  console.error('  ERROR: Facebook Pixel ID is missing!');
}

console.log('\nFacebook Conversions API Token exists:', !!process.env.FACEBOOK_CONVERSIONS_API_TOKEN);
if (process.env.FACEBOOK_CONVERSIONS_API_TOKEN) {
  const token = process.env.FACEBOOK_CONVERSIONS_API_TOKEN;
  console.log('  Token length:', token.length);
  console.log('  Token first 10 chars:', token.substring(0, 10) + '...');
  console.log('  Token last 10 chars:', '...' + token.substring(token.length - 10));
} else {
  console.error('  ERROR: Facebook Conversions API Token is missing!');
}

console.log('\n===== Filesystem Check =====');
const fs = require('fs');
const path = require('path');

// Check if leads directory exists and is writeable
const leadsDir = path.join(process.cwd(), 'leads');
console.log('Leads directory exists:', fs.existsSync(leadsDir));
if (fs.existsSync(leadsDir)) {
  try {
    fs.accessSync(leadsDir, fs.constants.W_OK);
    console.log('Leads directory is writeable: Yes');
  } catch (err) {
    console.error('Leads directory is writeable: No');
    console.error('Error:', err.message);
  }
} else {
  console.log('Attempting to create leads directory...');
  try {
    fs.mkdirSync(leadsDir, { recursive: true });
    console.log('Leads directory created successfully');
  } catch (err) {
    console.error('Failed to create leads directory');
    console.error('Error:', err.message);
  }
}

// Write a test file to the leads directory
try {
  const testFile = path.join(leadsDir, 'test-env-check.json');
  fs.writeFileSync(testFile, JSON.stringify({ test: true, timestamp: new Date().toISOString() }));
  console.log('Test file written successfully to leads directory');
  
  // Clean up test file
  fs.unlinkSync(testFile);
  console.log('Test file cleaned up');
} catch (err) {
  console.error('Failed to write test file to leads directory');
  console.error('Error:', err.message);
}

console.log('\n===== Check Complete ====='); 