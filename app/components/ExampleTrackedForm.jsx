'use client';

import { useState } from 'react';
import { useFacebookTracking, useFormTracking } from '../hooks/useFacebookTracking';

/**
 * Example form component with Facebook tracking integration
 * This shows how to implement tracking in your existing forms
 */
export default function ExampleTrackedForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Facebook tracking hooks
  const { trackFormSubmission, isTracking, trackingError } = useFacebookTracking();
  const { trackFieldFocus, trackFormStart, trackFormProgress } = useFormTracking('Contact Form');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Track form progress
    const filledFields = Object.values({ ...formData, [name]: value }).filter(val => val.trim() !== '').length;
    const totalFields = Object.keys(formData).length;
    const progress = Math.round((filledFields / totalFields) * 100);
    trackFormProgress(progress);
  };

  const handleFieldFocus = (fieldName) => {
    trackFieldFocus(fieldName);
    
    // Track form start on first field focus
    if (Object.values(formData).every(val => val === '')) {
      trackFormStart();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Your existing form submission logic here
      // For example, sending to your form handler
      const formResponse = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (formResponse.ok) {
        // Track the lead with Facebook
        const trackingResult = await trackFormSubmission(formData, {
          formName: 'Contact Form',
          value: 50, // Assign a value to your leads (optional)
          currency: 'USD',
          contentCategory: 'Lead Generation'
        });

        if (trackingResult.success) {
          setSubmitResult({
            type: 'success',
            message: 'Form submitted and tracked successfully!'
          });
        } else {
          setSubmitResult({
            type: 'warning',
            message: 'Form submitted but tracking may have failed.'
          });
        }

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        throw new Error('Form submission failed');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitResult({
        type: 'error',
        message: 'Failed to submit form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>
      
      {submitResult && (
        <div className={`mb-4 p-3 rounded ${
          submitResult.type === 'success' ? 'bg-green-100 text-green-700' :
          submitResult.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {submitResult.message}
        </div>
      )}

      {trackingError && (
        <div className="mb-4 p-3 rounded bg-orange-100 text-orange-700">
          Tracking Warning: {trackingError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('firstName')}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('lastName')}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('email')}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('message')}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isTracking}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {/* Tracking Status Indicator (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-xs text-gray-500">
          <div>Tracking Status: {isTracking ? 'Tracking...' : 'Ready'}</div>
          {trackingError && <div>Error: {trackingError}</div>}
        </div>
      )}
    </div>
  );
} 