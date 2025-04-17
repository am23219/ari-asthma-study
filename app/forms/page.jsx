'use client';

import { useState } from 'react';
import LeadCaptureForm from '../components/LeadCaptureForm';
import ContactForm from '../components/ContactForm';
import NewsletterSignup from '../components/NewsletterSignup';
import ConsultForm from '../components/ConsultForm';
import { submitToGoHighLevel } from '../utils/gohighlevel';
import { sendGTMEvent } from '@next/third-parties/google';

export default function FormsPage() {
  const [customFormData, setCustomFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    referralSource: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCustomFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const result = await submitToGoHighLevel(customFormData, 'custom');
      
      if (result.success) {
        setSubmitStatus('success');
        // Reset form
        sendGTMEvent({ event: 'buttonClicked', value: 'floating-cta' })
        setCustomFormData({
          name: '',
          email: '',
          phone: '',
          interest: '',
          referralSource: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'There was an error submitting your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Let's Get Connected!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Diabetic Foot Ulcer Study Form</h2>
          <p className="text-gray-600 mb-6">
See if you qualify for the diabetic foot ulcer study.           </p>
          <LeadCaptureForm />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
          <p className="text-gray-600 mb-6">
            A general contact form for a clinician to get in touch.
          </p>
          <ContactForm />
        </div>
      </div>
      
    </div>
  );
} 