'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import LeadCaptureForm from "./LeadCaptureForm";

export default function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  const [formStep, setFormStep] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFormStepChange = (step) => {
    setFormStep(step);
  };

  // Check if we should show the questionnaire header
  const shouldShowQuestionnaireHeader = () => {
    // Show header only during question steps (0-10) and not when qualified or other states
    return (
      typeof formStep === 'number' && 
      formStep >= 0 && 
      formStep < 11 && 
      formStep !== 'qualified' && 
      formStep !== 'success' && 
      formStep !== 'bookingOpened' && 
      formStep !== 'contactForm' && 
      formStep !== 'notQualified'
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center lg:items-start lg:justify-start pt-24 pb-12 md:py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('/treatment-image.jpg')] bg-cover bg-center opacity-100 z-[0]"
      ></div>

      <div className="absolute inset-0 bg-gradient-to-br from-[#003F73]/90 via-[#00609B]/85 to-[#0077CC]/95 z-[1]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-[1]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full lg:pt-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-8">
          <div className="w-full lg:w-5/12 text-center lg:text-left mt-2 md:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6 text-white leading-tight tracking-tight" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8)' }}>
                Struggling with <span className="block">Severe Asthma?</span> <span className="text-[#00B3A6] drop-shadow-lg">The IMAGINE Study</span>
              </h1>
              <p className="font-body text-lg md:text-xl text-white mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.6)' }}>
              The IMAGINE Study is evaluating a new, long-acting investigational treatment that may help control a specific type of severe asthma. This could mean fewer asthma attacks and a simpler treatment routine with only two injections per year.
              </p>
              
              <div className="mb-6 md:mb-10">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center text-left font-heading" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.6)' }}>
                  <span className="bg-[#00B3A6] h-8 w-2 mr-3 rounded-full"></span>
                  Participation Benefits
                </h3>
                <ul className="space-y-3 md:space-y-5 max-w-xl lg:mx-0">
                  <li className="flex items-center bg-white/10 hover:bg-white/15 transition-colors duration-300 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <div className="bg-[#00B3A6] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-medium text-white font-body">Receive investigational treatment at no cost</span>
                  </li>
                  <li className="flex items-center bg-white/10 hover:bg-white/15 transition-colors duration-300 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <div className="bg-[#00B3A6] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-medium text-white font-body">Complimentary transportation</span>
                  </li>
                  <li className="flex items-center bg-white/10 hover:bg-white/15 transition-colors duration-300 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <div className="bg-[#00B3A6] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-medium text-white font-body">Compensation for participation</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-7/12">
            <div className="w-full mx-auto lg:mx-0 lg:max-w-none overflow-hidden rounded-xl shadow-2xl border border-white/20">
              {shouldShowQuestionnaireHeader() && (
                <div className="bg-gradient-to-r from-blue-100/95 to-cyan-100/95 backdrop-blur-sm px-4 sm:px-6 py-6 border-b border-blue-200/30">
                  <h3 className="text-2xl md:text-3xl font-bold text-center mb-2 font-heading text-gray-800">
                    Quick 30-Second Eligibility Check
                  </h3>
                  <p className="text-center text-gray-700 mb-0 text-base font-body">
                    Answer a few simple questions to see if you qualify for the study.
                  </p>
                </div>
              )}
              
              <div className="bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-md p-4 sm:p-6">
                <LeadCaptureForm context="hero" onStepChange={handleFormStepChange} />
                <p className="text-xs text-center text-gray-600 mt-4 font-body">
                    Your information is secure and will only be used to determine study eligibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 