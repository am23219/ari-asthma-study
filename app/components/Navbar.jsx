'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      <nav className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-center md:justify-between">
            {/* Logo - centered on mobile, left-aligned on desktop */}
            <div className="flex-1 flex justify-center md:justify-start">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={200}
                  height={30}
                  className={`h-auto w-auto max-w-[180px] md:max-w-[250px] transition-all duration-300 ${
                    isScrolled ? '' : 'brightness-0 invert'
                  }`}
                  priority
                />
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#about" className="text-navy-deep hover:text-blue-primary transition-colors duration-200 font-medium nav-link font-heading" data-nav-link="true">
                About
              </Link>
              <Link href="/#benefits" className="text-navy-deep hover:text-blue-primary transition-colors duration-200 font-medium nav-link font-heading" data-nav-link="true">
                Benefits
              </Link>
              <Link href="/#pi" className="text-navy-deep hover:text-blue-primary transition-colors duration-200 font-medium nav-link font-heading" data-nav-link="true">
                Meet the PI
              </Link>
              <Link href="/#enroll" className="text-navy-deep hover:text-blue-primary transition-colors duration-200 font-medium nav-link font-heading" data-nav-link="true">
                How to Enroll
              </Link>
              <Link href="/#contact" className="text-navy-deep hover:text-blue-primary transition-colors duration-200 font-medium nav-link font-heading" data-nav-link="true">
                Contact
              </Link>
              <Link href="/#consultationsection" className="text-navy-deep hover:text-blue-primary transition-colors duration-200 font-medium nav-link font-heading" data-nav-link="true">
                Schedule
              </Link>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2"
              >
                <a 
                  href="tel:3526677237" 
                  className="btn-primary flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Call Now
                </a>
              </motion.div>
            </div>
            
            <button 
              className={`md:hidden p-2 rounded-md absolute right-4 top-1/2 transform -translate-y-1/2 ${isScrolled ? 'text-navy-deep bg-blue-light-bg' : 'text-white bg-white/20'}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu - Dropdown style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed top-[60px] left-0 right-0 z-30 md:hidden"
          >
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-lg overflow-hidden"
              style={{ 
                borderBottomLeftRadius: "12px", 
                borderBottomRightRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div className="flex flex-col divide-y divide-blue-light-bg">
                <Link 
                  href="/#about" 
                  className="px-6 py-4 text-navy-deep hover:bg-blue-light-bg transition-colors duration-200 font-medium flex items-center font-heading"
                  onClick={() => setIsOpen(false)}
                >
                  <span>About</span>
                </Link>
                <Link 
                  href="/#benefits" 
                  className="px-6 py-4 text-navy-deep hover:bg-blue-light-bg transition-colors duration-200 font-medium flex items-center font-heading"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Benefits</span>
                </Link>
                <Link 
                  href="/#pi" 
                  className="px-6 py-4 text-navy-deep hover:bg-blue-light-bg transition-colors duration-200 font-medium flex items-center font-heading"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Meet the PI</span>
                </Link>
                <Link 
                  href="/#enroll" 
                  className="px-6 py-4 text-navy-deep hover:bg-blue-light-bg transition-colors duration-200 font-medium flex items-center font-heading"
                  onClick={() => setIsOpen(false)}
                >
                  <span>How to Enroll</span>
                </Link>
                <Link 
                  href="/#contact" 
                  className="px-6 py-4 text-navy-deep hover:bg-blue-light-bg transition-colors duration-200 font-medium flex items-center font-heading"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Contact</span>
                </Link>
                <Link 
                  href="/#consultationsection" 
                  className="px-6 py-3 text-navy-deep hover:bg-blue-light-bg transition-colors duration-200 font-medium flex items-center font-heading"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Schedule</span>
                </Link>
                <div className="px-6 py-4 bg-blue-light-bg">
                  <a 
                    href="tel:3526677237" 
                    className="btn-primary w-full text-center flex items-center justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Call Now
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 