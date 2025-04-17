export default function ContactSection() {
  return (
    <section id="contact" className="py-10 md:py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background wave pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="wave-divider"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 md:mb-4 font-serif">Contact Us</h2>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mb-4 md:mb-8"></div>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Have questions about the study? Our team is here to help.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="card hover:translate-y-[-4px] transition-transform duration-300 p-4 sm:p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-4 md:mb-8 text-primary">Get in Touch</h3>
            
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-[#00A896] to-[#028090] p-2 md:p-3 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-medium text-primary mb-1">Phone</h4>
                  <p className="text-sm md:text-base text-gray-600">(352) 691-1140</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Monday-Friday, 9am-5pm EST</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-[#00A896] to-[#028090] p-2 md:p-3 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-medium text-primary mb-1">Email</h4>
                  <p className="text-sm md:text-base text-gray-600">info@ariinstitute.com</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">We'll respond within 24-48 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-[#00A896] to-[#028090] p-2 md:p-3 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-medium text-primary mb-1">Location</h4>
                  <p className="text-sm md:text-base text-gray-600">11373 Cortez Blvd Building C, Suite 200</p>
                  <p className="text-sm md:text-base text-gray-600">Brooksville, FL 34613</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Complimentary Uber Provided</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 md:mt-10">
              <a 
                href="tel:3526911140" 
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm md:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>Call Now</span>
              </a>
            </div>
          </div>
          
          <div className="card hover:translate-y-[-4px] transition-transform duration-300 p-4 sm:p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-4 md:mb-6 text-primary">Clinic Location</h3>
            
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-4">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3442.6854989335996!2d-82.55098528486949!3d28.533055982456036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e80ca1e13b3ea7%3A0x6bda7a642e147a49!2sAccess%20Research%20Institute!5e0!3m2!1sen!2sus!4v1694653425963!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Access Research Institute Clinic Location"
              ></iframe>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-[#00A896] to-[#028090] p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-medium text-primary">Address</h4>
                  <p className="text-sm text-gray-600">11373 Cortez Blvd Building C, Suite 200</p>
                  <p className="text-sm text-gray-600">Brooksville, FL 34613</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-[#00A896] to-[#028090] p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-medium text-primary">Hours</h4>
                  <p className="text-sm text-gray-600">Monday-Friday: 9am-5pm</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-[#00A896] to-[#028090] p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-medium text-primary">Additional Info</h4>
                  <p className="text-sm text-gray-600">Free parking available</p>
                  <p className="text-sm text-gray-600">Wheelchair accessible</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <a 
                href="https://www.google.com/maps/place/Access+Research+Institute/@28.5330559,-82.5509853,17z/data=!3m1!4b1!4m6!3m5!1s0x88e80ca1e13b3ea7:0x6bda7a642e147a49!8m2!3d28.5330559!4d-82.5509853!16s%2Fg%2F11rycn2g8n?entry=ttu" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm md:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 1.586l-4 4V18h8V5.586l-4-4zM2 19h17a1 1 0 001-1V8a1 1 0 00-.293-.707l-5-5A1 1 0 0014 2H7a1 1 0 00-.707.293l-5 5A1 1 0 001 8v10a1 1 0 001 1z" clipRule="evenodd" />
                </svg>
                <span>Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 