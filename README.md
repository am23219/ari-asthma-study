This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## GoHighLevel CRM Integration

This project integrates with the Denali Health Plant City GoHighLevel CRM for lead capture. 

### Quick Setup

The easiest way to set up the GoHighLevel integration is to use the provided setup script:

```bash
# Using Node.js
node setup-env.js

# Using npm
npm run ghl:setup
```

This interactive script will:
- Guide you through obtaining your GoHighLevel API key
- Create or update your `.env.local` file with the API key
- Provide instructions for testing the integration

### Manual Setup

To set up the integration manually:

1. Obtain your GoHighLevel API key:
   - Go to your GoHighLevel account
   - Navigate to Location Level > Settings > Business Info
   - Or Agency Level > Agency Settings > API Keys to view all Location API keys in one place
   - **IMPORTANT**: GoHighLevel has updated their API token system. If you see an error message like "Unauthorized, Switch to the new API token", you need to generate a new API token in your GoHighLevel account.

2. Create a `.env.local` file in the root directory (if it doesn't exist)

3. Add the following environment variable:
   ```
   GOHIGHLEVEL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlFJalUwNkVsV0xoUUtLWE9WS1pUIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQyMTgzNzgzOTUwLCJzdWIiOiJ3cnpDc082QmUxdzhNVFJmcTRwTiJ9.JTgLghIWk_hR3dgetNGYExNtwP5yOpl_QEQnjyxpJ1w
   ```
   
4. Replace `your_api_key_here` with your actual GoHighLevel API key

5. Make sure the custom fields used in the form (hasUlcer, ulcerDuration, hasDisqualifyingCondition, canVisitClinic) are created in your GoHighLevel account

   **Note about Custom Fields**: For custom fields to be updated properly, they must be created in your GoHighLevel account first. If the custom fields don't exist, the contact will still be created, but the custom field data won't be saved. You can create custom fields in GoHighLevel by going to Settings > Custom Fields.

6. If you encounter a 401 authentication error:
   - Verify you're using a newly generated API key from GoHighLevel
   - Ensure you have the proper permissions in your account
   - If using an older account, you may need to contact GoHighLevel support to help migrate to their new API token system

### Centralized Form Integration

All forms on the website can be connected to GoHighLevel using the centralized API endpoint. Here's how to use it:

#### Option 1: Direct API Call

```javascript
// Submit form data to GoHighLevel
const response = await fetch('/api/gohighlevel', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    formType: 'your-form-type', // e.g., 'contact', 'newsletter', etc.
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    // Any additional fields will be added as custom fields
    customField1: 'value1',
    customField2: 'value2'
  }),
});

const result = await response.json();
```

#### Option 2: Using the Utility Function

```javascript
import { submitToGoHighLevel } from '@/app/utils/gohighlevel';

// In your form submit handler
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    // Any additional fields
  };
  
  const result = await submitToGoHighLevel(formData, 'your-form-type');
  
  if (result.success) {
    // Handle success
  } else {
    // Handle error
  }
};
```

#### Option 3: Using the React Hook

```javascript
import { useGoHighLevelForm } from '@/app/utils/gohighlevel';

function YourFormComponent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const { 
    handleSubmit, 
    isSubmitting, 
    submitStatus, 
    errorMessage 
  } = useGoHighLevelForm(
    // Success callback
    (result) => {
      console.log('Form submitted successfully!', result);
      // Reset form, show success message, etc.
    },
    // Error callback
    (error) => {
      console.error('Form submission failed:', error);
    }
  );
  
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData, 'your-form-type');
  };
  
  // Rest of your component...
}
```

### Supported Form Types

The centralized API supports different form types with specific field mappings:

1. **diabetic-foot-ulcer**: For the diabetic foot ulcer study form
   - Custom fields: hasUlcer, ulcerDuration, hasDisqualifyingCondition, canVisitClinic

2. **contact**: For general contact forms
   - Custom fields: message (and any additional fields)

3. **newsletter**: For newsletter signup forms
   - No specific custom fields, just basic contact info

4. **generic**: Default form type for any other forms
   - All non-standard fields are added as custom fields

### Fallback Solution for CRM Integration Issues

If the GoHighLevel CRM integration fails (due to API key issues, network problems, etc.), the system will automatically save lead information locally in a `leads` directory. This ensures that no lead information is lost, even if there are problems with the CRM connection.

To check for locally saved leads:

1. Run the following command:
   ```
   node check-local-leads.js
   ```

2. This will display all leads that have been saved locally and need to be manually entered into the CRM

3. The leads are stored as JSON files in the `leads` directory, with timestamps in the filenames

When deploying to production, make sure to add this environment variable to your hosting platform (e.g., Vercel).

### Testing the GoHighLevel Integration

Three scripts are provided to test and manage the GoHighLevel integration:

#### 1. Complete System Test

The `test-ghl-system.js` script runs a complete test of the GoHighLevel integration system:

```bash
# Using Node.js
node test-ghl-system.js

# Using npm
npm run ghl:test
```

This script will:
- Run the GoHighLevel integration test with sample data
- Check for any locally saved leads
- Provide a comprehensive overview of the entire system

This is the recommended script to run when setting up or troubleshooting the integration.

#### 2. Testing the API Integration

The `test-ghl-integration.js` script allows you to test the GoHighLevel integration with sample data for different form types:

```bash
node test-ghl-integration.js
```

This script will:
- Test all supported form types (diabetic-foot-ulcer, contact, newsletter, and custom)
- Format the data according to each form type's requirements
- Submit the data to GoHighLevel
- Handle any errors and save failed submissions locally
- Display detailed logs of the process

#### 3. Managing Locally Saved Leads

The `check-local-leads.js` script provides tools to manage leads that were saved locally when the GoHighLevel API submission failed:

```bash
# Using Node.js
# Display all locally saved leads
node check-local-leads.js

# Using npm
npm run ghl:check-leads

# Display help information
node check-local-leads.js --help

# Retry submitting a specific lead
node check-local-leads.js --retry <filename>

# Retry submitting all leads (not implemented yet)
node check-local-leads.js --retry-all
```

This script will:
- Display detailed information about each locally saved lead
- Show the form type, contact information, custom fields, and error details
- Provide options to retry submitting leads to GoHighLevel (placeholder functionality)

These scripts are particularly useful for:
- Testing the GoHighLevel integration during setup
- Troubleshooting API issues
- Ensuring no leads are lost due to temporary API or network problems
- Manually processing leads that couldn't be automatically submitted
# alzh-landing-page
# am-ari-mash
# am-ari-uc
# am-ari-uc
