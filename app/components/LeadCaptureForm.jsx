'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useFacebookTracking } from '../hooks/useFacebookTracking';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { trackFbPixelEvent } from './FacebookPixel';
import { faSpinner, faCheckCircle, faExclamationTriangle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const isDev = process.env.NODE_ENV !== 'production';

const toProperCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

// Questions configuration
const QUESTIONS = [
  {
    id: 'q1_age_weight',
    text: 'Are you between 18 and 80 years old and weigh at least 88 pounds (40 kg)?',
    qualifyingAnswer: true,
    disqualifyMessage: 'You must be between 18 and 80 years old and meet the weight requirements.'
  },
  {
    id: 'q2_cd_diagnosis',
    text: 'Have you been diagnosed with Crohn\'s disease (not ulcerative colitis or indeterminate colitis)?',
    qualifyingAnswer: true,
    disqualifyMessage: 'A formal diagnosis of Crohn\'s Disease is required.'
  },
  {
    id: 'q3_cd_symptoms',
    text: 'Are you currently experiencing moderate to severe Crohn\'s disease symptoms, such as:',
    bullets: [
      'Frequent loose or bloody stools',
      'Urgent bowel movements',
      'Abdominal pain or cramping'
    ],
    qualifyingAnswer: true,
    disqualifyMessage: 'The study requires participants to be experiencing active Crohn\'s disease symptoms.'
  },
  {
    id: 'q4_tried_treatments',
    text: 'Have you tried any of the following treatments for Crohn\'s disease and either didn\'t improve, got worse, or had side effects?',
    bullets: [
      'Steroids (e.g., prednisone, budesonide)',
      '5-ASA medications (e.g., mesalamine, sulfasalazine)',
      'Immunosuppressants (e.g., azathioprine, 6-MP, methotrexate)',
      'Biologics (e.g., Remicade, Humira, Entyvio, Stelara)',
      'JAK inhibitors (e.g., Xeljanz, Rinvoq)',
      'S1P modulators (e.g., Zeposia, etrasimod)'
    ],
    qualifyingAnswer: true,
    disqualifyMessage: 'Participants should have tried other Crohn\'s disease treatments without success.'
  },
  {
    id: 'q5_had_surgery',
    text: 'Have you ever had a colectomy, ostomy, or pouch surgery (such as an ileoanal pouch)?',
    qualifyingAnswer: false,
    disqualifyMessage: 'Patients who have had a colectomy, ostomy, or pouch surgery are not eligible.'
  },
  {
    id: 'q6_other_diagnosis',
    text: 'Have you ever been diagnosed with any of the following?',
    bullets: [
      'Ulcerative colitis',
      'Microscopic colitis',
      'Indeterminate colitis',
      'Primary sclerosing cholangitis'
    ],
    qualifyingAnswer: false,
    disqualifyMessage: 'A diagnosis of ulcerative colitis, microscopic colitis, or certain other conditions may exclude you.'
  },
  {
    id: 'q7_hospitalized_or_surgery',
    text: 'Have you been hospitalized for a Crohn\'s disease flare within the past 2 weeks or do you currently need surgery related to Crohn\'s?',
    qualifyingAnswer: false,
    disqualifyMessage: 'Recent hospitalization or currently needing surgery for Crohn\'s disease are exclusion criteria.'
  },
  {
    id: 'q8_recent_infections',
    text: 'Have you had any of the following infections recently (within the past 2–3 months)?',
    bullets: [
      'C. difficile',
      'Cytomegalovirus (CMV) colitis',
      'Tuberculosis (TB)',
      'Hepatitis B or C',
      'HIV/AIDS'
    ],
    qualifyingAnswer: false,
    disqualifyMessage: 'Certain recent infections (like C. difficile, TB, Hepatitis) can prevent participation.'
  },
  {
    id: 'q9_substance_abuse',
    text: 'In the past year, have you had any issues with alcohol, drug, or substance abuse?',
    qualifyingAnswer: false,
    disqualifyMessage: 'Recent substance abuse issues may be an exclusion criterion.'
  },
  {
    id: 'q10_willing_for_colonoscopy',
    text: 'Are you able and willing to undergo a colonoscopy (or other imaging procedures) if needed?',
    qualifyingAnswer: true,
    disqualifyMessage: 'Willingness to undergo a potential colonoscopy is required for the study.'
  },
  {
    id: 'q11_pregnant_or_breastfeeding',
    text: 'Are you currently pregnant or breastfeeding, or planning to become pregnant in the next 3 months?',
    qualifyingAnswer: false,
    disqualifyMessage: 'Participants cannot be pregnant, breastfeeding, or planning to become pregnant soon.'
  }
];

export default function LeadCaptureForm({ context = 'default', onStepChange }) {
  if (isDev) {
    console.log('LeadCaptureForm context:', context);
  }

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [skippedPrescreen, setSkippedPrescreen] = useState(false);
  const [contactFormStarted, setContactFormStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    preferredTime: ''
  });
  const [disqualifyingStep, setDisqualifyingStep] = useState(null);
  const [bookingLink, setBookingLink] = useState(null);
  const [userPath, setUserPath] = useState(null); // Track if user chose 'instant' or 'contact'
  
  // Ref to maintain form position
  const formRef = useRef(null);
  const [maintainPosition, setMaintainPosition] = useState(false);

  // Maintain form position during transitions
  useEffect(() => {
    if (maintainPosition && formRef.current) {
      const formElement = formRef.current;
      
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        const rect = formElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isFormVisible = rect.top >= 0 && rect.top <= viewportHeight;
        
        if (!isFormVisible) {
          // Calculate optimal scroll position
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = rect.top + scrollTop;
          const targetScrollTop = elementTop - Math.max(20, viewportHeight * 0.1); // 20px or 10% from top
          
          window.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth'
          });
        }
      });
      
      // Reset the flag after animation completes
      const timer = setTimeout(() => {
        setMaintainPosition(false);
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, maintainPosition]);

  // Notify parent component of step changes
  const updateStep = (newStep) => {
    // Set flag to maintain position for significant step changes
    const significantStepChanges = [
      'qualified', 'contactForm', 'bookingOpened', 'success', 'notQualified'
    ];
    
    if (significantStepChanges.includes(newStep)) {
      setMaintainPosition(true);
    }
    
    setCurrentStep(newStep);
    if (onStepChange) {
      onStepChange(newStep);
    }
  };

  const buildBookingLinkWithParams = (link, info) => {
    try {
      const url = new URL(link);
      const fullName = `${info.firstName || ''} ${info.lastName || ''}`.trim();
      if (info.firstName) {
        url.searchParams.set('firstName', info.firstName);
        url.searchParams.set('firstname', info.firstName);
      }
      if (info.lastName) {
        url.searchParams.set('lastName', info.lastName);
        url.searchParams.set('lastname', info.lastName);
      }
      if (fullName) url.searchParams.set('name', fullName);
      if (info.email) url.searchParams.set('email', info.email);
      if (info.phone) url.searchParams.set('phone', info.phone);
      url.searchParams.set('embed', '1');

      url.searchParams.set('skipForm', '1');

      return url.toString();
    } catch {
      return link;
    }
  };

  const { trackEvent } = useFacebookTracking();

  const totalQuestions = QUESTIONS.length;
  const isQuestionStep = currentStep < totalQuestions;
  const currentQuestion = isQuestionStep ? QUESTIONS[currentStep] : null;

  const handleAnswer = (answer) => {
    const question = currentQuestion;
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    trackEvent('QuestionAnswered', {
      question: question.id,
      answer: answer ? 'yes' : 'no',
      step: currentStep,
      study_type: 'CD Clinical Trial Screening'
    });

    // Check if this answer disqualifies the user
    if (answer !== question.qualifyingAnswer) {
      setDisqualifyingStep(currentStep); // Track which step disqualified them
      updateStep('notQualified');
      return;
    }

    // Move to next question or contact form
    if (currentStep < totalQuestions - 1) {
      updateStep(currentStep + 1);
    } else {
      updateStep('qualified');
    }
  };

  const handleSkipToContact = () => {
    setSkippedPrescreen(true);
    setAnswers({});
    
    trackEvent('QuestionnaireSkipped', {
      from_step: currentStep,
      study_type: 'CD Clinical Trial Screening'
    });
    
    updateStep('qualified');
  };

  const handleInstantBooking = () => {
    setUserPath('instant');
    
    trackEvent('InstantBookingChosen', {
      from_step: 'qualified',
      study_type: 'CD Clinical Trial Screening'
    });
    
    // Open calendar directly in new tab
    window.open('https://api.leadconnectorhq.com/widget/booking/n97n9pl3ix3LDmHTmLM8', '_blank', 'noopener,noreferrer');
    
    // Show success message
    updateStep('bookingOpened');
  };

  const handleContactFirst = () => {
    setUserPath('contact');
    
    trackEvent('ContactFirstChosen', {
      from_step: 'qualified',
      study_type: 'CD Clinical Trial Screening'
    });
    
    updateStep('contactForm');
  };

  const handleContactChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleContactFormStart = () => {
    if (!contactFormStarted) {
      setContactFormStarted(true);
      trackEvent('BeganContactForm', {
        form_type: 'Clinical_Trial_Screening',
        completed_prescreen: !skippedPrescreen,
        study_type: 'CD Clinical Trial Screening'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    // Determine tags based on user path
    let tags = ["Crohn's Study", "Website Lead"];
    if (userPath === 'contact') {
      tags.push("Talk to Someone First");
    }

    const submissionData = {
      firstName: toProperCase(contactInfo.name?.split(' ')[0] || ''),
      lastName: toProperCase(contactInfo.name?.split(' ').slice(1).join(' ') || ''),
      email: contactInfo.email.toLowerCase(),
      phone: contactInfo.phone,
      preferredTime: contactInfo.preferredTime || '',
      userPath: userPath || 'contact',
      skippedPrescreen,
      tags,
      ...answers,
      ...contactInfo
    };
    
    const eventId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...submissionData, eventId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'An error occurred during submission.');
      }
      
      trackFbPixelEvent('Lead', {
        content_name: 'Clinical Trial Screening Form',
        value: 100,
        currency: 'USD'
      }, {
        eventID: eventId
      });

      // Different success handling based on user path
      if (userPath === 'contact') {
        // For "Talk to someone first" path, show success message
        updateStep('success');
      } else {
        // For instant booking path, this shouldn't happen as we handle it differently
        updateStep('success');
      }

    } catch (error) {
      console.error('Error during form submission process:', error);
      setErrorMessage('There was an error submitting your information. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const restart = () => {
    // Set flag to maintain position when restarting
    setMaintainPosition(true);
    
    updateStep(0);
    setSkippedPrescreen(false);
    setContactFormStarted(false);
    setAnswers({});
    setContactInfo({ name: '', phone: '', email: '', preferredTime: '' });
    setErrorMessage('');
    setDisqualifyingStep(null);
    setBookingLink(null);
    setUserPath(null);
  };

  const goBackFromDisqualified = () => {
    // Remove the disqualifying answer and go back to that question
    if (disqualifyingStep !== null) {
      const disqualifyingQuestion = QUESTIONS[disqualifyingStep];
      const newAnswers = { ...answers };
      delete newAnswers[disqualifyingQuestion.id];
      setAnswers(newAnswers);
      updateStep(disqualifyingStep);
      setDisqualifyingStep(null);
    }
  };

  const goBack = () => {
    if (currentStep > 0 && currentStep < totalQuestions) {
      updateStep(currentStep - 1);
    }
  };

  // Style classes based on context
  const getClasses = () => {
    const isHero = context === 'hero';
    
    return {
      container: "w-full max-w-full mx-auto scroll-smooth",
      
      header: clsx(
        "text-center mb-4 sm:mb-6",
        isHero ? "text-white" : "text-navy-deep"
      ),
      
      title: clsx(
        "text-xl sm:text-2xl md:text-3xl font-bold mb-2 font-heading leading-tight",
        isHero ? "text-white" : "text-navy-deep"
      ),
      
      subtitle: clsx(
        "text-sm sm:text-base opacity-90 font-body",
        isHero ? "text-white/90" : "text-text-sub"
      ),
      
      question: {
        container: "mb-4 sm:mb-6",
        text: clsx(
          "text-base sm:text-lg font-bold mb-3 sm:mb-4 border-l-4 pl-3 py-1 font-heading leading-relaxed",
          isHero ? "text-white border-teal-400" : "text-navy-deep border-teal-accent"
        ),
        bullets: clsx(
          "list-disc list-inside ml-3 mt-2 space-y-1 text-xs sm:text-sm",
          isHero ? "text-white" : "text-text-sub"
        )
      },
      
      buttons: {
        container: "grid grid-cols-1 gap-3 sm:gap-4 mb-6",
        primary: clsx(
          "w-full px-6 py-4 sm:py-5 text-base sm:text-lg font-bold text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 font-heading shadow-lg hover:shadow-xl min-h-[56px] touch-manipulation",
          isHero 
            ? "bg-gradient-to-br from-teal-500 to-cyan-600 focus:ring-teal-400" 
            : "bg-gradient-to-br from-blue-primary to-navy-deep focus:ring-blue-primary"
        ),
        secondary: clsx(
          "w-full px-6 py-4 sm:py-5 text-base sm:text-lg font-bold text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 font-heading min-h-[56px] touch-manipulation",
          isHero 
            ? "bg-white/10 border-2 border-white/20 hover:bg-white/20 focus:ring-teal-400" 
            : "bg-blue-primary/50 border-2 border-blue-primary/80 hover:bg-blue-primary/70 focus:ring-blue-primary"
        ),
        tertiary: clsx(
          "w-full text-center px-6 py-4 text-base sm:text-lg font-medium rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 font-body min-h-[56px] touch-manipulation",
          isHero 
            ? "border-2 border-white/50 text-white/90 hover:bg-white/10 focus:ring-teal-400" 
            : "border-2 border-blue-primary/80 text-blue-primary hover:bg-blue-primary/10 focus:ring-blue-primary"
        ),
        back: clsx(
          "inline-flex items-center px-4 py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 mb-4 min-h-[44px] touch-manipulation",
          isHero 
            ? "text-white/80 hover:text-white hover:bg-white/10 focus:ring-teal-400" 
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-blue-primary"
        )
      },
      
      form: {
        container: "space-y-4 sm:space-y-6",
        group: "space-y-2",
        label: clsx(
          "block text-base sm:text-lg font-medium font-heading",
          isHero ? "text-white" : "text-gray-700"
        ),
        input: clsx(
          "mt-2 block w-full px-4 py-4 sm:py-5 text-base sm:text-lg border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 transition-all duration-200 min-h-[56px] touch-manipulation",
          isHero 
            ? "border-white/20 bg-white/10 text-white placeholder-white/70 focus:ring-teal-400 focus:border-teal-400" 
            : "border-gray-300 bg-white text-gray-900 focus:ring-navy-accent focus:border-navy-accent"
        )
      },
      
      success: {
        container: "text-center space-y-4 sm:space-y-6",
        icon: "mx-auto mb-4 bg-gradient-to-br from-teal-accent to-blue-primary rounded-full p-4 w-20 h-20 flex items-center justify-center shadow-lg",
        title: clsx(
          "text-2xl sm:text-3xl font-bold font-heading leading-tight",
          isHero ? "text-white" : "text-navy-deep"
        ),
        text: clsx(
          "text-base sm:text-lg font-body leading-relaxed",
          isHero ? "text-white/90" : "text-text-sub"
        )
      },
      
      disqualified: {
        container: "text-center space-y-3 sm:space-y-4",
        icon: "mx-auto mb-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full p-3 w-16 h-16 flex items-center justify-center shadow-lg",
        title: clsx(
          "text-xl sm:text-2xl font-bold font-heading",
          isHero ? "text-white" : "text-navy-deep"
        ),
        content: clsx(
          "text-left space-y-2 text-xs sm:text-sm font-body",
          isHero ? "text-white" : "text-text-sub"
        )
      },
      
      skip: clsx(
        "text-center text-xs mt-3 opacity-70",
        isHero ? "text-white/60" : "text-gray-400"
      )
    };
  };

  const classes = getClasses();
  const phoneInputStyle = {
    '--phone-input-background': context === 'hero' ? 'rgba(255, 255, 255, 0.1)' : '#fff',
    '--phone-input-text-color': context === 'hero' ? '#fff' : '#111827',
    '--phone-input-border-color': context === 'hero' ? 'rgba(255, 255, 255, 0.2)' : '#D1D5DB',
    '--phone-input-focus-ring-color': context === 'hero' ? '#2DD4BF' : '#00528A'
  };

  return (
    <div ref={formRef} className={classes.container} style={phoneInputStyle}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full"
          style={{ 
            minHeight: 'auto',
            position: 'relative'
          }}
        >
          {/* Question Steps */}
          {isQuestionStep && (
            <>
              {/* Only show header if NOT in hero context (hero already has its own header) */}
              {context !== 'hero' && (
                <div className={classes.header}>
                  <h2 className={classes.title}>Quick 30-Second Eligibility Check</h2>
                  <p className={classes.subtitle}>Answer a few simple questions to see if you qualify for the study.</p>
                </div>
              )}

              {currentStep > 0 && (
                <button 
                  type="button" 
                  onClick={goBack}
                  className={classes.buttons.back}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                  Back
                </button>
              )}

              <div className={classes.question.container}>
                <p className={classes.question.text}>
                  {currentQuestion.text}
                </p>
                {currentQuestion.bullets && (
                  <ul className={classes.question.bullets}>
                    {currentQuestion.bullets.map((bullet, index) => (
                      <li 
                        key={index} 
                        className={context === 'hero' ? 'text-white' : ''} 
                        dangerouslySetInnerHTML={{ __html: bullet }} 
                      />
                    ))}
                  </ul>
                )}
              </div>

              <div className={classes.buttons.container}>
                <button 
                  type="button" 
                  onClick={() => handleAnswer(true)} 
                  className={currentQuestion.qualifyingAnswer === true ? classes.buttons.primary : classes.buttons.secondary}
                >
                  Yes
                </button>
                <button 
                  type="button" 
                  onClick={() => handleAnswer(false)} 
                  className={currentQuestion.qualifyingAnswer === false ? classes.buttons.primary : classes.buttons.secondary}
                >
                  No
                </button>
              </div>

              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={handleSkipToContact} 
                  className={classes.buttons.tertiary}
                >
                  Skip Questionnaire & Fill Interest Form
                </button>
                {/* Only show security message if NOT in hero context */}
                {context !== 'hero' && (
                  <p className={classes.skip}>
                    Your information is secure and will only be used to determine study eligibility.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Contact Info Form */}
          {currentStep === 'contactInfo' && (
            <form onSubmit={handleSubmit} onFocus={handleContactFormStart}>
              <div className={classes.header}>
                <h3 className={classes.title}>You may be eligible!</h3>
                <p className={classes.subtitle}>Please provide your contact details to proceed.</p>
              </div>
              
              <div className={classes.form.container}>
                <div className={classes.form.group}>
                  <label htmlFor="name" className={classes.form.label}>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    required 
                    className={classes.form.input}
                    placeholder="John Doe" 
                    value={contactInfo.name} 
                    onChange={(e) => handleContactChange('name', e.target.value)}
                  />
                </div>
                
                <div className={classes.form.group}>
                  <label htmlFor="phone" className={classes.form.label}>Phone Number</label>
                  <PhoneInput 
                    name="phone" 
                    id="phone" 
                    required 
                    className={classes.form.input}
                    placeholder="Enter phone number" 
                    value={contactInfo.phone} 
                    onChange={(value) => handleContactChange('phone', value)}
                    defaultCountry="US"
                    international={false}
                    countryCallingCodeEditable={false}
                    countries={['US']}
                  />
                </div>
                
                <div className={classes.form.group}>
                  <label htmlFor="email" className={classes.form.label}>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    required 
                    className={classes.form.input}
                    placeholder="you@example.com" 
                    value={contactInfo.email} 
                    onChange={(e) => handleContactChange('email', e.target.value)}
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={classes.buttons.primary}
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Information'
                    )}
                  </button>
                </div>
                
                {errorMessage && (
                  <p className="text-center text-red-500 text-xs mt-2 p-2 bg-red-50 rounded-lg">
                    {errorMessage}
                  </p>
                )}
              </div>
            </form>
          )}

          {/* Qualified Step - Clean and Focused */}
          {currentStep === 'qualified' && (
            <div className={classes.success.container}>
              <div className={classes.success.icon}>
                <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-white" />
              </div>
              <h3 className={classes.success.title}>You Qualify for our Pre-Screening</h3>

              {/* What Happens at Your Visit - Redesigned for better readability */}
              <div className="mt-8 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-sm">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-lg">📅</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg sm:text-xl leading-tight">
                      What Happens at Your Pre-Screening Visit
                    </h4>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-600 font-bold text-sm">1</span>
                      </div>
                      <p className="text-gray-700 text-lg sm:text-xl font-medium leading-relaxed">
                        Review of your full medical history
                      </p>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-600 font-bold text-sm">2</span>
                      </div>
                      <p className="text-gray-700 text-lg sm:text-xl font-medium leading-relaxed">
                        Ask questions and learn about your condition
                      </p>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-600 font-bold text-sm">3</span>
                      </div>
                      <p className="text-gray-700 text-lg sm:text-xl font-medium leading-relaxed">
                        See if the study is a good fit for you
                      </p>
                    </div>
                  </div>
                  
                  {/* Compensation Information - Made more prominent */}
                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-white font-bold text-lg">🤝</span>
                      </div>
                      <h5 className="font-bold text-gray-800 text-lg sm:text-xl">
                        Compensation If You Qualify
                      </h5>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <span className="text-gray-700 text-base sm:text-lg font-medium">
                          Screening Visit
                        </span>
                        <span className="text-blue-700 text-xl sm:text-2xl font-bold">
                          $200
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <span className="text-gray-700 text-base sm:text-lg font-medium">
                          Colonoscopy (if needed)
                        </span>
                        <span className="text-blue-700 text-xl sm:text-2xl font-bold">
                          $350
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed text-center">
                        ⏱️ Visit takes about <strong>3 hours</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>


              
              {/* Main CTA - Prominent and Eye-catching */}
              <div className="mb-6">
                <button 
                  type="button" 
                  onClick={handleInstantBooking}
                  className={clsx(
                    "relative w-full group overflow-hidden",
                    "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500",
                    "hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600",
                    "text-white font-bold text-lg sm:text-xl",
                    "py-6 px-8 rounded-2xl",
                    "shadow-xl hover:shadow-2xl",
                    "transform hover:scale-[1.02] active:scale-[0.98]",
                    "transition-all duration-300 ease-out",
                    "border-2 border-transparent hover:border-white/20",
                    "focus:outline-none focus:ring-4 focus:ring-teal-300/50",
                    "min-h-[64px] touch-manipulation"
                  )}
                >
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Button content */}
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-2xl">📅</span>
                    <span className="font-heading">Schedule My Pre-Screening</span>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <span className="text-white text-sm">→</span>
                    </div>
                  </div>
                  
                  {/* Pulse animation */}
                  <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 animate-pulse"></div>
                </button>
              </div>
              
              {/* Secondary option - Subtle and understated */}
              <div className="pt-2">
                <button 
                  type="button" 
                  onClick={handleContactFirst}
                  className={clsx(
                    "w-full group relative",
                    "font-medium text-sm sm:text-base",
                    "py-4 px-6 rounded-xl",
                    "transition-all duration-200 ease-in-out",
                    "focus:outline-none focus:ring-2",
                    "min-h-[48px] touch-manipulation",
                    // Default (non-hero) styling
                    context !== 'hero' && [
                      "text-gray-600 hover:text-gray-800",
                      "bg-transparent hover:bg-gray-50/60",
                      "border border-gray-200 hover:border-gray-300",
                      "focus:ring-gray-300/50"
                    ],
                    // Hero context styling
                    context === 'hero' && [
                      "text-white/70 hover:text-white/90",
                      "bg-transparent hover:bg-white/10",
                      "border border-white/20 hover:border-white/30",
                      "focus:ring-white/30"
                    ]
                  )}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg opacity-70">💬</span>
                    <span>I'd prefer to speak with someone first</span>
                  </div>
                </button>
              </div>
            </div>
          )}



          {/* Booking Opened Confirmation */}
          {currentStep === 'bookingOpened' && (
            <div className={classes.success.container}>
              <div className={classes.success.icon}>
                <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-white" />
              </div>
              <h3 className={classes.success.title}>Perfect! Your Calendar is Ready</h3>
              <p className={classes.success.text}>
                The scheduling calendar has opened in a new tab. Please select your preferred appointment time.
              </p>

              {/* Consistent information matching the qualified step */}
              <div className="mt-8 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-sm">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-lg">📅</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg sm:text-xl leading-tight">
                      Your Pre-Screening Visit Details
                    </h4>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-600 font-bold text-sm">1</span>
                      </div>
                      <p className="text-gray-700 text-lg sm:text-xl font-medium leading-relaxed">
                        Review of your full medical history
                      </p>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-600 font-bold text-sm">2</span>
                      </div>
                      <p className="text-gray-700 text-lg sm:text-xl font-medium leading-relaxed">
                        Ask questions and learn about your condition
                      </p>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-600 font-bold text-sm">3</span>
                      </div>
                      <p className="text-gray-700 text-lg sm:text-xl font-medium leading-relaxed">
                        See if the study is a good fit for you
                      </p>
                    </div>
                  </div>
                  
                  {/* Compensation Information - Consistent with qualified step */}
                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-white font-bold text-lg">🤝</span>
                      </div>
                      <h5 className="font-bold text-gray-800 text-lg sm:text-xl">
                        Compensation If You Qualify
                      </h5>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <span className="text-gray-700 text-base sm:text-lg font-medium">
                          Screening Visit
                        </span>
                        <span className="text-blue-700 text-xl sm:text-2xl font-bold">
                          $200
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <span className="text-gray-700 text-base sm:text-lg font-medium">
                          Colonoscopy (if needed)
                        </span>
                        <span className="text-blue-700 text-xl sm:text-2xl font-bold">
                          $350
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed text-center">
                        ⏱️ Visit takes about <strong>3 hours</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced fallback section with better styling */}
              <div className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-sm">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-lg">🆘</span>
                    </div>
                    <h4 className="font-bold text-emerald-800 text-lg">
                      Need Help with Scheduling?
                    </h4>
                  </div>
                  
                  <p className="text-emerald-700 text-base mb-4 leading-relaxed">
                    If the calendar didn't open or you need assistance, you can access it directly below or contact us.
                  </p>
                  
                  <div className="space-y-4">
                    <a 
                      href="https://api.leadconnectorhq.com/widget/booking/n97n9pl3ix3LDmHTmLM8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-lg"
                    >
                      <span className="mr-2 text-white">📅</span>
                      <span className="text-white">Open Scheduling Calendar</span>
                    </a>
                    
                    <div className="text-center">
                      <p className="text-emerald-700 text-base mb-2">
                        <strong>Or call us directly:</strong>
                      </p>
                      <p className="text-emerald-800 text-xl font-bold">
                        (352) 667-7237
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={restart}
                className={classes.buttons.tertiary + " mt-6"}
              >
                Start Over
              </button>
            </div>
          )}

          {/* Contact Form Step */}
          {currentStep === 'contactForm' && (
            <form onSubmit={handleSubmit} onFocus={handleContactFormStart}>
              <button 
                type="button" 
                onClick={() => updateStep('qualified')}
                className={clsx(
                  "w-full flex items-center justify-center px-6 py-4 text-base sm:text-lg font-bold rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 font-heading shadow-lg hover:shadow-xl min-h-[56px] touch-manipulation mb-6",
                  context === 'hero' 
                    ? "bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 focus:ring-teal-400" 
                    : "bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200 focus:ring-blue-primary"
                )}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2 text-lg" />
                <span>Back to Scheduling Options</span>
              </button>
              
              <div className={classes.header}>
                <h3 className={classes.title}>Let's Connect</h3>
                <p className={classes.subtitle}>
                  We'll call you within 24 hours to discuss the study.
                </p>
              </div>
              
              <div className={classes.form.container}>
                <div className={classes.form.group}>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    required 
                    className={classes.form.input}
                    placeholder="Your Name" 
                    value={contactInfo.name} 
                    onChange={(e) => handleContactChange('name', e.target.value)}
                  />
                </div>
                
                <div className={classes.form.group}>
                  <PhoneInput 
                    name="phone" 
                    id="phone" 
                    required 
                    className={classes.form.input}
                    placeholder="Phone Number" 
                    value={contactInfo.phone} 
                    onChange={(value) => handleContactChange('phone', value)}
                    defaultCountry="US"
                    international={false}
                    countryCallingCodeEditable={false}
                    countries={['US']}
                  />
                </div>
                
                <div className={classes.form.group}>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    required 
                    className={classes.form.input}
                    placeholder="Email Address" 
                    value={contactInfo.email} 
                    onChange={(e) => handleContactChange('email', e.target.value)}
                  />
                </div>
                
                <div className={classes.form.group}>
                  <select 
                    name="preferredTime" 
                    id="preferredTime" 
                    className={clsx(
                      classes.form.input,
                      "appearance-none bg-no-repeat bg-right pr-12",
                      "cursor-pointer text-ellipsis font-medium",
                      "option:py-4 option:px-4 option:text-lg option:font-medium",
                      "focus:ring-4 focus:ring-offset-2",
                      context === 'hero' 
                        ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNSA1TDkgMSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-[length:12px_8px] bg-[right_1rem_center]"
                        : "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNSA1TDkgMSIgc3Ryb2tlPSIjNjc3NDhGIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] bg-[length:12px_8px] bg-[right_1rem_center]"
                    )}
                    value={contactInfo.preferredTime} 
                    onChange={(e) => handleContactChange('preferredTime', e.target.value)}
                    style={{
                      fontSize: '1rem',
                      lineHeight: '1.5'
                    }}
                  >
                    <option 
                      value="" 
                      className="py-4 px-4 text-lg font-medium leading-relaxed"
                      style={{
                        padding: '16px 16px',
                        fontSize: '1.125rem',
                        lineHeight: '1.6',
                        fontWeight: '500',
                        backgroundColor: context === 'hero' ? '#1e40af' : '#f8fafc',
                        color: context === 'hero' ? '#ffffff' : '#1f2937'
                      }}
                    >
                      🕐 Best time to call (optional)
                    </option>
                    <option 
                      value="morning" 
                      className="py-4 px-4 text-lg font-medium leading-relaxed"
                      style={{
                        padding: '16px 16px',
                        fontSize: '1.125rem',
                        lineHeight: '1.6',
                        fontWeight: '500',
                        backgroundColor: context === 'hero' ? '#1e40af' : '#f8fafc',
                        color: context === 'hero' ? '#ffffff' : '#1f2937'
                      }}
                    >
                      🌅 Morning (9:00 AM - 12:00 PM)
                    </option>
                    <option 
                      value="afternoon" 
                      className="py-4 px-4 text-lg font-medium leading-relaxed"
                      style={{
                        padding: '16px 16px',
                        fontSize: '1.125rem',
                        lineHeight: '1.6',
                        fontWeight: '500',
                        backgroundColor: context === 'hero' ? '#1e40af' : '#f8fafc',
                        color: context === 'hero' ? '#ffffff' : '#1f2937'
                      }}
                    >
                      ☀️ Afternoon (12:00 PM - 5:00 PM)
                    </option>
                    <option 
                      value="evening" 
                      className="py-4 px-4 text-lg font-medium leading-relaxed"
                      style={{
                        padding: '16px 16px',
                        fontSize: '1.125rem',
                        lineHeight: '1.6',
                        fontWeight: '500',
                        backgroundColor: context === 'hero' ? '#1e40af' : '#f8fafc',
                        color: context === 'hero' ? '#ffffff' : '#1f2937'
                      }}
                    >
                      🌆 Evening (5:00 PM - 8:00 PM)
                    </option>
                    <option 
                      value="anytime" 
                      className="py-4 px-4 text-lg font-medium leading-relaxed"
                      style={{
                        padding: '16px 16px',
                        fontSize: '1.125rem',
                        lineHeight: '1.6',
                        fontWeight: '500',
                        backgroundColor: context === 'hero' ? '#1e40af' : '#f8fafc',
                        color: context === 'hero' ? '#ffffff' : '#1f2937'
                      }}
                    >
                      ⏰ Anytime (9:00 AM - 8:00 PM)
                    </option>
                  </select>
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={classes.buttons.primary}
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
                
                {errorMessage && (
                  <p className="text-center text-red-500 text-sm mt-3 p-2 bg-red-50 rounded-lg">
                    {errorMessage}
                  </p>
                )}
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  Your information is secure and confidential.
                </p>
              </div>
            </form>
          )}

          {/* Booking State */}
          {currentStep === 'booking' && (
            <div className={classes.success.container}>
              <div className={classes.success.icon}>
                <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-white" />
              </div>
              <h3 className={classes.success.title}>Great! Now Let's Schedule Your Consultation</h3>
              <p className={classes.success.text}>
                Your information has been submitted successfully. Please schedule your consultation appointment below:
              </p>

              {bookingLink && (
                <div className="mt-6 w-full">
                  <iframe
                    src={bookingLink}
                    style={{
                      width: '100%',
                      height: '600px',
                      border: 'none',
                      overflow: 'hidden'
                    }}
                    scrolling="no"
                    title="Schedule Consultation"
                    id="booking-widget-iframe"
                  />
                  <script
                    src="https://link.msgsndr.com/js/form_embed.js"
                    type="text/javascript"
                    async
                  ></script>
                </div>
              )}

              <div className="mt-4 text-center">
                <p className={classes.success.text}>
                  Don't worry if you can't schedule right now - we have your contact information and will follow up with you soon.
                </p>
                <button
                  type="button"
                  onClick={restart}
                  className={classes.buttons.tertiary}
                >
                  Start Over
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {currentStep === 'success' && (
            <div className={classes.success.container}>
              <div className={classes.success.icon}>
                <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-white" />
              </div>
              <h3 className={classes.success.title}>Thank You for Your Interest</h3>
              <p className={classes.success.text}>
                Your information has been received. A member of our research team will contact you within 24 hours to discuss the study.
              </p>

              {/* What happens next */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 text-sm mb-2">Next Steps:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• A research team member will call you within 24 hours</li>
                  <li>• You'll receive study information via email</li>
                  <li>• We'll send you a scheduling link for your convenience</li>
                  <li>• You can schedule your screening appointment online or by phone</li>
                </ul>
              </div>

              {/* Study information reminder */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-700">
                  Please remember that participation in this clinical study is voluntary. You have the right to withdraw from the study at any time without penalty.
                </p>
              </div>

              {/* Contact info */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Questions? You can reach our research team at <strong>(555) 123-4567</strong> 
                  or email <strong>research@clinicalstudyteam.com</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={restart}
                className={classes.buttons.tertiary + " mt-6"}
              >
                Start Over
              </button>
            </div>
          )}
          
          {/* Not Qualified State */}
          {currentStep === 'notQualified' && (
            <div className={classes.disqualified.container}>
              <div className={classes.disqualified.icon}>
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-8 w-8 text-white" />
              </div>
              <h3 className={classes.disqualified.title}>Thank You for Your Interest</h3>
              <div className={classes.disqualified.content}>
                <p className={clsx("mb-3 text-center", context === 'hero' ? 'text-white' : '')}>
                  Based on your answers, you may not qualify for this study at this time. Here's a summary of the key eligibility criteria:
                </p>
                {Object.entries(answers).map(([questionId, answer]) => {
                  const question = QUESTIONS.find(q => q.id === questionId);
                  if (question && answer !== question.qualifyingAnswer) {
                    return (
                      <p key={questionId} className={clsx("mb-1", context === 'hero' ? 'text-white' : '')}>
                        • {question.disqualifyMessage}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
              <p className={classes.subtitle}>
                We encourage you to contact our team to discuss your eligibility further.
              </p>
              <button 
                type="button" 
                onClick={goBackFromDisqualified} 
                className={classes.buttons.primary}
              >
                Take Me Back
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 