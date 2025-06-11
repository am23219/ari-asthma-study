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
            Ready to join our clinical study? It's simple. Just follow these easy steps.
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
                  Schedule your first chat with our friendly team. We'll talk about your health and see if this study is a <span className="font-medium text-blue-primary border-b border-blue-primary hover:border-b-2 transition-all">good fit for you</span>.
                </p>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-blue-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-20 hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="md:w-1/2 md:pl-12 pl-12 hover:md:pl-14 transition-all duration-300">
                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-light-bg/50">
                  <p className="text-gray-700 font-body">
                    We'll go over your health background, current care, and understand your condition better.
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
                    We'll walk you through everything about the study – the <span className="font-medium text-blue-primary">potential benefits and risks</span>, what to expect, and answer all your questions.
                  </p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-blue-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-20 hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="md:w-1/2 md:pl-12 order-1 md:order-2 pl-12 mb-6 hover:md:pl-14 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-3 text-navy-deep font-heading">Screening Process</h3>
                <p className="text-gray-700 leading-relaxed font-body">
                  Next, we'll do a quick check-up to make sure the study is right for your specific needs.
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
                  If you feel ready to move forward, you'll review and sign the informed consent form.
                </p>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-blue-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-20 hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="md:w-1/2 md:pl-12 pl-12 hover:md:pl-14 transition-all duration-300">
                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-light-bg/50">
                  <p className="text-gray-700 font-body">
                    This important paper explains everything: what happens in the study, the timeline, and your rights as a participant.
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
                    You'll get a <span className="font-medium text-blue-primary">personalized treatment plan</span> made just for you, along with a clear schedule for your participation.
                  </p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-blue-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-20 hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold">4</span>
              </div>
              <div className="md:w-1/2 md:pl-12 order-1 md:order-2 pl-12 mb-6 hover:md:pl-14 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-3 text-navy-deep font-heading">Begin Treatment</h3>
                <p className="text-gray-700 leading-relaxed font-body">
                  Embark on your study journey and begin your first treatment session!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 