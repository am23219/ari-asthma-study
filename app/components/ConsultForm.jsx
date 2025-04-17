'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConsultForm() {
  const [currentStep, setCurrentStep] = useState('personalInfo');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bestTimeToCall: '',
    hasUlcer: null,
    ulcerDuration: '',
    hasDisqualifyingCondition: null,
    canVisitClinic: null,
    questions: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAnswer = (question, answer) => {
    const newFormData = { ...formData, [question]: answer };
    setFormData(newFormData);

    // Determine next step based on answer
    if (question === 'hasUlcer' && answer === false) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: "We apologize, but this study is only for patients with ulcerative colitis."
      });
      return;
    }
    if (question === 'ulcerDuration' && answer === 'Less than 1 month') {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: "We apologize, but this study requires ulcers that haven't healed for more than 4 weeks."
      });
      return;
    }
    if (question === 'hasDisqualifyingCondition' && answer === true) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: "We apologize, but based on your responses, you may not be eligible for this study. Please consult with your healthcare provider for appropriate treatment options."
      });
      return;
    }
    if (question === 'canVisitClinic' && answer === false) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: "We apologize, but this study requires in-person visits to our Plant City clinic. Thank you for your interest."
      });
      return;
    }

    // Advance to next question
    if (question === 'hasUlcer') {
      setCurrentStep('ulcerDuration');
    } else if (question === 'ulcerDuration') {
      setCurrentStep('disqualifyingConditions');
    } else if (question === 'hasDisqualifyingCondition') {
      setCurrentStep('clinicVisit');
    } else if (question === 'canVisitClinic' && answer === true) {
      setCurrentStep('additionalInfo');
    }
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName && formData.email && formData.phone && formData.dateOfBirth) {
      setCurrentStep('screening');
      setFormStatus({ isSubmitting: false, isSubmitted: false, error: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setFormStatus({
      isSubmitting: true,
      isSubmitted: false,
      error: null
    });
    
    try {
      // Log the form data being sent
      console.log('Submitting form data:', formData);
      
      const response = await axios.post('/api/submit-consult', formData);
      
      console.log('API response:', response);
      
      if (response.data.success) {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          error: null
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          bestTimeToCall: '',
          hasUlcer: null,
          ulcerDuration: '',
          hasDisqualifyingCondition: null,
          canVisitClinic: null,
          questions: ''
        });
        setCurrentStep('personalInfo');
      } else {
        throw new Error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to submit form. Please try again.';
      
      if (error.response) {
        // Server responded with an error status
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data?.message || `Server error (${error.response.status}): Please try again later.`;
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection and try again.';
      } else {
        // Error in request setup
        console.error('Request error:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: errorMessage
      });
    }
  };

  if (formStatus.isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-lg mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Your consultation request has been submitted successfully. Our team will contact you within 24 hours to schedule your appointment.
          </p>
        </div>
        <button 
          onClick={() => {
            setFormStatus(prev => ({ ...prev, isSubmitted: false }));
            setCurrentStep('personalInfo');
          }}
          className="text-primary hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {formStatus.error && (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300 mb-4">
          {formStatus.error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {currentStep === 'personalInfo' && (
          <motion.form
            key="personalInfo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handlePersonalInfoSubmit}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Your first name"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Your last name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth*
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="bestTimeToCall" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Best Time to Call
                </label>
                <select
                  id="bestTimeToCall"
                  name="bestTimeToCall"
                  value={formData.bestTimeToCall}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a time</option>
                  <option value="Morning">Morning (9am - 12pm)</option>
                  <option value="Afternoon">Afternoon (12pm - 5pm)</option>
                  <option value="Evening">Evening (5pm - 8pm)</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-cta hover:bg-cta-dark text-white w-full flex justify-center items-center font-semibold py-4 px-6 rounded-md transition-all shadow-lg transform hover:scale-[1.02] border-b-4 border-cta-dark"
              >
                Continue to Eligibility Questions
              </button>
            </div>
          </motion.form>
        )}

        {currentStep === 'screening' && (
          <motion.div
            key="screening"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Eligibility Screening
            </h3>
            <div className="space-y-4">
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Do you have a diabetic foot ulcer?
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleAnswer('hasUlcer', true)}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer('hasUlcer', false)}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  No
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 'ulcerDuration' && (
          <motion.div
            key="ulcerDuration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Duration
            </h3>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-4">
                How long have you had your foot ulcer?
              </p>
              <select
                id="ulcerDuration"
                name="ulcerDuration"
                value={formData.ulcerDuration}
                onChange={(e) => handleAnswer('ulcerDuration', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select duration</option>
                <option value="Less than 1 month">Less than 1 month</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="More than 1 year">More than 1 year</option>
              </select>
            </div>
          </motion.div>
        )}

        {currentStep === 'disqualifyingConditions' && (
          <motion.div
            key="disqualifyingConditions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Medical History
            </h3>
            <div className="space-y-4">
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Do you have any of the following conditions?
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Osteomyelitis (bone infection)</li>
                <li>• Exposed bone or tendon</li>
                <li>• Active or latent infection</li>
                <li>• Charcot foot and/or a toe amputation</li>
              </ul>
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => handleAnswer('hasDisqualifyingCondition', true)}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Yes, I have one or more
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer('hasDisqualifyingCondition', false)}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  No, none of these
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 'clinicVisit' && (
          <motion.div
            key="clinicVisit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Location
            </h3>
            <div className="space-y-4">
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Are you willing to visit the Denali Health Clinic in Plant City, FL if you qualify? Free (Uber) Transportation is Provided.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleAnswer('canVisitClinic', true)}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer('canVisitClinic', false)}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  No
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 'additionalInfo' && (
          <motion.div
            key="additionalInfo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Additional Information
            </h3>
            <div>
              <label htmlFor="questions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Do you have any questions or concerns?
              </label>
              <textarea
                id="questions"
                name="questions"
                value={formData.questions}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                disabled={formStatus.isSubmitting}
                className="bg-cta hover:bg-cta-dark text-white w-full flex justify-center items-center font-semibold py-3 px-6 rounded-md transition-all shadow-lg transform hover:scale-[1.02] border-b-4 border-cta-dark"
              >
                {formStatus.isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        By submitting this form, you agree to our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and consent to be contacted about the study.
      </p>
    </div>
  );
} 