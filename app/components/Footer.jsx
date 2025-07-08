'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#003F73] to-[#0077CC] py-10 md:py-16 relative overflow-hidden">
      {/* Background wave pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="wave-divider"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          <div>
            <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-4 md:mb-6">CKD Study</h3>
            <p className="text-white text-sm md:text-base font-body">
            Advancing treatment options for people living with Chronic Kidney Disease.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-4 md:mb-6">Quick Links</h3>
            <ul className="space-y-2 md:space-y-4">
              <li>
                <Link 
                  href="/#about" 
                  className="text-white hover:text-teal-accent transition-colors duration-200 text-sm md:text-base font-body footer-link"
                >
                  About the Study
                </Link>
              </li>
              <li>
                <Link 
                  href="/#pi" 
                  className="text-white hover:text-teal-accent transition-colors duration-200 text-sm md:text-base font-body footer-link"
                >
                  Meet the PI
                </Link>
              </li>
              <li>
                <Link 
                  href="/#benefits" 
                  className="text-white hover:text-teal-accent transition-colors duration-200 text-sm md:text-base font-body footer-link"
                >
                  Benefits
                </Link>
              </li>
              <li>
                <Link 
                  href="/#enroll" 
                  className="text-white hover:text-teal-accent transition-colors duration-200 text-sm md:text-base font-body footer-link"
                >
                  How to Enroll
                </Link>
              </li>
              <li>
                <Link 
                  href="/#faq" 
                  className="text-white hover:text-teal-accent transition-colors duration-200 text-sm md:text-base font-body footer-link"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-4 md:mb-6">Contact Us</h3>
            <p className="text-white mb-3 md:mb-4 text-sm md:text-base font-body">
              Have questions about the study?
            </p>
            <Link 
              href="/#contact" 
              className="inline-flex items-center text-white hover:text-teal-accent transition-colors duration-200 text-sm md:text-base font-body footer-link"
            >
              <span>Get in touch with our team</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 md:h-5 md:w-5 ml-2" 
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
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-xs md:text-sm mb-3 md:mb-0 text-center md:text-left font-body">
              © {new Date().getFullYear()} Access Research Institute. All rights reserved.
            </p>
            <div className="flex space-x-4 md:space-x-6">
              <Link 
                href="/privacy" 
                className="text-white hover:text-teal-accent transition-colors duration-200 text-xs md:text-sm font-body footer-link"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-white hover:text-teal-accent transition-colors duration-200 text-xs md:text-sm font-body footer-link"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 