'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-12 md:py-24 bg-bg-alt-1 relative overflow-hidden scroll-mt-24">
      {/* Background wave pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="wave-divider"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-navy-deep font-heading">Study Benefits</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-accent to-gold-soft mx-auto mb-8"></div>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto font-body">
          Participating in our study offers several potential advantages for patients with ulcerative colitis.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-6 bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-colors duration-300 border border-white/10">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-teal-accent to-blue-primary p-4 rounded-full w-14 h-14 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold mb-3 text-navy-deep">Access to <span className="relative inline-block">Advanced Treatment<span className="absolute -bottom-1 left-0 w-full h-1 bg-teal-accent rounded-full"></span></span></h3>
              <p className="text-gray-800 font-body">
                Participants may receive access to innovative treatments that are not widely available in standard clinical practice.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6 bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-colors duration-300 border border-white/10">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-teal-accent to-blue-primary p-4 rounded-full w-14 h-14 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold mb-3 text-navy-deep">
                <span className="relative">
                  Expert Care<span className="absolute -bottom-1 left-0 w-full h-1 bg-teal-accent rounded-full"></span>
                  </span> Team
                  
              </h3>
              <p className="text-gray-800 font-body">
                Our specialized team of doctors, nurses, and specialists provide comprehensive care throughout the study.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6 bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-colors duration-300 border border-white/10">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-teal-accent to-blue-primary p-4 rounded-full w-14 h-14 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold mb-3 text-navy-deep flex items-center flex-wrap">
                <span className="relative inline-block mr-1">
                  No Cost
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-teal-accent rounded-full"></span>
                </span>
                <span className="relative inline-block">
                  Treatment
                </span>
              </h3>
              <p className="text-gray-800 font-body">
                Study-related treatments, evaluations, and follow-up visits are provided at no cost to eligible participants.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6 bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-colors duration-300 border border-white/10">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-teal-accent to-blue-primary p-4 rounded-full w-14 h-14 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold mb-3 text-navy-deep">
                <span className="relative inline-block">
                  Medical Advancement
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-teal-accent rounded-full"></span>
                </span>
              </h3>
              <p className="text-gray-800 font-body">
                By participating, you help advance medical knowledge and potentially improve future treatments for this condition.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/#schedule" 
            className="btn-primary inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
          >
            <FontAwesomeIcon icon={faUserCheck} className="h-5 w-5 mr-2" />
            See If You Qualify
          </Link>
        </div>
      </div>
    </section>
  );
} 