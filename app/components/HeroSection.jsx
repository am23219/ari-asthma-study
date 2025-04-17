'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import LeadCaptureForm from "./LeadCaptureForm";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 md:py-20 overflow-hidden">
      {/* Background image with enhanced overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/treatment-image.jpg"
          alt="Treatment"
          fill
          className="object-cover"
          style={{ objectPosition: "30% center" }}
          priority
          quality={100}
          sizes="100vw"
        />
        {/* Enhanced gradient overlay with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F3B57]/90 via-[#152A3F]/85 to-[#0E1F2F]/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8">
          {/* Left side - Text content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mt-2 md:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6 text-white leading-tight tracking-tight" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8)' }}>
                Have you been <span className="block">struggling with</span> <span className="text-[#00A896] drop-shadow-lg">Fatty Liver Disease?</span>
              </h1>
              <p className="text-lg md:text-xl text-white mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.6)' }}>
                Join our clinical research study evaluating whether survodutide, an injectable medication, can prevent liver complications and potentially improve liver health in patients with compensated cirrhosis due to MASH.
              </p>
              
              <div className="mb-6 md:mb-10">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center text-left" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.6)' }}>
                  <span className="bg-[#00A896] h-8 w-2 mr-3 rounded-full"></span>
                  Study Benefits
                </h3>
                <ul className="space-y-3 md:space-y-5 max-w-xl lg:mx-0">
                  <li className="flex items-center bg-white/10 hover:bg-white/15 transition-colors rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <div className="bg-[#00A896] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-medium text-white">No Cost</span>
                  </li>
                  <li className="flex items-center bg-white/10 hover:bg-white/15 transition-colors rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <div className="bg-[#00A896] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-medium text-white">Free Transportation via Uber</span>
                  </li>
                  <li className="flex items-center bg-white/10 hover:bg-white/15 transition-colors rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <div className="bg-[#00A896] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-medium text-white">Compensation Provided</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Right side - Eligibility Form */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-5 md:p-8 border border-white/20"
            >
              <h2 className="text-xl md:text-3xl font-bold text-center mb-3 md:mb-4 text-primary font-serif">
                Quick 30-Second Eligibility Check
              </h2>
              
              <p className="text-center text-gray-600 dark:text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
                Answer a few simple questions to see if you qualify for the study.
              </p>
              
              <LeadCaptureForm />
              
              <p className="text-xs text-center text-gray-500 mt-4">
                Your information is secure and will only be used to determine study eligibility.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 