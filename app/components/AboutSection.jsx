'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

export default function AboutSection() {
  return (
    <section id="about" className="py-12 md:py-24 bg-bg-alt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-5 text-navy-deep font-heading tracking-tight">
            About the Study
          </h2> 
          <div className="w-24 h-1 bg-gradient-to-r from-blue-primary to-navy-deep mx-auto mb-6"></div>
          <p className="text-lg text-gray-800 max-w-3xl mx-auto font-body leading-relaxed">
          This is a clinical research study to identify new treatments for metabolic dysfunction-associated steatohepatitis (MASH), also known as nonalcoholic steatohepatitis (NASH) and Fibrosis.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-teal-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="p-6 md:p-7">
              <div className="bg-gradient-to-br from-blue-primary to-navy-deep p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-navy-deep font-heading tracking-wide">Study Purpose</h3>
              <p className="text-base text-gray-700 font-body leading-relaxed">
              This study tests survodutide, a dual-action medication that may not only improve liver health by reducing inflammation and scarring but also address underlying metabolic issues through weight loss and improved blood sugar control.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-teal-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="p-6 md:p-7">
              <div className="bg-gradient-to-br from-blue-primary to-navy-deep p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-navy-deep font-heading tracking-wide">Duration</h3>
              <p className="text-base text-gray-700 font-body leading-relaxed">
              Study duration time varies, but typically lasts about 7 years. There will be
different amounts of time that pass between each visit throughout the study (example: every 6 weeks). Some visits may be conducted remotely. The
study team will go over the appointment schedule with you and address any questions you may
have.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-teal-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="p-6 md:p-7">
              <div className="bg-gradient-to-br from-blue-primary to-navy-deep p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-navy-deep font-heading tracking-wide">Location</h3>
              <p className="text-base text-gray-700 font-body leading-relaxed">
                The study is being conducted at <strong>Access Research Institute</strong>, located at <strong>11373 Cortez Blvd Building C, Suite 200, Brooksville, FL 34613</strong>.
              </p>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/#schedule" 
            className="btn-primary inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-primary rounded-full hover:bg-navy-deep transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FontAwesomeIcon icon={faClipboardCheck} className="h-5 w-5 mr-2" />
            <span className="tracking-wide">Schedule Your Consultation</span>
          </Link>
        </div>
      </div>
    </section>
  );
} 

