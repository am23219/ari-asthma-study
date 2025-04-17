'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendGTMEvent } from '@next/third-parties/google';

export default function LeadCaptureForm() {
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

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-amber-100 dark:border-amber-600 relative overflow-hidden backdrop-blur-sm">
      <div className="absolute -right-12 -top-12 w-24 h-24 bg-yellow-100/50 rounded-full"></div>
      
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-slate-800 dark:text-white">
        Quick Screening Questions
      </h3>
      
      <AnimatePresence mode="wait">
        {currentStep === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3 sm:mb-4 text-center">
              Just 30 seconds to see if you qualify - no commitment required!
            </p>
            <div className="mb-3 sm:mb-4">
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2 sm:mb-3 border-l-4 border-[#00A896] pl-3 py-1">
              Have you been diagnosed with ulcerative colitis and are actively experiencing symptoms?
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => handleAnswer('hasUcDiagnosis', true)}
                  className="flex-1 bg-gradient-to-r from-[#00A896] to-[#028090] hover:from-[#028090] hover:to-[#00A896] text-white py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base"
                >
                  Yes/Maybe
                </button>
                <button
                  onClick={() => handleAnswer('hasUcDiagnosis', false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
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
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3 sm:mb-4 text-center">
              Question 2 of 4 - almost halfway there!
            </p>
            <div className="mb-3 sm:mb-4">
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2 sm:mb-3 border-l-4 border-[#00A896] pl-3 py-1">
              Do you have a history of Crohn's disease or indeterminate colitis?
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => handleAnswer('hasCrohnsOrIndeterminate', true)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer('hasCrohnsOrIndeterminate', false)}
                  className="flex-1 bg-gradient-to-r from-[#00A896] to-[#028090] hover:from-[#028090] hover:to-[#00A896] text-white py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base"
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
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3 sm:mb-4 text-center">
              Question 3 of 4 - you're making great progress!
            </p>
            <div className="mb-3 sm:mb-4">
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2 sm:mb-3 border-l-4 border-[#00A896] pl-3 py-1">
              Have you had a colectomy (surgical removal of the colon) or do you have an ostomy or ileoanal pouch?
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => handleAnswer('hasColectomyOrOstomy', true)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer('hasColectomyOrOstomy', false)}
                  className="flex-1 bg-gradient-to-r from-[#00A896] to-[#028090] hover:from-[#028090] hover:to-[#00A896] text-white py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base"
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
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3 sm:mb-4 text-center">
              Final question - you're almost done!
            </p>
            <div className="mb-3 sm:mb-4">
              <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2 sm:mb-3 border-l-4 border-[#00A896] pl-3 py-1">
              Have you been hospitalized for your ulcerative colitis within the last two weeks?
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => handleAnswer('recentlyHospitalized', true)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer('recentlyHospitalized', false)}
                  className="flex-1 bg-gradient-to-r from-[#00A896] to-[#028090] hover:from-[#028090] hover:to-[#00A896] text-white py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base"
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
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3 sm:mb-4 text-center">
              Great news! Based on your answers, you may qualify for our study.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="(123) 456-7890"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="john@example.com"
                />
              </div>
              
              {errorMessage && (
                <div className="text-red-500 text-sm mt-2">
                  {errorMessage}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#00A896] to-[#028090] hover:from-[#028090] hover:to-[#00A896] text-white py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </motion.div>
        )}
        
        {currentStep === 'notQualified' && (
          <motion.div
            key="notQualified"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <svg className="w-16 h-16 mx-auto mb-3 sm:mb-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-slate-800 dark:text-white">
              You may not qualify at this time
            </h4>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3 sm:mb-4">
              Based on your answers, you may not qualify for this particular study. However, we may have other studies that are a better fit.
            </p>
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <a
                href="tel:3526911140"
                className="bg-gradient-to-r from-[#00A896] to-[#028090] hover:from-[#028090] hover:to-[#00A896] text-white py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call to Discuss Options
              </a>
              <button
                onClick={restart}
                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}
        
        {currentStep === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              Thank You!
            </h4>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Your information has been submitted successfully. One of our team members will contact you shortly to discuss next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:8136966716"
                className="bg-gradient-to-r from-[#00A896] to-[#028090] hover:from-[#028090] hover:to-[#00A896] text-white py-2.5 px-6 rounded-lg font-medium transition-all text-sm sm:text-base"
              >
                Call Us Now
              </a>
              <button
                onClick={restart}
                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2.5 px-6 rounded-lg font-medium text-sm sm:text-base"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 