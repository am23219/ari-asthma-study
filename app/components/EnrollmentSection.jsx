export default function EnrollmentSection() {
  return (
    <section id="enroll" className="py-16 md:py-24 bg-light-gray dark:bg-gray-700">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">How to Enroll</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Joining our study is a straightforward process. Follow these steps to get started.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-primary/20 transform md:translate-x-0 translate-x-4"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row mb-16 relative group">
              <div className="md:w-1/2 md:pr-16 md:text-right mb-6 md:mb-0 pl-12 md:pl-0 transition-all duration-300 group-hover:md:pr-14">
                <h3 className="text-2xl font-semibold mb-3">Initial Consultation</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  Schedule a <span className="font-medium text-primary dark:text-[#00A896] border-b border-primary dark:border-[#00A896] hover:border-b-2 transition-all">consultation</span> with our team to discuss your condition and determine if you're eligible for the study.
                </p>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-10 transition-transform duration-300 group-hover:scale-110">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="md:w-1/2 md:pl-16 pl-12 transition-all duration-300 group-hover:md:pl-14">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <p className="text-gray-500 dark:text-slate-400">
                    During this consultation, we'll review your medical history, current treatments, and assess your condition.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row mb-16 relative group">
              <div className="md:w-1/2 md:pr-16 md:text-right order-2 md:order-1 pl-12 md:pl-0 mb-6 md:mb-0 transition-all duration-300 group-hover:md:pr-14">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <p className="text-gray-500 dark:text-slate-400">
                    We'll explain the study details, <span className="font-medium text-primary dark:text-[#00A896]">potential benefits and risks</span>, and answer any questions you may have.
                  </p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-10 transition-transform duration-300 group-hover:scale-110">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="md:w-1/2 md:pl-16 order-1 md:order-2 pl-12 mb-6 transition-all duration-300 group-hover:md:pl-14">
                <h3 className="text-2xl font-semibold mb-3">Screening Process</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  Complete a screening evaluation to confirm your eligibility for participation in the study.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row mb-16 relative group">
              <div className="md:w-1/2 md:pr-16 md:text-right mb-6 md:mb-0 pl-12 md:pl-0 transition-all duration-300 group-hover:md:pr-14">
                <h3 className="text-2xl font-semibold mb-3">Informed Consent</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  Review and sign the informed consent document if you decide to participate in the study.
                </p>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-10 transition-transform duration-300 group-hover:scale-110">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="md:w-1/2 md:pl-16 pl-12 transition-all duration-300 group-hover:md:pl-14">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <p className="text-gray-500 dark:text-slate-400">
                    This document outlines all aspects of the study, including procedures, schedule, and your rights as a participant.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="flex flex-col md:flex-row relative group">
              <div className="md:w-1/2 md:pr-16 md:text-right order-2 md:order-1 pl-12 md:pl-0 mb-6 md:mb-0 transition-all duration-300 group-hover:md:pr-14">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <p className="text-gray-500 dark:text-slate-400">
                    You'll receive a <span className="font-medium text-primary dark:text-[#00A896]">personalized treatment plan</span> and schedule for your study participation.
                  </p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center transform -translate-x-4 md:-translate-x-4 shadow-lg z-10 transition-transform duration-300 group-hover:scale-110">
                <span className="text-white font-bold">4</span>
              </div>
              <div className="md:w-1/2 md:pl-16 order-1 md:order-2 pl-12 mb-6 transition-all duration-300 group-hover:md:pl-14">
                <h3 className="text-2xl font-semibold mb-3">Begin Treatment</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  Start your participation in the study with your first treatment session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 