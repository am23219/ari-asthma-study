'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Format data for API submission
      const apiFormData = {
        formType: 'newsletter',
        name: name,
        email: email
      };
      
      // Submit to GoHighLevel CRM via centralized API route
      const response = await fetch('/api/gohighlevel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiFormData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        // Reset form
        setEmail('');
        setName('');
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Failed to subscribe to newsletter');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'There was an error subscribing to the newsletter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
        Subscribe to Our Newsletter
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        Stay updated with the latest news and information about diabetic foot ulcer treatments.
      </p>
      
      {submitStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
          <p className="font-medium">Thank you for subscribing!</p>
          <p>You'll receive our next newsletter in your inbox.</p>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="newsletter-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Name (Optional)
          </label>
          <input
            type="text"
            id="newsletter-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-[#00A896] focus:border-[#00A896] dark:bg-slate-700 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="newsletter-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="newsletter-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-[#00A896] focus:border-[#00A896] dark:bg-slate-700 dark:text-white"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#00A896] to-[#028090] hover:from-[#028090] hover:to-[#00A896] text-white py-3 rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </span>
          ) : (
            "Subscribe"
          )}
        </button>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          We respect your privacy. You can unsubscribe at any time.
        </p>
      </form>
    </div>
  );
} 