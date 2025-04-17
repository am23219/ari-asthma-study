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
  return (
    <section id="benefits" className="py-16 md:py-24 bg-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-serif tracking-tight">
            What would taking part mean for me?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00A896] to-[#028090] mx-auto mb-6"></div>
          <p className="text-lg text-white max-w-3xl mx-auto font-light leading-relaxed">
            Taking part in one of the studies may provide you with an opportunity to:
          </p>
        </motion.div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Benefit 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-800 rounded-lg p-6 border-t border-b border-[#00A896]"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#00A896] to-[#028090] rounded-full">
                  <FontAwesomeIcon icon={faAppleWhole} className="text-white text-3xl" />
                </div>
              </div>
              <div>
                <p className="text-xl font-medium text-white">
                  Receive <span className="text-[#5FC3C3]">long-term nutrition and physical activity advice</span> to support you in adopting healthier lifestyle choices.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefit 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-800 rounded-lg p-6 border-t border-b border-[#00A896]"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#00A896] to-[#028090] rounded-full">
                  <FontAwesomeIcon icon={faHeartPulse} className="text-white text-3xl" />
                </div>
              </div>
              <div>
                <p className="text-xl font-medium text-white">
                  Have <span className="text-[#5FC3C3]">in-depth, long-term monitoring of your health</span>. This includes access to specialist medical tests that would not be part of standard care outside of a clinical study.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefit 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-800 rounded-lg p-6 border-t border-b border-[#00A896]"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#00A896] to-[#028090] rounded-full">
                  <FontAwesomeIcon icon={faFileLines} className="text-white text-3xl" />
                </div>
              </div>
              <div>
                <p className="text-xl font-medium text-white">
                  Gain in-depth understanding of <span className="text-[#5FC3C3]">your overall health</span>.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefit 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-slate-800 rounded-lg p-6 border-t border-b border-[#00A896]"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#00A896] to-[#028090] rounded-full">
                  <FontAwesomeIcon icon={faHandshake} className="text-white text-3xl" />
                </div>
              </div>
              <div>
                <p className="text-xl font-medium text-white">
                  Be a <span className="text-[#5FC3C3]">partner</span> in this quest to help improve understanding of Ulcerative Colitis.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefit 5 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-slate-800 rounded-lg p-6 border-t border-b border-[#00A896]"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#00A896] to-[#028090] rounded-full">
                  <FontAwesomeIcon icon={faUserGroup} className="text-white text-3xl" />
                </div>
              </div>
              <div>
                <p className="text-xl font-medium text-white">
                  Potentially <span className="text-[#5FC3C3]">help other people with Ulcerative Colitis</span> in the future.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 