'use client';

import Image from "next/image";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

export default function MeetPISection() {
  return (
    <section id="pi" className="py-12 md:py-24 bg-bg-alt-3 relative overflow-hidden">
      {/* Background wave pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="wave-divider"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/3 max-w-[280px] mx-auto md:mx-0 mb-8 md:mb-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-primary to-navy-deep transform rotate-6 rounded-2xl"></div>
              <Image
                src="/doctor.jpg"
                alt="Dr. Luis R. Aponte"
                width={400}
                height={500}
                className="relative rounded-2xl shadow-xl"
                priority
              />
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy-deep font-heading mb-4">Meet your Doctor!</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-primary to-navy-deep mb-6 md:mb-8 mx-auto md:mx-0"></div>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-navy-deep mb-4">Dr. Salman Muddassir, MD, FACP</h3>
            </motion.div>
            
            <div className="space-y-5 md:space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-blue-primary"
              >
                <p className="text-gray-700 text-base md:text-lg font-body">
                  Dr. Salman currently serves as program director for the Internal Medicine Residency Program at Oak Hill Hospital. 
                  
                  He received his medical degree from Quaid-e-Azam University and his pre-medical training was at Sir Syed College. He then served for 13 years at Seton Hall University Internal Medicine Program at Saint Francis Medical Center in New Jersey where he completed his internal medicine residency and was a chief resident.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 my-5 md:my-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white p-4 md:p-5 rounded-lg shadow-md border-t-4 border-teal-accent text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-teal-accent/10 text-teal-accent mb-3 md:mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-teal-accent text-lg md:text-xl mb-1 font-heading">Board Certified</h4>
                  <p className="text-base md:text-lg text-gray-700 font-body font-semibold">Internal Medicine</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white p-4 md:p-5 rounded-lg shadow-md border-t-4 border-blue-primary text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-primary/10 text-blue-primary mb-3 md:mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-blue-primary text-lg md:text-xl mb-1 font-heading">Top Physician</h4>
                  <p className="text-base md:text-lg text-gray-700 font-body font-semibold">Consumer Research Council of America 2010, 2011, 2014 & 2015</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white p-4 md:p-5 rounded-lg shadow-md border-t-4 border-navy-deep text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-navy-deep/10 text-navy-deep mb-3 md:mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-navy-deep text-lg md:text-xl mb-1 font-heading">20+ Years</h4>
                  <p className="text-base md:text-lg text-gray-700 font-body font-semibold">Clinical Experience</p>
                </motion.div>
              </div>
              
              <motion.blockquote 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="pl-4 md:pl-6 border-l-4 border-blue-primary italic text-base md:text-lg text-gray-800 font-body bg-white p-3 md:p-4 rounded-r-lg shadow-md"
              >
               "As a doctor, I see how challenging ulcerative colitis can be. This study is a way for us to explore potential options that may help people feel better and live healthier lives. Every person who joins helps us move one step closer to better care in the future."
              </motion.blockquote>
            </div>
          </div>
        </div>
        
        <div className="mt-8 md:mt-12 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/#schedule" 
              className="btn-primary inline-flex items-center justify-center px-5 py-3 md:px-6 md:py-3 text-sm md:text-base font-medium text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300 w-full sm:w-auto"
            >
              <FontAwesomeIcon icon={faCalendarCheck} className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Schedule Your Free Evaluation
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 