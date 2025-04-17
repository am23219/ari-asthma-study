'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // Start with first FAQ open

  const faqs = [
    {
      question: "What is a clinical trial?",
      answer: "A clinical trial is a research study that evaluates new medical treatments, interventions, or devices to determine if they're safe and effective for humans. These studies follow strict scientific standards and regulatory guidelines to protect participants' safety and rights. By participating in our clinical trial, you're helping to advance medical knowledge and potentially improve future treatments for liver disease."
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

  return (
    <section id="faq" className="py-16 md:py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #00A896 0%, #028090 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-white"></div>
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-white"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about our clinical research study.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-8"
            >
              <div 
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'ring-4 ring-white/30' : ''
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 sm:px-8 py-5 flex justify-between items-center text-left focus:outline-none group"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className={`font-medium text-base md:text-lg pr-4 transition-colors duration-300 ${
                    openIndex === index ? 'text-teal-600 dark:text-teal-400' : 'text-slate-800 dark:text-white'
                  }`}>
                    {faq.question}
                  </span>
                  <span className={`flex-shrink-0 ml-2 p-2 rounded-full transition-all duration-300 ${
                    openIndex === index 
                      ? 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300' 
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                  }`}>
                    {openIndex === index ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
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
                          height: { duration: 0.4 },
                          opacity: { duration: 0.3, delay: 0.1 }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: { 
                          height: { duration: 0.3 },
                          opacity: { duration: 0.2 }
                        }
                      }}
                      className="overflow-hidden"
                      id={`faq-answer-${index}`}
                    >
                      <div className="px-6 sm:px-8 pb-8 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="prose prose-sm md:prose max-w-none text-slate-600 dark:text-slate-300">
                          <p className="leading-relaxed tracking-wide">
                            {index === 2 ? (
                              <>
                                {faq.answer}
                              </>
                            ) : index === 4 ? (
                              <>
                                {faq.answer}
                              </>
                            ) : index === 5 ? (
                              <>
                                {faq.answer}
                              </>
                            ) : (
                              faq.answer
                            )}
                          </p>
                          
                          {/* Visual indicator at the bottom */}
                          <div className="mt-4 flex items-center">
                            <div className="h-1 w-12 bg-teal-200 dark:bg-teal-800 rounded-full"></div>
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
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-white mb-6 text-base md:text-lg">
            Have more questions about the study?
          </p>
          <Link 
            href="/#contact" 
            className="inline-flex items-center justify-center px-6 py-3 md:py-4 bg-white text-teal-600 hover:bg-teal-50 rounded-full font-medium transition-all shadow-xl hover:shadow-2xl text-base md:text-lg group"
          >
            <span>Contact Our Research Team</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 md:h-6 md:w-6 ml-2 transform transition-transform group-hover:translate-x-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 