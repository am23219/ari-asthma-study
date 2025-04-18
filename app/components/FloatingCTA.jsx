'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

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
            className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-blue-primary to-navy-deep hover:from-navy-deep hover:to-blue-primary text-white font-medium px-3 md:px-5 py-2.5 md:py-3 rounded-full shadow-md transition-all duration-300 hover:shadow-lg text-sm md:text-base font-heading"
          >
            <FontAwesomeIcon icon={faCalendarCheck} className="h-4 w-4 md:h-5 md:w-5 opacity-90" />
            <span className="hidden sm:inline">Schedule Free Evaluation</span>
            <span className="sm:hidden">Free Evaluation</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 