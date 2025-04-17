'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50"
        >
          <Link 
            href="/#schedule"
            className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-[#00A896] to-[#028090] hover:from-[#028090] hover:to-[#00A896] text-white font-medium px-3 md:px-5 py-2.5 md:py-3 rounded-full shadow-md transition-all duration-300 hover:shadow-lg text-sm md:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 opacity-90" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Schedule <span className="relative inline-block">
              <span className="relative z-10">Free</span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-white opacity-20 rounded"></span>
            </span> Consultation</span>
            <span className="sm:hidden">
Free Consult</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 