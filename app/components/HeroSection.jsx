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
      {/* Animated Helix Background */}
      <div className="absolute inset-0 z-[0]" style={{
        background: `linear-gradient(135deg, 
          rgba(0, 63, 115, 0.95) 0%,
          rgba(0, 96, 155, 0.9) 25%,
          rgba(0, 119, 204, 0.9) 50%,
          rgba(0, 179, 166, 0.85) 75%,
          rgba(0, 119, 204, 0.9) 100%
        )`
      }}>
        {/* Multiple Animated Helixes */}
        {[...Array(5)].map((_, i) => {
          const helixColors = [
            'rgba(0, 179, 166, 0.8)', // Main teal
            'rgba(0, 199, 204, 0.7)', // Light cyan
            'rgba(0, 155, 200, 0.6)', // Blue-cyan
            'rgba(64, 224, 208, 0.5)', // Turquoise
            'rgba(0, 206, 209, 0.7)'  // Dark turquoise
          ];
          const backColors = [
            'rgba(0, 139, 139, 0.4)', // Dark cyan
            'rgba(0, 159, 164, 0.3)', // Medium cyan
            'rgba(0, 119, 160, 0.3)', // Blue-cyan back
            'rgba(32, 178, 170, 0.25)', // Medium sea green
            'rgba(0, 166, 169, 0.4)'  // Dark turquoise back
          ];
          
          return (
            <div
              key={i}
              className="absolute opacity-25"
              style={{
                left: `${20 + i * 20}%`,
                top: '-10%',
                width: '200px',
                height: '120%',
                animation: `rotateHelix ${8 + i * 2}s linear infinite`,
                animationDelay: `${i * 1.5}s`
              }}
            >
              {/* Helix Structure */}
              <div className="relative w-full h-full">
                {[...Array(20)].map((_, j) => (
                  <div
                    key={j}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      background: helixColors[i % helixColors.length],
                      left: `${40 + 30 * Math.sin((j * Math.PI) / 3)}%`,
                      top: `${j * 5}%`,
                      opacity: 0.4 + (Math.sin((j * Math.PI) / 3) + 1) * 0.3,
                      transform: `scale(${0.5 + Math.abs(Math.sin((j * Math.PI) / 3)) * 0.5})`,
                      animation: `pulse ${2 + (j % 3)}s ease-in-out infinite`,
                      animationDelay: `${j * 0.1}s`,
                      boxShadow: `0 0 8px ${helixColors[i % helixColors.length]}`
                    }}
                  />
                ))}
                {[...Array(20)].map((_, j) => (
                  <div
                    key={`back-${j}`}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: backColors[i % backColors.length],
                      left: `${40 - 30 * Math.sin((j * Math.PI) / 3)}%`,
                      top: `${j * 5 + 2.5}%`,
                      opacity: 0.2 + (Math.sin((j * Math.PI) / 3) + 1) * 0.15,
                      transform: `scale(${0.3 + Math.abs(Math.sin((j * Math.PI) / 3)) * 0.3})`,
                      animation: `pulse ${2.5 + (j % 3)}s ease-in-out infinite`,
                      animationDelay: `${j * 0.15}s`,
                      boxShadow: `0 0 6px ${backColors[i % backColors.length]}`
                    }}
                  />
                ))}
                {/* Connecting Lines */}
                {[...Array(19)].map((_, j) => (
                  <div
                    key={`line-${j}`}
                    className="absolute"
                    style={{
                      background: `linear-gradient(90deg, ${helixColors[i % helixColors.length]}, ${backColors[i % backColors.length]})`,
                      left: `${40 + 30 * Math.sin((j * Math.PI) / 3)}%`,
                      top: `${j * 5 + 2}%`,
                      width: `${Math.abs(60 * Math.sin((j * Math.PI) / 3))}%`,
                      height: '1px',
                      opacity: 0.15 + Math.abs(Math.sin((j * Math.PI) / 3)) * 0.15,
                      transformOrigin: 'left center',
                      animation: `fadeInOut ${3 + (j % 2)}s ease-in-out infinite`,
                      animationDelay: `${j * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Floating DNA Particles */}
        {[...Array(15)].map((_, i) => {
          const particleColors = [
            'rgba(0, 179, 166, 0.6)', // Main teal
            'rgba(0, 199, 204, 0.5)', // Light cyan
            'rgba(64, 224, 208, 0.4)', // Turquoise
            'rgba(0, 206, 209, 0.5)', // Dark turquoise
            'rgba(175, 238, 238, 0.3)' // Pale turquoise
          ];
          
          return (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 rounded-full opacity-40"
              style={{
                background: particleColors[i % particleColors.length],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                boxShadow: `0 0 4px ${particleColors[i % particleColors.length]}`
              }}
            />
          );
        })}
        
        {/* Flowing Helix Lines */}
        <div className="absolute inset-0 opacity-8" style={{
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(0, 179, 166, 0.2) 20px,
              rgba(0, 179, 166, 0.2) 22px,
              transparent 22px,
              transparent 60px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 20px,
              rgba(0, 199, 204, 0.15) 20px,
              rgba(0, 199, 204, 0.15) 22px,
              transparent 22px,
              transparent 60px
            )
          `,
          backgroundSize: '400px 400px',
          animation: 'slideBackground 20s linear infinite'
        }}></div>
      </div>
      
      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes rotateHelix {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.3; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        @keyframes slideBackground {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 400px 400px, -400px -400px; }
        }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-[1]"></div>

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