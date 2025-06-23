'use client';

import { useState, useCallback } from 'react';
import { trackFbPixelEvent } from '../components/FacebookPixel';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * A simplified custom hook for firing client-side Facebook Pixel events.
 * The primary 'Lead' conversion is handled server-side for accuracy. This hook
 * is for tracking secondary user interactions (e.g., engagement, UI interactions).
 */
export function useFacebookTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState(null);

  /**
   * Tracks a custom, client-side Facebook Pixel event.
   * @param {string} eventName - The name of the custom event (e.g., 'BeganContactForm', 'QuestionnaireSkipped').
   * @param {Object} [params={}] - A key-value object of additional parameters for the event.
   */
  const trackEvent = useCallback(async (eventName, params = {}) => {
    setIsTracking(true);
    setTrackingError(null);

    try {
      // We now use the single, simplified tracking function for all client-side events.
      trackFbPixelEvent(eventName, params);
      
      if (isDev) {
        console.log(`Client-side event tracked: ${eventName}`, params);
      }
      return { success: true };

    } catch (error) {
      const errorMessage = `Failed to track client-side event: ${eventName}`;
      console.error(errorMessage, error);
      setTrackingError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsTracking(false);
    }
  }, []);

  return {
    isTracking,
    trackingError,
    trackEvent,
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