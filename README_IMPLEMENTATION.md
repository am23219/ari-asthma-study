# GoHighLevel One-Time Booking Link Implementation

## ✅ What Has Been Implemented

### 1. **Instant Booking Flow**
- After users submit their contact information, the app now calls a new API route that uses LeadConnector's "Generate One Time Booking Link" endpoint.
- The generated link is embedded directly on the page so users can schedule immediately without re‑entering their details.

### 2. **Fallback Success State**
- If the booking link cannot be created for any reason, the form falls back to a simple success message and our team will follow up manually.

### 3. **Code Updates**
- Restored booking link state management and the booking step in the form component.
- Added server route `app/api/gohighlevel/generate-booking-link/route.js` to talk to the LeadConnector API.

## 🔧 Files Modified

### `app/components/LeadCaptureForm.jsx`
- Added logic to request a one‑time booking link after contact submission.
- Displays an embedded scheduling widget when the link is returned.

### `app/api/gohighlevel/generate-booking-link/route.js`
- New API route that hits the LeadConnector endpoint and provides a fallback to the normal widget.


### Environment

Set the `GOHIGHLEVEL_API_KEY` variable in `.env.local` to your GoHighLevel API key (the legacy name `GHL_API_KEY` also works). Without this value the booking link route will respond with a 500 error.


