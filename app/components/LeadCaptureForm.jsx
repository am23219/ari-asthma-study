'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendGTMEvent } from '@next/third-parties/google';
import clsx from 'clsx';

export default function LeadCaptureForm({ context = 'default' }) {
  const [currentStep, setCurrentStep] = useState('initial');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    hasUcDiagnosis: null,
    hasCrohnsOrIndeterminate: null,
    hasColectomyOrOstomy: null,
    recentlyHospitalized: null,
    name: '',
    phone: '',
    email: ''
  });

  const handleAnswer = (question, answer) => {
    const newFormData = { ...formData, [question]: answer };
    setFormData(newFormData);

    // Determine next step based on answer
    if (question === 'hasUcDiagnosis' && answer === false) {
      setCurrentStep('notQualified');
      return;
    }
    if (question === 'hasCrohnsOrIndeterminate' && answer === true) {
      setCurrentStep('notQualified');
      return;
    }
    if (question === 'hasColectomyOrOstomy' && answer === true) {
      setCurrentStep('notQualified');
      return;
    }
    if (question === 'recentlyHospitalized' && answer === true) {
      setCurrentStep('notQualified');
      return;
    }

    // Advance to next question or contact info
    if (question === 'hasUcDiagnosis') {
      setCurrentStep('crohnsQuestion');
    } else if (question === 'hasCrohnsOrIndeterminate') {
      setCurrentStep('colectomyQuestion');
    } else if (question === 'hasColectomyOrOstomy') {
      setCurrentStep('hospitalizedQuestion');
    } else if (question === 'recentlyHospitalized') {
      setCurrentStep('contactInfo');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      setIsSubmitting(true);
      // Format data for API submission
      const apiFormData = {
        formType: 'uc-study',
        firstName: formData.name?.split(' ')[0] || '',
        lastName: formData.name?.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        hasUcDiagnosis: formData.hasUcDiagnosis,
        hasCrohnsOrIndeterminate: formData.hasCrohnsOrIndeterminate,
        hasColectomyOrOstomy: formData.hasColectomyOrOstomy,
        recentlyHospitalized: formData.recentlyHospitalized
      };
      
      console.log('Submitting Lead Capture form data:', apiFormData);
      
      // Try direct API call to GoHighLevel first (this is what works reliably)
      try {
        // Format the data for GoHighLevel direct API call
        const contactData = {
          firstName: apiFormData.firstName,
          lastName: apiFormData.lastName,
          email: apiFormData.email,
          phone: apiFormData.phone,
          tags: ["UC Study", "Website Lead"],
          source: "Website Eligibility Form",
          notes: `Quick Eligibility Form Submission
Submitted at: ${new Date().toISOString()}
Has UC Diagnosis: ${formData.hasUcDiagnosis ? "Yes/Maybe" : "Definitely Not"}
Has Crohn's or Indeterminate Colitis: ${formData.hasCrohnsOrIndeterminate ? "Yes" : "No"}
Has Colectomy/Ostomy/Pouch: ${formData.hasColectomyOrOstomy ? "Yes" : "No"}
Recently Hospitalized: ${formData.recentlyHospitalized ? "Yes" : "No"}`
        };
        
        // Use API key directly - this is what works in testing
        const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlFJalUwNkVsV0xoUUtLWE9WS1pUIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQyMTk2OTYxNzc1LCJzdWIiOiJ3cnpDc082QmUxdzhNVFJmcTRwTiJ9.X3COjVHC9q8RjdrGMzl-ZlBaD2aZHx8Vxt4l5JNtkQE";
        
        console.log('Making direct API call to GoHighLevel with data:', contactData);
        
        // Use axios for direct API call
        const axios = await import('axios');
        
        // Make direct API call to GoHighLevel
        const directResponse = await axios.default.post(
          'https://rest.gohighlevel.com/v1/contacts/',
          contactData,
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );
        
        console.log('GoHighLevel direct API call successful:', directResponse.data);
        
        // On success, show success step
        setCurrentStep('success');
        sendGTMEvent({ event: 'buttonClicked', value: 'Eligibility Check' })
        
        // Track Google Ads conversion
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'conversion', {
            'send_to': 'AW-16915520694/H9CmCMHnlKoaELa5-YE_',
            'value': 1.0,
            'currency': 'USD'
          });
          console.log('Google Ads conversion tracked for Eligibility Check');
        }
        
        return; // Exit early since direct call succeeded
      } catch (directApiError) {
        console.error('Direct API call failed, falling back to server API:', directApiError);
        // Continue to server API as fallback
      }
      
      // Submit to GoHighLevel CRM via centralized API route with timeout (fallback)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch('/api/gohighlevel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiFormData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API response:', result);
        
        if (result.success) {
          setCurrentStep('success');
        } else {
          throw new Error(result.message || 'Failed to submit form');
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please try again or contact us directly.');
        } else if (fetchError.message.includes('Failed to fetch')) {
          throw new Error('Network error. Please check your connection and try again.');
        } else {
          throw fetchError;
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.message || 'There was an error submitting your information. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const restart = () => {
    setCurrentStep('initial');
    setFormData({
      hasUcDiagnosis: null,
      hasCrohnsOrIndeterminate: null,
      hasColectomyOrOstomy: null,
      recentlyHospitalized: null,
      name: '',
      phone: '',
      email: ''
    });
  };

  const rootClasses = clsx(
    "relative overflow-hidden w-full"
  );

  const headingClasses = clsx(
    "text-xl md:text-2xl font-bold text-center mb-2 font-heading",
    {
      'text-navy-deep': context === 'default' || context === 'consultation',
      'text-white': context === 'hero',
    }
  );
  
  const captionClasses = clsx(
    "text-center mb-6 text-sm md:text-base font-body",
    {
      'text-text-sub': context === 'default' || context === 'consultation',
      'text-white/90': context === 'hero',
    }
  );

  const questionTextClasses = clsx(
      "text-lg sm:text-xl font-bold mb-2 sm:mb-3 border-l-4 pl-3 py-1 font-heading",
      {
          'text-navy-deep border-teal-accent': context === 'default' || context === 'consultation',
          'text-white border-teal-400': context === 'hero'
      }
  );

  const inputLabelClasses = clsx(
      "block text-base font-medium mb-1 font-heading",
      {
          'text-gray-700': context === 'default' || context === 'consultation',
          'text-white': context === 'hero' // White text for hero
      }
  );

  const inputTextClasses = clsx(
      "mt-1 block w-full rounded-md shadow-sm text-base font-body",
      {
          'border-gray-300 focus:border-blue-primary focus:ring-blue-primary px-4 py-3': context === 'default' || context === 'consultation',
          'bg-white/20 border-white/30 text-white placeholder-white focus:border-teal-400 focus:ring-teal-400 rounded-lg px-4 py-3': context === 'hero'
      }
  );

  const buttonPrimaryClasses = clsx(
      "flex-1 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-all text-base font-heading",
      {
          'bg-gradient-to-r from-blue-primary to-navy-deep hover:from-navy-deep hover:to-blue-primary': context === 'default' || context === 'consultation',
          'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700': context === 'hero' // Teal/Cyan buttons for hero
      }
  );

  const buttonSecondaryClasses = clsx(
      "flex-1 py-2.5 sm:py-3 rounded-lg font-medium text-base font-heading",
      {
          'bg-blue-light-bg hover:bg-blue-light-bg/80 text-navy-deep': context === 'default' || context === 'consultation',
          'bg-white/20 hover:bg-white/30 text-white': context === 'hero' // Lighter secondary button for hero
      }
  );

  const notQualifiedTextClasses = clsx(
      "text-center",
      {
          'text-red-600': context === 'default' || context === 'consultation',
          'text-red-400': context === 'hero' // Lighter red for hero
      }
  );

  const successTextClasses = clsx(
      "text-center",
      {
          'text-green-600': context === 'default' || context === 'consultation',
          'text-green-400': context === 'hero' // Lighter green for hero
      }
  );

  return (
    <div className={rootClasses}>
      <AnimatePresence mode="wait">
        {currentStep === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 sm:mb-5">
              <p className={questionTextClasses}>
                Have you been diagnosed with ulcerative colitis and are actively experiencing symptoms?
              </p>
              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => handleAnswer('hasUcDiagnosis', true)}
                  className={buttonPrimaryClasses}
                >
                  Yes/Maybe
                </button>
                <button
                  onClick={() => handleAnswer('hasUcDiagnosis', false)}
                  className={buttonSecondaryClasses}
                >
                  Definitely Not
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {currentStep === 'crohnsQuestion' && (
          <motion.div
            key="crohnsQuestion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className={clsx(
              "text-sm sm:text-base text-text-sub mb-4 sm:mb-5 text-center font-body",
              { 'text-white/90': context === 'hero' }
            )}>
              Question 2 of 4 - almost halfway there!
            </p>
            <div className="mb-4 sm:mb-5">
              <p className={questionTextClasses}>
                Have you been diagnosed with Crohn's disease or indeterminate colitis?
              </p>
              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => handleAnswer('hasCrohnsOrIndeterminate', true)}
                  className={buttonSecondaryClasses}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer('hasCrohnsOrIndeterminate', false)}
                  className={buttonPrimaryClasses}
                >
                  No
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {currentStep === 'colectomyQuestion' && (
          <motion.div
            key="colectomyQuestion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className={clsx(
              "text-sm sm:text-base text-text-sub mb-4 sm:mb-5 text-center font-body",
              { 'text-white/90': context === 'hero' }
            )}>
              Question 3 of 4 - you're making great progress!
            </p>
            <div className="mb-4 sm:mb-5">
              <p className={questionTextClasses}>
                Have you had a colectomy (removal of the colon), ostomy, or ileal pouch?
              </p>
              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => handleAnswer('hasColectomyOrOstomy', true)}
                  className={buttonSecondaryClasses}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer('hasColectomyOrOstomy', false)}
                  className={buttonPrimaryClasses}
                >
                  No
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {currentStep === 'hospitalizedQuestion' && (
          <motion.div
            key="hospitalizedQuestion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className={clsx(
              "text-sm sm:text-base text-text-sub mb-4 sm:mb-5 text-center font-body",
              { 'text-white/90': context === 'hero' }
            )}>
              Final question - you're almost done!
            </p>
            <div className="mb-4 sm:mb-5">
              <p className={questionTextClasses}>
                Have you been hospitalized for UC or IBD in the past 3 months?
              </p>
              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => handleAnswer('recentlyHospitalized', true)}
                  className={buttonSecondaryClasses}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer('recentlyHospitalized', false)}
                  className={buttonPrimaryClasses}
                >
                  No
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {currentStep === 'contactInfo' && (
          <motion.div
            key="contactInfo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className={clsx(
              "text-sm sm:text-base text-text-sub mb-5 sm:mb-7 text-center font-body",
              { 'text-white/90': context === 'hero' }
            )}>
              Great! You may qualify. Please provide your contact information so we can follow up.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
              <div>
                <label htmlFor="name" className={inputLabelClasses}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={clsx(inputTextClasses, "mt-2")}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="phone" className={inputLabelClasses}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={clsx(inputTextClasses, "mt-2")}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label htmlFor="email" className={inputLabelClasses}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={clsx(inputTextClasses, "mt-2")}
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={clsx(
                  "w-full py-3.5 sm:py-4 rounded-lg text-white font-semibold transition-all flex items-center justify-center font-heading",
                  {
                    'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700': context === 'hero'
                  }
                )}
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isSubmitting ? 'Submitting...' : 'Submit Eligibility Check'}
              </button>
            </form>
          </motion.div>
        )}
        
        {currentStep === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={successTextClasses}
          >
            <div className="mx-auto mb-4 bg-gradient-to-br from-teal-accent to-blue-primary rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className={clsx(
              "text-lg sm:text-xl font-semibold text-navy-deep mb-2 font-heading",
              { 'text-white': context === 'hero' }
            )}>Thank You!</h4>
            <p className={clsx(
              "text-sm sm:text-base text-text-sub mb-4 font-body",
              { 'text-white/90': context === 'hero' }
            )}>We've received your information. A study coordinator will contact you soon to discuss the next steps.</p>
            <button
              onClick={restart}
              className={clsx("text-sm sm:text-base text-blue-primary hover:underline font-medium font-heading", {
                  'text-teal-400': context === 'hero'
              })}
            >
              Start Over
            </button>
          </motion.div>
        )}

        {currentStep === 'notQualified' && (
          <motion.div
            key="notQualified"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={notQualifiedTextClasses}
          >
            <div className="mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className={clsx(
              "text-lg sm:text-xl font-semibold text-navy-deep mb-2 font-heading",
              { 'text-white': context === 'hero' }
            )}>Qualification Status</h4>
            <p className={clsx(
              "text-sm sm:text-base text-text-sub mb-4 font-body",
               { 'text-white/90': context === 'hero' }
             )}>Based on your answers, you may not qualify for this specific study at this time. Requirements can change, so feel free to check back later or contact us for other potential opportunities.</p>
            <button
              onClick={restart}
              className={clsx("text-sm sm:text-base text-blue-primary hover:underline font-medium font-heading", {
                  'text-teal-400': context === 'hero'
              })}
            >
              Start Over
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 