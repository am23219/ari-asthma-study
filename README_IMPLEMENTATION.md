# GoHighLevel One-Time Booking Link Implementation

## ✅ What Has Been Implemented

### 1. **New Lead Capture Strategy Flow**
- **Updated Flow**: After eligibility check, users see a qualified step with two options:
  - **"Schedule My Screening"** - Direct path to instant booking
  - **"Talk to someone first"** - Contact form with time preferences

### 2. **Instant Booking Path**
- **One-Click Booking**: Calendar opens immediately when user clicks "Schedule My Screening"
- **Direct Action**: No intermediate steps - calendar opens directly in new tab
- User enters their information once in the booking calendar
- **Better UX**: Full-screen calendar experience, especially friendly for older users
- **Requires GHL Workflow Setup**: Configure a GoHighLevel workflow to automatically tag contacts who book through this calendar as "Scheduled via Instant CTA", "UC Study", "Website Lead"
- Calendar URL: `https://api.leadconnectorhq.com/widget/booking/E0iPfKdrbUfDrCUCCXb8`

### 3. **Contact First Path**
- Shows enhanced contact form with time preferences
- Includes dropdown for preferred contact time:
  - Morning (8 AM - 12 PM)
  - Afternoon (12 PM - 5 PM)  
  - Evening (5 PM - 8 PM)
  - Anytime
- Tags contact as "Talk to Someone First", "UC Study", "Website Lead"
- Shows message: "We'll reach out within 1 business day. You can also check your email/text for a link to schedule on your own time."

### 4. **Enhanced Tracking**
- **Facebook Events**: Tracks "InstantBookingChosen" and "ContactFirstChosen" events
- **GHL Tags**: Automatically applies appropriate tags based on user choice
- **User Path Tracking**: Records whether user chose instant booking or contact first

### 5. **Backend Updates**
- Updated submit-lead API to handle new fields:
  - `userPath`: Tracks which path user chose
  - `preferredTime`: Stores preferred contact time
  - `tags`: Array of tags based on user choice
- Enhanced notes in GHL with user path and preferred time information

## 🔧 Files Modified

### `app/components/LeadCaptureForm.jsx`
- Added new qualified step showing two options
- Implemented instant booking flow with contact form first
- Added contact form with time preferences
- Enhanced state management for user path tracking
- Added new event handlers for both paths

### `app/api/submit-lead/route.js`
- Updated to handle tags array from frontend
- Added user path and preferred time to GHL notes
- Enhanced contact data structure

## 📋 New Form Flow

### Previous Flow:
1. Eligibility Questions → 2. Contact Form → 3. Booking Calendar

### New Flow:
1. **Eligibility Questions** 
2. **Qualified Step** (New!)
   - "Schedule My Screening" OR "Talk to someone first"
3a. **Instant Booking Path**: Calendar opens immediately in new tab → Confirmation page
3b. **Contact First Path**: Enhanced Contact Form → Success Message

## 🎯 GHL Tags Applied

### Instant Booking Path:
- "UC Study"
- "Website Lead"  
- "Scheduled via Instant CTA"

### Contact First Path:
- "UC Study"
- "Website Lead"
- "Talk to Someone First"

## 📊 Tracking Events

### Facebook Pixel Events:
- `InstantBookingChosen`: When user selects instant booking
- `ContactFirstChosen`: When user selects contact first
- `Lead`: When form is submitted (existing)

### GHL Data:
- User path (instant/contact)
- Preferred contact time
- All existing eligibility data

## 🔧 Required GoHighLevel Workflow Setup

### For Instant Booking Path:
Since the instant booking path shows the calendar directly, you need to set up a GoHighLevel workflow to automatically tag contacts who book through this specific calendar:

1. **Create Workflow**: "Tag Instant Booking Contacts"
2. **Trigger**: "Appointment Booked"
3. **Filter**: Calendar ID = "E0iPfKdrbUfDrCUCCXb8"
4. **Action**: Add Tags
   - "Scheduled via Instant CTA"
   - "UC Study"
   - "Website Lead"

This ensures that users who choose the instant booking path get the proper tags for tracking and follow-up.

## 🚀 Next Steps

1. **Test the new flow** on development server
2. **Verify GHL integration** with new tags
3. **Monitor conversion rates** for both paths
4. **Set up GHL workflows** to handle different user paths appropriately

## 💡 Benefits

- **Higher Conversion**: Two clear paths cater to different user preferences
- **Better Tracking**: Clear distinction between instant bookers and contact-first users
- **Improved UX**: More personalized experience based on user choice, no redundant forms
- **Staff Efficiency**: Automatic tagging helps prioritize follow-ups
- **Streamlined Booking**: Instant booking users only enter their info once in the calendar
- **One-Click Action**: Calendar opens immediately - no extra steps or buttons
- **Accessibility**: Calendar opens in new tab for better experience, especially for older users
- **No Iframe Issues**: Eliminates scrolling problems and cramped embedded calendar experience


