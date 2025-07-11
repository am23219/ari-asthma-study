'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAppleWhole, 
  faHeartPulse, 
  faFileLines, 
  faHandshake, 
  faUserGroup,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';

export default function ParticipationBenefitsSection() {
  const benefits = [
    {
      icon: faHeartPulse,
      text: 'Receive <span class="text-teal-accent font-semibold">close monitoring of your asthma</span> by a team of specialists. This includes advanced lung imaging to see how your airways respond to treatment, offering insights not available through standard care.'
    },
    {
      icon: faCalendarCheck,
      text: 'Experience a <span class="text-teal-accent font-semibold">simpler treatment schedule</span>. The investigational medication is given only twice a year, which could mean fewer clinic visits and less disruption to your life compared to other biologics.'
    },
    {
      icon: faFileLines,
      text: 'Gain a deeper <span class="text-teal-accent font-semibold">understanding of your specific type of asthma</span> and how new treatments are being developed to target it.'
    },
    {
      icon: faHandshake,
      text: 'Become a <span class="text-teal-accent font-semibold">vital partner</span> in the effort to advance asthma research and develop more effective, convenient therapies.'
    },
    {
      icon: faUserGroup,
      text: 'Help <span class="text-teal-accent font-semibold">improve the lives of millions</span> of people who struggle with severe asthma in the future.'
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
            What Does Participation Involve?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-primary to-navy-deep mx-auto mb-6"></div>
          <p className="text-lg text-gray-800 max-w-3xl mx-auto font-body leading-relaxed">
            Taking part in the IMAGINE study is an opportunity to contribute to medical science and potentially benefit from a new approach to asthma care. Here's what it could mean for you:
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