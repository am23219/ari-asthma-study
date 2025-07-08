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
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 md:py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('/treatment-image.jpg')] bg-cover bg-center opacity-100 z-[0]"
      ></div>

      <div className="absolute inset-0 bg-gradient-to-br from-[#003F73]/90 via-[#00609B]/85 to-[#0077CC]/95 z-[1]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-[1]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8">
          <div className="w-full lg:w-5/12 text-center lg:text-left mt-2 md:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6 text-white leading-tight tracking-tight" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8)' }}>
                Have you been <span className="block">managing</span> <span className="text-[#00B3A6] drop-shadow-lg">Chronic Kidney Disease (CKD)?</span>
              </h1>
              <p className="font-body text-lg md:text-xl text-white mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.6)' }}>
              Join our clinical research study evaluating an investigational oral medication that may help slow kidney damage and reduce protein in the urine.
              </p>
              
              <div className="mb-6 md:mb-10">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center text-left font-heading" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.6)' }}>
                  <span className="bg-[#00B3A6] h-8 w-2 mr-3 rounded-full"></span>
                  Study Benefits
                </h3>
                <ul className="space-y-3 md:space-y-5 max-w-xl lg:mx-0">
                  <li className="flex items-center bg-white/10 hover:bg-white/15 transition-colors duration-300 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <div className="bg-[#00B3A6] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-medium text-white font-body">No Cost</span>
                  </li>
                  <li className="flex items-center bg-white/10 hover:bg-white/15 transition-colors duration-300 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <div className="bg-[#00B3A6] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-medium text-white font-body">Free Transportation via Uber</span>
                  </li>
                  <li className="flex items-center bg-white/10 hover:bg-white/15 transition-colors duration-300 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <div className="bg-[#00B3A6] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-medium text-white font-body">Compensation Provided</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-7/12">
            <div className="w-full mx-auto lg:mx-0 lg:max-w-none p-4 sm:p-6 bg-black/25 rounded-xl backdrop-blur-md shadow-lg border-2 border-teal-400/50">
              {shouldShowQuestionnaireHeader() && (
                <>
                  <h3 className="text-2xl md:text-3xl font-bold text-center mb-2 font-heading text-white">
                    Quick 30-Second Eligibility Check
                  </h3>
                  <p className="text-center text-white/90 mb-6 text-base font-body">
                    Answer a few simple questions to see if you qualify for the study.
                  </p>
                </>
              )}
              <LeadCaptureForm context="hero" onStepChange={handleFormStepChange} />
              <p className="text-xs text-center text-white/80 mt-4 font-body">
                  Your information is secure and will only be used to determine study eligibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 