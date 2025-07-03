# GoHighLevel Workflow Setup for One-Time Booking Links

## Overview

This guide explains how to set up a GoHighLevel workflow that will automatically generate and send personalized one-time booking links to users after they complete the eligibility form. This approach uses GoHighLevel's native workflow actions instead of API calls.

## Why This Approach?

GoHighLevel does not provide a direct API endpoint for generating one-time booking links. However, they do provide a **workflow action** called "Generate One Time Booking Link" that can be triggered automatically when a contact submits their information.

## Setup Steps

### 1. Create the Workflow

1. **Go to GoHighLevel Dashboard** → **Workflows** → **Create New Workflow**
2. **Name**: "Generate One-Time Booking Link After Form Submission"
3. **Choose**: "Start from Scratch" or look for a recipe if available

### 2. Set Up the Trigger

**Trigger**: Contact Created
- This will trigger when a new contact is created through the form submission
- **Alternative**: You can also use "Form Submitted" trigger if you prefer

**Filters** (Optional but recommended):
- **Source**: "Website Eligibility Form" (matches the source tag from our form)
- **Tags**: Contains "uc study" (matches the tags from our form)

### 3. Add Workflow Actions

Add these actions in sequence:

#### Action 1: Generate One Time Booking Link
- **Action Type**: "Generate One Time Booking Link"
- **Calendar**: Select your calendar (ID: E0iPfKdrbUfDrCUCCXb8)
- **Contact**: Use the trigger contact ({{contact.id}})
- **Store Result In**: Custom field called "booking_link" (create this custom field if it doesn't exist)

#### Action 2: Send Email with Booking Link
- **Action Type**: "Send Email"
- **To**: {{contact.email}}
- **Subject**: "Schedule Your UC Study Consultation - Personalized Link Inside"
- **Template**: Create a custom email template (see below)

#### Action 3: Send SMS with Booking Link (Optional)
- **Action Type**: "Send SMS"
- **To**: {{contact.phone}}
- **Message**: "Hi {{contact.first_name}}, thanks for your interest in our UC study! Here's your personalized booking link: {{contact.custom_fields.booking_link}}"

### 4. Email Template for Booking Link

Create a custom email template with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Schedule Your UC Study Consultation</title>
</head>
<body>
    <h2>Hi {{contact.first_name}},</h2>
    
    <p>Thank you for completing our UC study eligibility form!</p>
    
    <p>Based on your responses, you may be eligible for our clinical trial. The next step is to schedule a consultation with our team.</p>
    
    <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2c3e50;">📅 Schedule Your Consultation</h3>
        <p>We've created a personalized booking link just for you. This link will expire after you book your appointment to ensure your privacy.</p>
        
        <div style="text-align: center; margin: 20px 0;">
            <a href="{{contact.custom_fields.booking_link}}" 
               style="background-color: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Schedule My Consultation
            </a>
        </div>
    </div>
    
    <p><strong>What to expect:</strong></p>
    <ul>
        <li>A 15-30 minute consultation to discuss your eligibility</li>
        <li>Information about the study procedures</li>
        <li>Answers to any questions you may have</li>
        <li>Next steps if you qualify</li>
    </ul>
    
    <p>If you have any questions or need assistance scheduling, please don't hesitate to contact us directly.</p>
    
    <p>Best regards,<br>
    The UC Study Team</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>This booking link is personalized for you and will expire after use. If you need a new link, please contact us.</p>
    </div>
</body>
</html>
```

### 5. Custom Field Setup

Create a custom field to store the booking link:

1. **Go to**: Settings → Custom Fields
2. **Add New Field**:
   - **Name**: "Booking Link"
   - **API Name**: "booking_link"
   - **Type**: "Text"
   - **Description**: "One-time booking link for UC study consultation"

### 6. Test the Workflow

1. **Activate the Workflow**
2. **Test with a dummy contact**:
   - Create a test contact with the same source and tags
   - Check that the workflow triggers
   - Verify that the booking link is generated and stored
   - Confirm that the email is sent with the correct link

## Calendar Configuration

Make sure your calendar (E0iPfKdrbUfDrCUCCXb8) is configured properly:

1. **Calendar Settings**:
   - Enable "One Time Links" feature
   - Set appropriate availability
   - Configure meeting location (Zoom/Phone/Address)

2. **Notifications**:
   - Set up appointment confirmations
   - Configure reminders for both you and the contact

## Important Notes

### Security & Privacy
- One-time links expire after first use
- Each contact gets a unique, personalized link
- Links cannot be shared or reused

### Fallback Plan
- If the workflow fails, contacts will still receive follow-up calls
- Keep the manual booking process as backup
- Monitor workflow execution regularly

### Tracking & Analytics
- Track workflow completion rates
- Monitor booking conversion rates
- Set up notifications for workflow failures

## Troubleshooting

### Common Issues

1. **Workflow not triggering**:
   - Check trigger conditions (source, tags, etc.)
   - Verify the contact is created properly
   - Check workflow is active

2. **Booking link not generating**:
   - Verify calendar ID is correct
   - Check calendar permissions
   - Ensure "One Time Links" feature is enabled

3. **Email not sending**:
   - Check email template syntax
   - Verify custom field mapping
   - Check email deliverability settings

### Testing Tips

1. Use unique test email addresses
2. Check both email and SMS delivery
3. Test the actual booking flow with the generated link
4. Verify that links expire after use

## Next Steps

1. **Set up the workflow** as described above
2. **Test thoroughly** with dummy contacts
3. **Monitor performance** for the first few days
4. **Optimize based on results** (open rates, booking rates, etc.)

## Benefits of This Approach

- ✅ **Automated**: No manual intervention required
- ✅ **Personalized**: Each contact gets their own unique link
- ✅ **Secure**: Links expire after use
- ✅ **Scalable**: Works for unlimited contacts
- ✅ **Native**: Uses GoHighLevel's built-in functionality
- ✅ **Trackable**: Full analytics on workflow performance

This workflow approach ensures that every eligible contact receives a personalized booking link immediately after form submission, maximizing your booking conversion rate while maintaining security and privacy. 