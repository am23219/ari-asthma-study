# Facebook Pixel & Conversions API Setup Guide

## 🎯 Overview

This implementation provides a complete Facebook tracking solution with:
- **Client-side Facebook Pixel** for browser-based tracking
- **Server-side Conversions API** for reliable, privacy-compliant tracking
- **Automatic deduplication** to prevent double-counting events
- **Easy-to-use React hooks** for form and event tracking

## 🚀 Features

✅ **Dual Tracking**: Client-side pixel + server-side API  
✅ **Deduplication**: Uses event IDs to prevent duplicate events  
✅ **Privacy Compliant**: Works with iOS 14.5+ and ad blockers  
✅ **Form Integration**: Easy tracking for lead generation  
✅ **Custom Events**: Track any user interaction  
✅ **Error Handling**: Graceful fallbacks and detailed logging  

## 📋 Prerequisites

1. Facebook Business Manager account
2. Facebook Pixel created in Events Manager
3. Access to Facebook Conversions API

## 🔧 Setup Instructions

### Step 1: Environment Variables

Create a `.env.local` file in your project root:

```env
# Facebook Pixel Configuration
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=1398933401301342

# Facebook Conversions API Configuration
FACEBOOK_ACCESS_TOKEN=your_access_token_here
FACEBOOK_BUSINESS_ID=your_business_id_here
FACEBOOK_DATASET_ID=your_dataset_id_here

# Optional: Test Event Code for debugging
FACEBOOK_TEST_EVENT_CODE=your_test_event_code_here
```

### Step 2: Get Your Facebook Credentials

#### Facebook Access Token
1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Navigate to **Business Settings** → **System Users**
3. Create a new system user or select existing one
4. Generate a token with these permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`

#### Facebook Business ID
1. In Facebook Business Manager, go to **Business Settings**
2. Your Business ID is displayed at the top of the page

#### Facebook Dataset ID
1. Go to **Events Manager** in Business Manager
2. Select your Pixel
3. Navigate to **Settings** → **Conversions API**
4. Your Dataset ID is listed there

#### Test Event Code (Optional)
1. In Events Manager, go to **Test Events**
2. Create a test event code for debugging

### Step 3: Verify Installation

Run the development server:
```bash
npm run dev
```

Check browser console for:
```
✅ Facebook Pixel initialized with ID: 1398933401301342
✅ Event sent to Conversions API: {success: true, eventId: "..."}
```

## 📊 Usage Examples

### Basic Form Tracking

```jsx
import { useFacebookTracking } from '../hooks/useFacebookTracking';

function ContactForm() {
  const { trackFormSubmission } = useFacebookTracking();

  const handleSubmit = async (formData) => {
    // Your form submission logic
    await submitForm(formData);
    
    // Track the lead
    await trackFormSubmission(formData, {
      formName: 'Contact Form',
      value: 50, // Lead value in USD
      contentCategory: 'Lead Generation'
    });
  };

  return (
    // Your form JSX
  );
}
```

### Custom Event Tracking

```jsx
import { trackCustomEvent } from '../components/FacebookPixel';

// Track button clicks
const handleButtonClick = () => {
  trackCustomEvent('ButtonClick', {
    button_name: 'Get Started',
    page: window.location.pathname
  });
};

// Track video plays
const handleVideoPlay = () => {
  trackCustomEvent('ViewContent', {
    content_type: 'video',
    content_name: 'Clinical Trial Overview'
  });
};
```

### Advanced Form Integration

```jsx
import { useFacebookTracking, useFormTracking } from '../hooks/useFacebookTracking';

function AdvancedForm() {
  const { trackFormSubmission } = useFacebookTracking();
  const { trackFieldFocus, trackFormStart } = useFormTracking('Registration Form');

  return (
    <form onSubmit={handleSubmit}>
      <input
        onFocus={() => trackFieldFocus('email')}
        onChange={handleChange}
        // ...
      />
      {/* More form fields */}
    </form>
  );
}
```

## 🔍 Testing Your Implementation

### 1. Facebook Events Manager
1. Go to Events Manager in Facebook Business Manager
2. Select your Pixel
3. Check **Events** tab for incoming events
4. Verify both browser and server events appear

### 2. Facebook Pixel Helper (Chrome Extension)
1. Install Facebook Pixel Helper browser extension
2. Visit your website
3. Check that pixel fires correctly
4. Verify event parameters

### 3. Test Events
1. Use your test event code in development
2. Check **Test Events** in Events Manager
3. Verify server-side events appear

### 4. Browser Console
Look for these success messages:
```
✅ Facebook Pixel initialized
✅ Event sent to Conversions API
✅ Lead tracked successfully
```

## 📁 File Structure

```
app/
├── components/
│   ├── FacebookPixel.jsx          # Main pixel component
│   └── ExampleTrackedForm.jsx     # Example implementation
├── hooks/
│   └── useFacebookTracking.js     # React hooks for tracking
├── lib/
│   └── facebook-conversions-api.js # Server-side API service
└── api/
    └── facebook/
        ├── track/route.js          # Generic event tracking
        ├── pageview/route.js       # Page view tracking
        └── lead/route.js           # Lead tracking
```

## 🛠️ API Endpoints

### POST `/api/facebook/track`
Generic event tracking endpoint.

**Body:**
```json
{
  "eventName": "Purchase",
  "userData": {
    "email": "user@example.com",
    "phone": "+1234567890"
  },
  "customData": {
    "value": 99.99,
    "currency": "USD"
  },
  "eventId": "purchase_123456"
}
```

### POST `/api/facebook/lead`
Specialized lead tracking endpoint.

**Body:**
```json
{
  "userData": {
    "email": "lead@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "formName": "Contact Form",
  "leadValue": 50
}
```

### POST `/api/facebook/pageview`
Page view tracking endpoint.

**Body:**
```json
{
  "userData": {
    "email": "user@example.com"
  },
  "pageUrl": "https://yoursite.com/page"
}
```

## 🔒 Privacy & Compliance

- **Data Hashing**: User data is automatically hashed by Facebook SDK
- **GDPR Compliant**: Respects user consent preferences
- **iOS 14.5+ Ready**: Server-side tracking bypasses iOS limitations
- **Ad Blocker Resistant**: Conversions API works even when pixel is blocked

## 🐛 Troubleshooting

### Common Issues

**1. "Missing credentials" error**
- Verify `.env.local` file exists and contains correct values
- Restart development server after adding environment variables

**2. Events not appearing in Facebook**
- Check Facebook Pixel ID is correct
- Verify access token has proper permissions
- Check console for error messages

**3. Duplicate events**
- Ensure eventId is unique for each event
- Check that pixel and API use same event ID

**4. Server-side events failing**
- Verify Conversions API credentials
- Check API endpoint responses in Network tab
- Review server logs for errors

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will show detailed tracking information in the browser console.

## 📈 Best Practices

1. **Always use event IDs** for deduplication
2. **Include user data** when available for better matching
3. **Assign values to leads** for ROI tracking
4. **Test thoroughly** before going live
5. **Monitor Events Manager** regularly
6. **Use descriptive event names** for custom events

## 🔄 Migration from Existing Pixel

If you already have a Facebook Pixel installed:

1. Remove existing pixel code from your HTML
2. Update pixel ID in environment variables
3. Replace `fbq()` calls with our tracking functions
4. Test to ensure no duplicate events

## 📞 Support

For issues with this implementation:
1. Check browser console for errors
2. Verify Facebook Events Manager
3. Review this documentation
4. Check Facebook's Conversions API documentation

---

**✨ Your Facebook Pixel and Conversions API setup is now complete!**

Both client-side and server-side tracking are working together to provide the most reliable and privacy-compliant tracking possible. 