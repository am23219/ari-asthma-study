'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-serif tracking-tight">
            About the Study
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00A896] to-[#028090] mx-auto mb-6"></div>
          <p className="text-lg text-white max-w-3xl mx-auto font-light leading-relaxed">
          This is a clinical research study to identify new treatments for metabolic dysfunction-associated steatohepatitis (MASH), also known as nonalcoholic steatohepatitis (NASH) and Fibrosis.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-700 rounded-xl shadow-lg overflow-hidden border border-gray-600 hover:border-[#00A896] transition-all duration-300"
          >
            <div className="p-8">
              <div className="bg-gradient-to-br from-[#00A896] to-[#028090] p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white tracking-wide">Study Purpose</h3>
              <p className="text-gray-200 font-light leading-relaxed">
              This study tests survodutide, a dual-action medication that may not only improve liver health by reducing inflammation and scarring but also address underlying metabolic issues through weight loss and improved blood sugar control.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-slate-700 rounded-xl shadow-lg overflow-hidden border border-gray-600 hover:border-[#00A896] transition-all duration-300"
          >
            <div className="p-8">
              <div className="bg-gradient-to-br from-[#00A896] to-[#028090] p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white tracking-wide">Duration</h3>
              <p className="text-gray-200 font-light leading-relaxed">
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
            className="bg-slate-700 rounded-xl shadow-lg overflow-hidden border border-gray-600 hover:border-[#00A896] transition-all duration-300"
          >
            <div className="p-8">
              <div className="bg-gradient-to-br from-[#00A896] to-[#028090] p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white tracking-wide">Location</h3>
              <p className="text-gray-200 font-light leading-relaxed">
                The study is being conducted at Access Research Institute, located at 11373 Cortez Blvd Building C, Suite 200, Brooksville, FL 34613.
              </p>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/#schedule" 
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-[#00A896] to-[#028090] rounded-full hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="tracking-wide">Schedule Your Consultation</span>
          </Link>
        </div>
      </div>
    </section>
  );
} 

