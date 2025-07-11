'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useFacebookTracking } from '../hooks/useFacebookTracking';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // Start with first FAQ open
  const { trackCallButtonClick, trackPhoneInteraction } = useFacebookTracking();

  const faqs = [
    {
      question: "What is the purpose of the IMAGINE study?",
      answer: "The IMAGINE study is evaluating an investigational antibody treatment called depemokimab. We want to see if it can improve lung structure and function in people with a specific type of severe asthma. The treatment is unique because it's given only twice a year."
    },
    {
      question: "Who is eligible to participate in this study?",
      answer: "We are looking for adults (18+) who have had a diagnosis of severe asthma for at least two years. Participants should have a history of asthma attacks despite using their regular controller medications. The study team will perform tests during a screening visit to see if you qualify for this specific type of asthma research."
    },
    {
      question: "What is the investigational treatment?",
      answer: "The investigational treatment is depemokimab, a biologic therapy that targets Interleukin-5 (IL-5), a substance in the body that can cause airway inflammation in some types of asthma. It's designed to be \"ultra-long-acting,\" which is why it's administered only every 6 months."
    },
    {
      question: "What does participation involve?",
      answer: "The study lasts about 65 weeks. It includes a screening period, a 52-week treatment period where you will receive two injections of the study drug, and a follow-up period. You will have regular visits with our study team, which will include breathing tests and advanced lung imaging (HRCT scans)."
    },
    {
      question: "Are there any costs to participate?",
      answer: "No. All study-related visits, tests, and the investigational medication are provided at no cost to you. You do not need health insurance to participate. You may also be compensated for your time and travel."
    },
    {
      question: "What is a bronchoscopy and will I have to do it?",
      answer: "A bronchoscopy is a procedure where a doctor uses a thin tube with a camera to look inside your lungs. For the IMAGINE study, this is part of an optional sub-study for a small group of participants. You can participate in the main study without having a bronchoscopy. If you are eligible and interested in the sub-study, the team will explain it in detail."
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCallClick = async () => {
    await trackCallButtonClick({
      location: 'faq_section',
      customData: {
        button_text: 'Call Our Friendly Team',
        component: 'FAQSection'
      }
    });

    await trackPhoneInteraction('3526677237', {
      location: 'faq_section',
      customData: {
        component: 'FAQSection'
      }
    });
  };

  return (
    <section id="faq" className="py-16 md:py-28 bg-gradient-to-b from-bg-alt-3 to-white relative overflow-hidden scroll-mt-24">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-primary blur-3xl"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-teal-accent blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-blue-primary blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-deep mb-6 font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-body">
            Find answers to common questions about the IMAGINE study and what it means to participate.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto space-y-5 md:space-y-7">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div 
                className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border ${
                  openIndex === index 
                    ? 'border-blue-primary shadow-blue-primary/20' 
                    : 'border-transparent hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 sm:px-7 md:px-8 py-5 md:py-6 flex justify-between items-center text-left focus:outline-none focus:ring-0 rounded-t-2xl group"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className={`font-medium text-lg md:text-xl pr-4 transition-colors duration-300 font-heading ${
                    openIndex === index ? 'text-blue-primary' : 'text-navy-deep group-hover:text-blue-primary'
                  }`}>
                    {faq.question}
                  </span>
                  <span className={`flex-shrink-0 ml-2 p-2.5 rounded-full transition-all duration-300 ${
                    openIndex === index 
                      ? 'bg-blue-light-bg text-blue-primary transform rotate-180' 
                      : 'bg-slate-100 text-navy-deep group-hover:bg-blue-light-bg group-hover:text-blue-primary'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: "auto", 
                        opacity: 1,
                        transition: { 
                          height: { duration: 0.4, ease: "easeOut" },
                          opacity: { duration: 0.3, delay: 0.1 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: { 
                          height: { duration: 0.3, ease: "easeIn" },
                          opacity: { duration: 0.2 }
                        }
                      }}
                      className="overflow-hidden"
                      id={`faq-answer-${index}`}
                    >
                      <div className="px-6 sm:px-7 md:px-8 pb-8 pt-1 border-t border-blue-light-bg bg-gradient-to-br from-white to-blue-50/50">
                        <div className="mt-4 mb-2 text-gray-700">
                          <p className="leading-relaxed tracking-wide font-body text-base md:text-lg">
                            {faq.answer}
                          </p>
                          
                          {/* Key points or benefits */}
                          {index === 1 && (
                            <div className="mt-5 pl-4 border-l-4 border-teal-accent">
                              <ul className="space-y-2 text-navy-deep">
                                <li className="flex items-start">
                                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-light-bg text-blue-primary mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                  <span>Adults 18+ with severe asthma</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-light-bg text-blue-primary mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                  <span>History of asthma attacks</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-light-bg text-blue-primary mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                  <span>Currently on controller medication</span>
                                </li>
                              </ul>
                            </div>
                          )}
                          
                          {/* Process steps */}
                          {index === 3 && (
                            <div className="mt-5 space-y-3">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-primary text-white flex items-center justify-center mr-3 font-medium text-sm">1</div>
                                <div>
                                  <p className="font-medium text-navy-deep">Screening Period</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-primary text-white flex items-center justify-center mr-3 font-medium text-sm">2</div>
                                <div>
                                  <p className="font-medium text-navy-deep">52-week treatment (2 injections)</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-primary text-white flex items-center justify-center mr-3 font-medium text-sm">3</div>
                                <div>
                                  <p className="font-medium text-navy-deep">Follow-up Period</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Important note */}
                          {index === 4 && (
                            <div className="flex items-start mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="flex-shrink-0 text-blue-primary mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-sm text-blue-800">
                                All study medications, procedures, and visits are provided at no cost to qualified participants. Compensation for time and travel may also be available.
                              </p>
                            </div>
                          )}
                          
                          {/* Visual indicator */}
                          <div className="flex items-center mt-6">
                            <div className="h-1.5 w-16 bg-gradient-to-r from-blue-primary to-teal-accent rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-navy-deep mb-6 text-lg md:text-xl font-medium font-heading">
            Have more questions about the study?
          </p>
          <Link 
            href="/#contact" 
            className="inline-flex items-center justify-center px-7 py-4 bg-gradient-to-r from-blue-primary to-blue-primary/90 text-white hover:from-blue-primary/90 hover:to-blue-primary rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-primary/20 text-base md:text-lg group font-heading no-underline hover:no-underline"
            style={{ textDecoration: 'none' }}
            onClick={handleCallClick}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 md:h-6 md:w-6 mr-2 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
              />
            </svg>
            <span className="text-white">Call Our Friendly Team</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 