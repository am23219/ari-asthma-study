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
      question: "What is a clinical trial?",
      answer: "A clinical trial is a research study that evaluates new medical treatments, interventions, or devices to determine if they're safe and effective for humans. These studies follow strict scientific standards and regulatory guidelines to protect participants' safety and rights. By participating in our clinical trial, you're helping to advance medical knowledge and potentially improve future treatments for this disease."
    },
    {
      question: "What are the benefits of participating?",
      answer: "You'll receive close monitoring of your liver condition at no cost, including specialized tests that might not be part of regular care. If you receive the active medication and it works, you may experience improvement in your liver condition and possibly weight loss. However, there's no guarantee you'll receive the active medication or that it will work for you."
    },
    {
      question: "What happens after my screening call?",
      answer: "If you appear eligible and are interested, a study coordinator will contact you to schedule an in-person screening visit. This will include blood tests, a review of your medical history, and imaging tests to confirm if you qualify for the study."
    },
    {
      question: "What does participation involve?",
      answer: "Participation involves visits to our clinic in Brooksville, FL. During the first few months, visits will be more frequent (approximately every 1-2 weeks) as you start the medication. After that, visits will be less frequent during the long-term follow-up period. You will be compensated for your time and travel."
    },
    {
      question: "Is the treatment safe?",
      answer: "The treatment being studied has undergone initial safety testing and is approved for this clinical trial. Throughout the study, our medical team closely monitors all participants for any potential side effects or complications. Your safety is our top priority."
    },
    {
      question: "Do I need insurance to participate?",
      answer: "No, you do not need insurance to participate. All study-related care is provided at no cost to qualified participants."
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
            Find answers to common questions about our clinical research study.
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
                            {faq.answer.split('. ').map((sentence, i, arr) => (
                              <span key={i} className="answer-sentence">
                                {sentence}{i < arr.length - 1 ? '.' : ''}
                                {i < arr.length - 1 && ' '}
                              </span>
                            ))}
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
                                  <span>Access to innovative treatment</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-light-bg text-blue-primary mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                  <span>Close monitoring by medical professionals</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-light-bg text-blue-primary mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                  <span>Contribute to medical advancements</span>
                                </li>
                              </ul>
                            </div>
                          )}
                          
                          {/* Process steps */}
                          {index === 2 && (
                            <div className="mt-5 space-y-3">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-primary text-white flex items-center justify-center mr-3 font-medium text-sm">1</div>
                                <div>
                                  <p className="font-medium text-navy-deep">Initial screening call</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-primary text-white flex items-center justify-center mr-3 font-medium text-sm">2</div>
                                <div>
                                  <p className="font-medium text-navy-deep">In-person screening visit</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-primary text-white flex items-center justify-center mr-3 font-medium text-sm">3</div>
                                <div>
                                  <p className="font-medium text-navy-deep">Eligibility determination</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Important note */}
                          {index === 5 && (
                            <div className="flex items-start mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="flex-shrink-0 text-blue-primary mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-sm text-blue-800">
                                All study medications, procedures, and visits are provided at no cost to qualified participants.
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