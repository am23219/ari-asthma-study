import { useState } from 'react';

/**
 * Utility function to submit form data to GoHighLevel CRM
 * @param {Object} formData - The form data to submit
 * @param {string} formType - The type of form (e.g., 'contact', 'newsletter', 'diabetic-foot-ulcer')
 * @returns {Promise<Object>} - The response from the API
 */
export async function submitToGoHighLevel(formData, formType = 'generic') {
  // Add formType to the data
  const apiFormData = {
    ...formData,
    formType
  };
  
  // Submit to GoHighLevel CRM via centralized API route
  const response = await fetch('/api/gohighlevel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiFormData),
  });
  
  return await response.json();
}

/**
 * Hook for handling form submission to GoHighLevel
 * @param {Function} onSuccess - Callback function to run on successful submission
 * @param {Function} onError - Callback function to run on error
 * @returns {Object} - Form submission handlers and state
 */
export function useGoHighLevelForm(onSuccess, onError) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (formData, formType = 'generic') => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const result = await submitToGoHighLevel(formData, formType);
      
      if (result.success) {
        setSubmitStatus('success');
        if (onSuccess) onSuccess(result);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Failed to submit form');
        if (onError) onError(result);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'There was an error submitting your information.');
      if (onError) onError(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    handleSubmit,
    isSubmitting,
    submitStatus,
    errorMessage,
    setSubmitStatus,
    setErrorMessage
  };
}

/**
 * Creates a standard set of contact data for GoHighLevel
 * @param {Object} data - The form data
 * @returns {Object} - Formatted contact data and custom fields
 */
export function formatContactData(data) {
  // Extract name from combined field if needed
  let firstName = data.firstName || '';
  let lastName = data.lastName || '';
  
  if (data.name && !firstName) {
    const nameParts = data.name.split(' ');
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  }
  
  // Basic contact data
  const contactData = {
    firstName,
    lastName,
    email: data.email || '',
    phone: data.phone || '',
    tags: data.tags || ["Website Lead"],
    source: data.source || "Website Form"
  };
  
  // Extract custom fields
  const customFields = [];
  Object.keys(data).forEach(key => {
    // Skip standard fields
    if (!['firstName', 'lastName', 'name', 'email', 'phone', 'formType', 'tags', 'source'].includes(key)) {
      customFields.push({
        name: key,
        value: typeof data[key] === 'boolean' 
          ? (data[key] ? "Yes" : "No") 
          : String(data[key] || '')
      });
    }
  });
  
  return { contactData, customFields };
} 