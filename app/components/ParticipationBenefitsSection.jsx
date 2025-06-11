'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAppleWhole, 
  faHeartPulse, 
  faFileLines, 
  faHandshake, 
  faUserGroup 
} from '@fortawesome/free-solid-svg-icons';

export default function ParticipationBenefitsSection() {
  const benefits = [
    {
      icon: faHeartPulse,
      text: 'Have <span class="text-teal-accent font-semibold">in-depth, long-term monitoring of your liver health</span> (as well as any associated conditions such as type 2 diabetes and high blood pressure by experts in this field of medicine). This includes access to specialist medical tests that would not be part of standard care outside of a clinical study.'
    },
    {
      icon: faAppleWhole,
      text: 'Receive <span class="text-teal-accent font-semibold">long-term nutrition and physical activity advice</span> to support you in adopting healthier lifestyle choices.'
    },
    {
      icon: faFileLines,
      text: 'Gain in-depth <span class="text-teal-accent font-semibold">understanding of your condition</span>.'
    },
    {
      icon: faHandshake,
      text: 'Be a <span class="text-teal-accent font-semibold">partner</span> in this quest to help improve understanding of MASH.'
    },
    {
      icon: faUserGroup,
      text: 'Potentially <span class="text-teal-accent font-semibold">help other people with MASH</span> in the future.'
    }
  ];

  return (
    <section id="participation-benefits" className="py-12 md:py-24 bg-gray-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-5 text-navy-deep font-heading tracking-tight">
            What Would Taking Part Mean for Me?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-primary to-navy-deep mx-auto mb-6"></div>
          <p className="text-lg text-gray-800 max-w-3xl mx-auto font-body leading-relaxed">
            Taking part in this study may provide you with an opportunity to:
          </p>
        </motion.div>

        <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              className="bg-gray-50 rounded-xl p-4 md:p-6 shadow-xl border border-gray-200 border-l-4 border-l-teal-accent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-primary to-navy-deep rounded-full shadow-lg">
                    <FontAwesomeIcon icon={benefit.icon} className="text-white text-2xl" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-lg md:text-xl font-medium text-gray-700 font-body leading-relaxed" 
                     dangerouslySetInnerHTML={{ __html: benefit.text }}>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 