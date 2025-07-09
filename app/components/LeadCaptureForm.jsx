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

const toProperCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

// Questions configuration (updated for CKD study – multi-choice with qualification mapping)
const QUESTIONS = [
  {
    id: 'q1_age',
    text: 'Are you between 18 and 65 years old (inclusive)?',
    answerChoices: ['Yes', 'No'],
    answerKey: { Yes: 'Qualified', No: 'Disqualified' },
    disqualifyMessage: 'You must be between 18 and 65 years old to qualify.'
  },
  {
    id: 'q2_ckd_diagnosis',
    text: 'Have you ever been diagnosed by a doctor with chronic kidney disease (CKD) or kidney problems?',
    answerChoices: ['Yes', 'No', 'Unsure'],
    answerKey: { Yes: 'Qualified', No: 'Disqualified', Unsure: 'Qualified' },
    disqualifyMessage: 'A diagnosis of CKD or kidney problems is required.'
  },
  {
    id: 'q3_type1_diabetes',
    text: 'Have you been diagnosed with Type 1 (juvenile) diabetes?',
    answerChoices: ['Yes', 'No', 'Unsure'],
    answerKey: { Yes: 'Disqualified', No: 'Qualified', Unsure: 'Qualified' },
    disqualifyMessage: 'Participants with Type 1 diabetes are not eligible.'
  },
  {
    id: 'q4_cardio_event',
    text: 'In the past 12 months, have you had a heart attack, stroke, or unstable angina?',
    answerChoices: ['Yes', 'No', 'Unsure'],
    answerKey: { Yes: 'Disqualified', No: 'Qualified', Unsure: 'Qualified' },
    disqualifyMessage: 'Recent serious cardiovascular events are disqualifying.'
  },
  {
    id: 'q5_cancer',
    text: 'Have you been treated for any cancer within the last 2 years (other than minor skin cancers or very early cervical/prostate cancer)?',
    answerChoices: ['Yes', 'No', 'Unsure'],
    answerKey: { Yes: 'Disqualified', No: 'Qualified', Unsure: 'Qualified' },
    disqualifyMessage: 'Recent cancer treatment is disqualifying.'
  },
  {
    id: 'q6_transplant',
    text: 'Have you ever received an organ or bone-marrow transplant?',
    answerChoices: ['Yes', 'No', 'Unsure'],
    answerKey: { Yes: 'Disqualified', No: 'Qualified', Unsure: 'Qualified' },
    disqualifyMessage: 'Organ or bone-marrow transplant recipients are not eligible.'
  },
  {
    id: 'q7_steroids',
    text: 'Are you currently taking high-dose steroid medicines (more than 10 mg of prednisone a day) such as prednisone, methylprednisolone (Medrol), or dexamethasone?',
    answerChoices: ['Yes', 'No', 'Unsure'],
    answerKey: { Yes: 'Disqualified', No: 'Qualified', Unsure: 'Qualified' },
    disqualifyMessage: 'High-dose steroid use is disqualifying.'
  },
  {
    id: 'q8_immunosuppressants',
    text: 'Are you currently taking powerful immune-suppressing drugs like cyclophosphamide, rituximab (Rituxan), adalimumab (Humira), etanercept (Enbrel), or similar medications?',
    answerChoices: ['Yes', 'No', 'Unsure'],
    answerKey: { Yes: 'Disqualified', No: 'Qualified', Unsure: 'Qualified' },
    disqualifyMessage: 'Strong immunosuppressant use is disqualifying.'
  },
  {
    id: 'q9_clot',
    text: 'Have you had a blood clot (deep-vein thrombosis or pulmonary embolism) within the last year?',
    answerChoices: ['Yes', 'No', 'Unsure'],
    answerKey: { Yes: 'Disqualified', No: 'Qualified', Unsure: 'Qualified' },
    disqualifyMessage: 'Recent blood clots are disqualifying.'
  },
  {
    id: 'q10_pregnancy',
    text: 'Are you currently pregnant or breastfeeding?',
    answerChoices: ['Yes', 'No', 'Unsure'],
    answerKey: { Yes: 'Disqualified', No: 'Qualified', Unsure: 'Qualified' },
    disqualifyMessage: 'Pregnancy or breastfeeding is disqualifying.'
  }
];

export default function LeadCaptureForm({ context = 'default', onStepChange }) {
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
  const [userPath, setUserPath] = useState(null); // Track if user chose 'instant' or 'contact'
  
  // Ref to maintain form position
  const formRef = useRef(null);
  const [maintainPosition, setMaintainPosition] = useState(false);

  // Maintain form position during transitions
  useEffect(() => {
    let timer;

    if (maintainPosition && formRef.current) {

      const formElement = formRef.current;

      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        const rect = formElement.getBoundingClientRect();
        const headerHeight = document.querySelector('nav')?.offsetHeight || 0;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        const targetScrollTop = elementTop - headerHeight;

        const isAtTarget = Math.abs(rect.top - headerHeight) <= 5;

        if (!isAtTarget) {
          window.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth'
          });
        }

        // Reset the flag after scroll completes
        timer = setTimeout(() => {
          setMaintainPosition(false);
        }, 100);
      });
    }

    return () => clearTimeout(timer);
  }, [currentStep, maintainPosition]);

  // Notify parent component of step changes
  const updateStep = (newStep) => {
    // Set flag to maintain position for significant step changes
    const significantStepChanges = [

      'qualified',
      'contactForm',
      'bookingOpened',
      'success',
      'reservationSuccess',
      'notQualified'

    ];
    
    if (significantStepChanges.includes(newStep)) {
      setMaintainPosition(true);
    }
    
    setCurrentStep(newStep);
    if (onStepChange) {
      onStepChange(newStep);
    }
  };

  const { trackEvent } = useFacebookTracking();

  const totalQuestions = QUESTIONS.length;
  const isQuestionStep = currentStep < totalQuestions;
  const currentQuestion = isQuestionStep ? QUESTIONS[currentStep] : null;

  const handleAnswer = (selectedAnswer) => {
    const question = currentQuestion;
    const newAnswers = { ...answers, [question.id]: selectedAnswer };
    setAnswers(newAnswers);

    trackEvent('QuestionAnswered', {
      question: question.id,
      answer: selectedAnswer,
      step: currentStep,
      study_type: 'CKD Clinical Trial Screening'
    });

    // Determine qualification based on answerKey mapping
    const isQualified = question.answerKey[selectedAnswer] === 'Qualified';

    if (!isQualified) {
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
      study_type: 'CKD Clinical Trial Screening'
    });
    
    updateStep('qualified');
  };

  const handleInstantBooking = () => {
    setUserPath('instant');
    
    trackEvent('InstantBookingChosen', {
      from_step: 'qualified',
      study_type: 'CKD Clinical Trial Screening'
    });
    
    // Open calendar directly in new tab
    window.open('https://api.leadconnectorhq.com/widget/booking/a1VjNanrncl9AJKzAsNm', '_blank', 'noopener,noreferrer');
    
    // Show success message
    updateStep('bookingOpened');
  };

  const handleContactFirst = () => {
    setUserPath('contact');
    
    trackEvent('ContactFirstChosen', {
      from_step: 'qualified',
      study_type: 'CKD Clinical Trial Screening'
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
        study_type: 'CKD Clinical Trial Screening'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    // Determine tags based on user path
    let tags = ["CKD Study", "Website Lead"];
    if (userPath === 'contact') {
      tags.push("Talk to Someone First");
    } else {
      // For qualified form submissions, set default path
      setUserPath('qualified');
      tags.push("Qualified Pre-Screening");
    }

    const submissionData = {
      firstName: toProperCase(contactInfo.name?.split(' ')[0] || ''),
      lastName: toProperCase(contactInfo.name?.split(' ').slice(1).join(' ') || ''),
      email: contactInfo.email.toLowerCase(),
      phone: contactInfo.phone,
      preferredTime: contactInfo.preferredTime || '',
      userPath: userPath || 'qualified',
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
        value: 75,
        currency: 'USD'
      }, {
        eventID: eventId
      });

      // Different success handling based on user path
      if (userPath === 'contact') {
        // For "Talk to someone first" path, show success message
        updateStep('success');
      } else {
        // For qualified form submissions, show the new email/phone check message
        updateStep('reservationSuccess');
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
          "text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-l-4 pl-3 py-1 font-heading leading-relaxed",
          isHero ? "text-white border-teal-400" : "text-navy-deep border-teal-accent"
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
        )
      },
      
      form: {
        container: "space-y-4 sm:space-y-6",
        group: "space-y-2",
        label: clsx(
          "block text-lg sm:text-xl font-medium font-heading",
          isHero ? "text-white" : "text-gray-700"
        ),
        input: clsx(
          "mt-2 block w-full px-4 py-4 sm:py-5 text-lg sm:text-xl border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 transition-all duration-200 min-h-[56px] touch-manipulation",
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

  return (
    <div 
      ref={formRef} 
      className={classes.container} 
      style={{
        '--phone-input-background': context === 'hero' ? 'rgba(255, 255, 255, 0.1)' : '#fff',
        '--phone-input-text-color': context === 'hero' ? '#fff' : '#111827',
        '--phone-input-border-color': context === 'hero' ? 'rgba(255, 255, 255, 0.2)' : '#D1D5DB',
        '--phone-input-focus-ring-color': context === 'hero' ? '#2DD4BF' : '#00528A'
      }}
    >
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



              <div className={classes.question.container}>
                <p className={classes.question.text}>
                  {currentQuestion.text}
                </p>
              </div>

              <div className={classes.buttons.container}>
                {currentQuestion.answerChoices.map(choice => {
                  const isQualifyingChoice = currentQuestion.answerKey[choice] === 'Qualified';
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleAnswer(choice)}
                      className={isQualifyingChoice ? classes.buttons.primary : classes.buttons.secondary}
                    >
                      {choice}
                    </button>
                  );
                })}
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

          {/* Qualified Step - Contact Form */}
          {currentStep === 'qualified' && (
            <form onSubmit={handleSubmit} onFocus={handleContactFormStart}>
              <div className={classes.success.container}>
                <div className={classes.success.icon}>
                  <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-white" />
                </div>
                <h3 className={classes.success.title}>You Qualify for our Pre-Screening</h3>

                {/* What Happens at Your Visit & Contact Form - Combined in light blue box */}
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
                    <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
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
                          $75
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <span className="text-gray-700 text-base sm:text-lg font-medium">
                          Each Completed Study Visit
                        </span>
                        <span className="text-blue-700 text-xl sm:text-2xl font-bold">
                          $75
                        </span>
                      </div>
                    </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed text-center">
                          ⏱️ Visit takes about <strong>3 hours</strong>
                        </p>
                      </div>
                    </div>

                    {/* Contact Form - Now inside the same blue box */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* CTA Heading */}
                      <div className="text-center mb-6">
                        <h4 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 leading-tight">
                          Reserve Your Free Pre-Screening
                        </h4>
                      </div>
                      
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          name="name" 
                          id="name" 
                          required 
                          className={clsx(
                            "mt-2 block w-full px-4 py-4 sm:py-5 text-lg sm:text-xl border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 transition-all duration-200 min-h-[56px] touch-manipulation",
                            "border-blue-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                          )}
                          placeholder="Your Name" 
                          value={contactInfo.name} 
                          onChange={(e) => handleContactChange('name', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <PhoneInput 
                          name="phone" 
                          id="phone" 
                          required 
                          className={clsx(
                            "mt-2 block w-full px-4 py-4 sm:py-5 text-lg sm:text-xl border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 transition-all duration-200 min-h-[56px] touch-manipulation",
                            "border-blue-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                          )}
                          placeholder="Phone Number" 
                          value={contactInfo.phone} 
                          onChange={(value) => handleContactChange('phone', value)}
                          defaultCountry="US"
                          international={false}
                          countryCallingCodeEditable={false}
                          countries={['US']}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <input 
                          type="email" 
                          name="email" 
                          id="email" 
                          required 
                          className={clsx(
                            "mt-2 block w-full px-4 py-4 sm:py-5 text-lg sm:text-xl border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 transition-all duration-200 min-h-[56px] touch-manipulation",
                            "border-blue-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                          )}
                          placeholder="Email Address" 
                          value={contactInfo.email} 
                          onChange={(e) => handleContactChange('email', e.target.value)}
                        />
                      </div>
                      
                      {/* Main CTA - Reserve Pre-Screening */}
                      <div className="pt-2">
                        <button 
                          type="submit"
                          disabled={isSubmitting}
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
                            "min-h-[64px] touch-manipulation",
                            isSubmitting && "opacity-75 cursor-not-allowed"
                          )}
                        >
                          {/* Animated background glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Button content */}
                          <div className="relative flex items-center justify-center space-x-3">
                            {isSubmitting ? (
                              <>
                                <FontAwesomeIcon icon={faSpinner} spin className="text-xl" />
                                <span className="font-heading">Reserving...</span>
                              </>
                            ) : (
                              <>
                                <span className="text-2xl">📅</span>
                                <span className="font-heading">Get My Scheduling Link</span>
                              </>
                            )}
                          </div>
                          
                          {/* Pulse animation */}
                          <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 animate-pulse"></div>
                        </button>
                      </div>
                      
                      {errorMessage && (
                        <p className="text-center text-red-500 text-sm mt-3 p-2 bg-red-50 rounded-lg">
                          {errorMessage}
                        </p>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}



          {/* Booking Opened Confirmation */}
          {currentStep === 'bookingOpened' && (
            <div data-success-message className={classes.success.container}>
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
                          $75
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <span className="text-gray-700 text-base sm:text-lg font-medium">
                          Each Completed Study Visit
                        </span>
                        <span className="text-blue-700 text-xl sm:text-2xl font-bold">
                          $75
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
                      href="https://api.leadconnectorhq.com/widget/booking/a1VjNanrncl9AJKzAsNm"
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

          {/* Reservation Success State */}
          {currentStep === 'reservationSuccess' && (
            <div data-success-message className={classes.success.container}>
              <div className={classes.success.icon}>
                <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-white" />
              </div>
              <h3 className={classes.success.title}>Your Scheduling Link Has Been Sent!</h3>
              {/* Combined notification and scheduling */}
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border-2 border-blue-200 shadow-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">📧</span>
                    </div>
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">📱</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-800 text-xl mb-2">
                    Check Your Email & Phone
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed mb-6">
                    We have sent over your link. <strong>Check spam if you don't see it.</strong>
                  </p>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-6"></div>
                  
                  {/* Direct scheduling option */}
                  <div className="mb-4">
                    <h5 className="font-bold text-gray-800 text-lg mb-3">
                      Don't See Your Link?
                    </h5>
                  </div>
                  
                  <a 
                    href="https://api.leadconnectorhq.com/widget/booking/a1VjNanrncl9AJKzAsNm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm font-normal transition-colors duration-200"
                  >
                    Schedule Directly Instead
                  </a>
                </div>
              </div>

              {/* Contact info */}
              <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm">📞</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-1">
                    <strong>Need Help?</strong>
                  </p>
                  <p className="text-gray-600 text-lg font-bold">
                    (352) 667-7237
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {currentStep === 'success' && (
            <div data-success-message className={classes.success.container}>
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
                  Questions? You can reach our research team at <strong>(352) 667-7237</strong>
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
                  if (question && question.answerKey[answer] === 'Disqualified') {
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