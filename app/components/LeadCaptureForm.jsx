'use client';

import { useState } from 'react';
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
    id: 'q2_uc_diagnosis',
    text: 'Have you been diagnosed with ulcerative colitis (not Crohn\'s disease or indeterminate colitis)?',
    qualifyingAnswer: true,
    disqualifyMessage: 'A formal diagnosis of Ulcerative Colitis is required.'
  },
  {
    id: 'q3_uc_symptoms',
    text: 'Are you currently experiencing moderate to severe UC symptoms, such as:',
    bullets: [
      'Frequent loose or bloody stools',
      'Urgent bowel movements',
      'Abdominal pain or cramping'
    ],
    qualifyingAnswer: true,
    disqualifyMessage: 'The study requires participants to be experiencing active UC symptoms.'
  },
  {
    id: 'q4_tried_treatments',
    text: 'Have you tried any of the following treatments for UC and either didn\'t improve, got worse, or had side effects?',
    bullets: [
      'Steroids (e.g., prednisone, budesonide)',
      '5-ASA medications (e.g., mesalamine, sulfasalazine)',
      'Immunosuppressants (e.g., azathioprine, 6-MP, methotrexate)',
      'Biologics (e.g., Remicade, Humira, Entyvio, Stelara)',
      'JAK inhibitors (e.g., Xeljanz, Rinvoq)',
      'S1P modulators (e.g., Zeposia, etrasimod)'
    ],
    qualifyingAnswer: true,
    disqualifyMessage: 'Participants should have tried other UC treatments without success.'
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
      'Crohn\'s disease',
      'Microscopic colitis',
      'Indeterminate colitis',
      'Primary sclerosing cholangitis'
    ],
    qualifyingAnswer: false,
    disqualifyMessage: 'A diagnosis of Crohn\'s, microscopic colitis, or other specific conditions may exclude you.'
  },
  {
    id: 'q7_hospitalized_or_surgery',
    text: 'Have you been hospitalized for a UC flare within the past 2 weeks or do you currently need surgery for UC?',
    qualifyingAnswer: false,
    disqualifyMessage: 'Recent hospitalization or currently needing surgery for UC are exclusion criteria.'
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
    id: 'q10_willing_for_endoscopy',
    text: 'Are you able and willing to undergo a colonoscopy or flexible sigmoidoscopy if needed?',
    qualifyingAnswer: true,
    disqualifyMessage: 'Willingness to undergo a potential endoscopy is required for the study.'
  },
  {
    id: 'q11_pregnant_or_breastfeeding',
    text: 'Are you currently pregnant or breastfeeding, or planning to become pregnant in the next 3 months?',
    qualifyingAnswer: false,
    disqualifyMessage: 'Participants cannot be pregnant, breastfeeding, or planning to become pregnant soon.'
  }
];

export default function LeadCaptureForm({ context = 'default' }) {
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
    email: ''
  });
  const [disqualifyingStep, setDisqualifyingStep] = useState(null);

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
      study_type: 'UC Clinical Trial Screening'
    });

    // Check if this answer disqualifies the user
    if (answer !== question.qualifyingAnswer) {
      setDisqualifyingStep(currentStep); // Track which step disqualified them
      setCurrentStep('notQualified');
      return;
    }

    // Move to next question or contact form
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep('contactInfo');
    }
  };

  const handleSkipToContact = () => {
    setSkippedPrescreen(true);
    setAnswers({});
    
    trackEvent('QuestionnaireSkipped', {
      from_step: currentStep,
      study_type: 'UC Clinical Trial Screening'
    });
    
    setCurrentStep('contactInfo');
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
        study_type: 'UC Clinical Trial Screening'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const submissionData = {
      firstName: toProperCase(contactInfo.name?.split(' ')[0] || ''),
      lastName: toProperCase(contactInfo.name?.split(' ').slice(1).join(' ') || ''),
      email: contactInfo.email.toLowerCase(),
      phone: contactInfo.phone,
      skippedPrescreen,
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

      setCurrentStep('success');

    } catch (error) {
      console.error('Error during form submission process:', error);
      setErrorMessage('There was an error submitting your information. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setSkippedPrescreen(false);
    setContactFormStarted(false);
    setAnswers({});
    setContactInfo({ name: '', phone: '', email: '' });
    setErrorMessage('');
    setDisqualifyingStep(null);
  };

  const goBackFromDisqualified = () => {
    // Remove the disqualifying answer and go back to that question
    if (disqualifyingStep !== null) {
      const disqualifyingQuestion = QUESTIONS[disqualifyingStep];
      const newAnswers = { ...answers };
      delete newAnswers[disqualifyingQuestion.id];
      setAnswers(newAnswers);
      setCurrentStep(disqualifyingStep);
      setDisqualifyingStep(null);
    }
  };

  const goBack = () => {
    if (currentStep > 0 && currentStep < totalQuestions) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Style classes based on context
  const getClasses = () => {
    const isHero = context === 'hero';
    
    return {
      container: "w-full max-w-full mx-auto",
      
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
        container: "grid grid-cols-1 gap-2 sm:gap-3 mb-4",
        primary: clsx(
          "w-full px-4 py-3 sm:py-4 text-sm sm:text-base font-bold text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 font-heading shadow-lg hover:shadow-xl",
          isHero 
            ? "bg-gradient-to-br from-teal-500 to-cyan-600 focus:ring-teal-400" 
            : "bg-gradient-to-br from-blue-primary to-navy-deep focus:ring-blue-primary"
        ),
        secondary: clsx(
          "w-full px-4 py-3 sm:py-4 text-sm sm:text-base font-bold text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 font-heading",
          isHero 
            ? "bg-white/10 border border-white/20 hover:bg-white/20 focus:ring-teal-400" 
            : "bg-blue-primary/50 border border-blue-primary/80 hover:bg-blue-primary/70 focus:ring-blue-primary"
        ),
        tertiary: clsx(
          "w-full text-center px-4 py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 font-body",
          isHero 
            ? "border border-white/50 text-white/90 hover:bg-white/10 focus:ring-teal-400" 
            : "border border-blue-primary/80 text-blue-primary hover:bg-blue-primary/10 focus:ring-blue-primary"
        ),
        back: clsx(
          "inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 mb-3",
          isHero 
            ? "text-white/80 hover:text-white hover:bg-white/10 focus:ring-teal-400" 
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-blue-primary"
        )
      },
      
      form: {
        container: "space-y-3 sm:space-y-4",
        group: "space-y-1",
        label: clsx(
          "block text-sm sm:text-base font-medium font-heading",
          isHero ? "text-white" : "text-gray-700"
        ),
        input: clsx(
          "mt-1 block w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200",
          isHero 
            ? "border-white/20 bg-white/10 text-white placeholder-white/70 focus:ring-teal-400 focus:border-teal-400" 
            : "border-gray-300 bg-white text-gray-900 focus:ring-navy-accent focus:border-navy-accent"
        )
      },
      
      success: {
        container: "text-center space-y-3 sm:space-y-4",
        icon: "mx-auto mb-3 bg-gradient-to-br from-teal-accent to-blue-primary rounded-full p-3 w-16 h-16 flex items-center justify-center shadow-lg",
        title: clsx(
          "text-xl sm:text-2xl font-bold font-heading",
          isHero ? "text-white" : "text-navy-deep"
        ),
        text: clsx(
          "text-sm sm:text-base opacity-90 font-body",
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
    <div className={classes.container} style={phoneInputStyle}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full"
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

          {/* Success State */}
          {currentStep === 'success' && (
            <div className={classes.success.container}>
              <div className={classes.success.icon}>
                <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-white" />
              </div>
              <h3 className={classes.success.title}>Thank You!</h3>
              <p className={classes.success.text}>
                Your information has been submitted successfully. Our team will contact you shortly.
              </p>
              <button 
                type="button" 
                onClick={restart} 
                className={classes.buttons.tertiary}
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