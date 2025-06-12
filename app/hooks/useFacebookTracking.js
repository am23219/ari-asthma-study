'use client';

import { useState, useCallback } from 'react';
import { trackLead, trackCustomEvent, trackFbPixelEvent } from '../components/FacebookPixel';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Custom hook for Facebook tracking with easy form integration
 */
export function useFacebookTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState(null);

  /**
   * Track a lead (form submission) - PRIMARY CONVERSION GOAL
   * @param {Object} formData - Form data containing user information
   * @param {Object} options - Additional tracking options
   */
  const trackFormSubmission = useCallback(async (formData, options = {}) => {
    setIsTracking(true);
    setTrackingError(null);

    try {
      // Extract user data from form
      const userData = {
        email: formData.email || '',
        phone: formData.phone || '',
        firstName: formData.firstName || formData.first_name || '',
        lastName: formData.lastName || formData.last_name || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || formData.zip_code || '',
        country: formData.country || 'US'
      };

      // Clean up user data (remove empty values)
      Object.keys(userData).forEach(key => {
        if (!userData[key]) delete userData[key];
      });

      // Custom data for tracking
      const customData = {
        formName: options.formName || 'Contact Form',
        currency: options.currency || 'USD',
        contentCategory: options.contentCategory || 'Lead Generation',
        conversion_type: 'form_submission', // PRIMARY conversion
        lead_quality: 'high', // Form submissions are high quality
        ...options.customData
      };

      // Track the lead as PRIMARY conversion
      trackLead(userData, customData);

      // Also send directly to our lead API for better server-side tracking
      const response = await fetch('/api/facebook/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData,
          customData,
          leadValue: options.value,
          formName: options.formName,
          pageUrl: window.location.href,
          conversionType: 'form_submission'
        }),
      });

      if (!response.ok) {
        throw new Error(`Server-side tracking failed: ${response.statusText}`);
      }

      const result = await response.json();
      if (isDev) {
        console.log('FORM SUBMISSION tracked successfully (PRIMARY GOAL):', result);
      }

      return { success: true, eventId: result.eventId };

    } catch (error) {
      console.error('Error tracking form submission:', error);
      setTrackingError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsTracking(false);
    }
  }, []);

  /**
   * Track a custom event
   * @param {string} eventName - Name of the event
   * @param {Object} eventData - Event data
   * @param {Object} userData - User data if available
   */
  const trackEvent = useCallback(async (eventName, eventData = {}, userData = {}) => {
    setIsTracking(true);
    setTrackingError(null);

    try {
      trackCustomEvent(eventName, eventData, userData, eventData);
      return { success: true };
    } catch (error) {
      console.error('Error tracking event:', error);
      setTrackingError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsTracking(false);
    }
  }, []);

  /**
   * Track user engagement events
   */
  const trackEngagement = useCallback((action, details = {}) => {
    trackCustomEvent('Engagement', {
      action,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      ...details
    });
  }, []);

  /**
   * Track page interactions
   */
  const trackInteraction = useCallback((element, action = 'click') => {
    trackCustomEvent('Interaction', {
      element,
      action,
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    });
  }, []);

  /**
   * Track call button clicks - SECONDARY conversion (fallback option)
   * @param {Object} options - Additional tracking options
   */
  const trackCallButtonClick = useCallback(async (options = {}) => {
    setIsTracking(true);
    setTrackingError(null);

    try {
      const eventData = {
        event_source_url: window.location.href,
        phone_number: '3526677237',
        button_location: options.location || 'unknown',
        page_title: document.title,
        content_category: 'Phone Contact',
        content_name: 'Call Button Click',
        study_type: 'NASH/MASH',
        conversion_type: 'phone_call', // SECONDARY conversion
        lead_quality: 'medium', // Calls are medium quality (less data)
        // No value needed - this is lead generation, not sales
        ...options.customData
      };

      // Track as Contact event (secondary priority)
      trackCustomEvent('Contact', eventData);
      
      // Note: NOT tracking as InitiateCheckout since form submission is preferred
      if (isDev) {
        console.log('Call button tracking (SECONDARY goal):', eventData);
      }
      setTrackingError(null);
    } catch (error) {
      console.error('Call button tracking error:', error);
      setTrackingError(error.message);
    } finally {
      setIsTracking(false);
    }
  }, []);

  /**
   * Track phone number interactions (click-to-call links) - SECONDARY
   * @param {string} phoneNumber - The phone number being called
   * @param {Object} options - Additional tracking options
   */
  const trackPhoneInteraction = useCallback(async (phoneNumber, options = {}) => {
    setIsTracking(true);
    setTrackingError(null);

    try {
      const eventData = {
        event_source_url: window.location.href,
        phone_number: phoneNumber,
        interaction_type: 'click_to_call',
        page_title: document.title,
        content_category: 'Phone Contact',
        content_name: 'Phone Number Click',
        study_type: 'NASH/MASH',
        conversion_type: 'phone_call', // SECONDARY conversion
        lead_quality: 'medium',
        // No value needed - this is lead generation, not sales
        ...options.customData
      };

      trackCustomEvent('Contact', eventData);

      if (isDev) {
        console.log('Phone interaction tracking (SECONDARY goal):', eventData);
      }
      setTrackingError(null);
    } catch (error) {
      console.error('Phone interaction tracking error:', error);
      setTrackingError(error.message);
    } finally {
      setIsTracking(false);
    }
  }, []);

  return {
    // State
    isTracking,
    trackingError,

    // Methods
    trackFormSubmission,
    trackEvent,
    trackEngagement,
    trackInteraction,
    trackCallButtonClick,
    trackPhoneInteraction,

    // Clear error
    clearError: () => setTrackingError(null)
  };
}

/**
 * Hook for tracking form fields and user behavior
 */
export function useFormTracking(formName) {
  const { trackEngagement } = useFacebookTracking();

  const trackFieldFocus = useCallback((fieldName) => {
    trackEngagement('field_focus', { formName, fieldName });
  }, [formName, trackEngagement]);

  const trackFieldComplete = useCallback((fieldName) => {
    trackEngagement('field_complete', { formName, fieldName });
  }, [formName, trackEngagement]);

  const trackFormStart = useCallback(() => {
    trackEngagement('form_start', { formName });
  }, [formName, trackEngagement]);

  const trackFormProgress = useCallback((progress) => {
    trackEngagement('form_progress', { formName, progress });
  }, [formName, trackEngagement]);

  return {
    trackFieldFocus,
    trackFieldComplete,
    trackFormStart,
    trackFormProgress
  };
} 