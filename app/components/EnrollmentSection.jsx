// No need for changes here

'use client';

import { motion } from 'framer-motion';

export default function EnrollmentSection() {
  return (
    <section id="enroll" className="py-12 md:py-24 bg-bg-alt-2 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight text-navy-deep font-heading">How to Enroll</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-primary to-navy-deep mx-auto mb-8"></div>
          <p className="text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed font-body">
            Interested in participating in the IMAGINE study? Our enrollment process is straightforward and designed to ensure this study is the right fit for you.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-blue-primary/20 transform md:translate-x-0 translate-x-4"></div>
            
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row mb-16 relative z-10"
            >
              <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0 pl-12 md:pl-0 hover:md:pr-14 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-3 text-navy-deep font-heading">Initial Consultation</h3>
                <p className="text-gray-700 leading-relaxed font-body">
                  The first step is a conversation with our study team. We'll discuss your asthma history and answer your initial questions to see if the IMAGINE study might be a good match.
                </p>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-blue-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-20 hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="md:w-1/2 md:pl-12 pl-12 hover:md:pl-14 transition-all duration-300">
                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-light-bg/50">
                  <p className="text-gray-700 font-body">
                    This is a no-commitment chat to review your medical history and current asthma treatments.
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col md:flex-row mb-16 relative z-10"
            >
              <div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1 pl-12 md:pl-0 mb-6 md:mb-0 hover:md:pr-14 transition-all duration-300">
                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-light-bg/50">
                  <p className="text-gray-700 font-body">
                    During this visit, we'll explain the study in detail, including what participation involves, and ensure all your questions are answered.
                  </p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-blue-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-20 hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="md:w-1/2 md:pl-12 order-1 md:order-2 pl-12 mb-6 hover:md:pl-14 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-3 text-navy-deep font-heading">Eligibility Screening</h3>
                <p className="text-gray-700 leading-relaxed font-body">
                  If the initial chat goes well, we will schedule a screening visit. This involves tests to confirm your eligibility, such as breathing tests and a blood sample to check for the specific type of asthma being studied.
                </p>
              </div>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col md:flex-row mb-16 relative z-10"
            >
              <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0 pl-12 md:pl-0 hover:md:pr-14 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-3 text-navy-deep font-heading">Informed Consent</h3>
                <p className="text-gray-700 leading-relaxed font-body">
                  After the screening visit, you'll have time to decide if you want to participate. If you do, you'll sign the informed consent form to officially enroll.
                </p>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-blue-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-20 hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="md:w-1/2 md:pl-12 pl-12 hover:md:pl-14 transition-all duration-300">
                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-light-bg/50">
                  <p className="text-gray-700 font-body">
                    This document outlines all aspects of the study, including procedures, schedule, and your rights as a participant. It's to ensure you're making a fully informed decision.
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Step 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col md:flex-row relative z-10"
            >
              <div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1 pl-12 md:pl-0 mb-6 md:mb-0 hover:md:pr-14 transition-all duration-300">
                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-light-bg/50">
                  <p className="text-gray-700 font-body">
                    You will receive the first of two injections of the investigational medication and a schedule for your upcoming study visits.
                  </p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-blue-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-20 hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold">4</span>
              </div>
              <div className="md:w-1/2 md:pl-12 order-1 md:order-2 pl-12 mb-6 hover:md:pl-14 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-3 text-navy-deep font-heading">Start the Study</h3>
                <p className="text-gray-700 leading-relaxed font-body">
                  Once enrolled, you will be scheduled for your first visit to receive the investigational treatment and begin the 52-week treatment period.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 