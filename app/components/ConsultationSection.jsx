'use client';

import LeadCaptureForm from "./LeadCaptureForm";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ConsultationSection() {
  return (
    <section id="consultationsection" className="py-12 md:py-24 bg-bg-alt-1 relative overflow-hidden scroll-mt-24">
      {/* Background wave pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="wave-divider"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-navy-deep font-heading">
              Schedule Your <span className="relative inline-block">
                <span className="relative z-10">Free</span>
                <span className="absolute -bottom-1 left-0 w-full h-3 bg-teal-accent opacity-30 rounded"></span>
              </span> Evaluation
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-light to-teal-accent mx-auto mb-6"></div>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto font-body">
              Find out if your a good fit for the study. Our team will contact you within 24 hours.
            </p>
          </motion.div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-6xl mx-auto">
          <motion.div 
            className="lg:w-5/12 bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-primary to-teal-accent transform rotate-3 rounded-2xl"></div>
              <Image 
                src="/treatment.png"
                alt="Doctor and patient discussing treatment options"
                width={600}
                height={300}
                className="relative w-full h-[250px] rounded-xl object-cover"
                priority
              />
            </div>
            
            <h3 className="text-2xl font-heading font-bold mb-4 text-navy-deep">Why Schedule Today?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-blue-primary to-teal-accent p-2 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-navy-deep text-base font-heading">Limited Enrollment Period</p>
                  <p className="text-gray-700 text-sm font-body">We can only accept a limited number of participants for this study.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-blue-primary to-teal-accent p-2 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-navy-deep text-base font-heading">No-Cost Evaluation</p>
                  <p className="text-gray-700 text-sm font-body">Your consultation and all study-related care is provided <span className="text-navy-deep font-medium border-b border-teal-accent">at no cost to you</span>.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-blue-primary to-teal-accent p-2 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-navy-deep text-base font-heading">No Obligation</p>
                  <p className="text-gray-700 text-sm font-body">The consultation is informational only - you decide if the study is right for you.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-7/12 bg-white rounded-xl shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Header accent */}
            <div className="bg-gradient-to-r from-blue-primary to-teal-accent h-2 w-full"></div>
            
            <div className="p-8 md:p-10">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-light/10 to-teal-accent/10 rounded-bl-full -z-10"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-primary/10 to-blue-light/10 rounded-tr-full -z-10"></div>
              
              {/* Radial glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-light/5 rounded-full blur-3xl -z-20"></div>
              
              {/* Subtle pattern background */}
              <div className="absolute inset-0 opacity-5 -z-20" 
                   style={{ 
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                     backgroundSize: '20px 20px'
                   }}>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-2xl font-heading font-bold mb-2 text-center text-navy-deep">Check Your Eligibility Now</h3>
                <p className="text-center text-gray-600 mb-8">Complete this quick form to see if you qualify</p>
              </motion.div>
              
              <div className="w-full">
                <LeadCaptureForm context="consultation" />
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 italic">Your information is secure and will never be shared with third parties</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 