const bizSdk = require('facebook-nodejs-business-sdk');

const isDev = process.env.NODE_ENV !== 'production';

class FacebookConversionsAPI {
  constructor() {
    // Debug all Facebook-related environment variables
    if (isDev) {
      console.log('All environment variables:', {
        FACEBOOK_ACCESS_TOKEN: process.env.FACEBOOK_ACCESS_TOKEN ? 'SET' : 'NOT SET',
        NEXT_PUBLIC_FACEBOOK_PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
        FACEBOOK_TEST_EVENT_CODE: process.env.FACEBOOK_TEST_EVENT_CODE ? 'SET' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV
      });
    }
    
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    this.pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    this.testEventCode = process.env.FACEBOOK_TEST_EVENT_CODE;
    
    // Debug logging
    if (isDev) {
      console.log('Facebook Conversions API initialized with:', {
        hasAccessToken: !!this.accessToken,
        pixelId: this.pixelId,
        hasTestEventCode: !!this.testEventCode
      });
    }
    
    if (!this.accessToken || !this.pixelId) {
      console.warn('Facebook Conversions API: Missing required environment variables', {
        accessToken: !!this.accessToken
      });
      // Don't return early - continue with initialization but mark as invalid
      this.isValid = false;
    } else {
      this.isValid = true;
    }

    // Initialize the SDK with explicit configuration
    if (this.accessToken) {
      try {
        const api = bizSdk.FacebookAdsApi.init(this.accessToken);
        this.api = api;
        if (isDev) {
          console.log('Facebook Ads API initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize Facebook Ads API:', error);
        this.isValid = false;
      }
    }
  }

  /**
   * Send an event to Facebook Conversions API
   * @param {Object} eventData - The event data
   * @param {string} eventData.eventName - Facebook event name (e.g., 'PageView', 'Lead', 'Purchase')
   * @param {string} eventData.eventId - Unique event ID for deduplication
   * @param {Object} eventData.userData - User data for matching
   * @param {Object} eventData.customData - Custom event parameters
   * @param {string} eventData.sourceUrl - URL where the event occurred
   * @param {string} eventData.userAgent - User agent string
   * @param {string} eventData.clientIpAddress - Client IP address
   */
  async sendEvent(eventData) {
    // First check if the API is properly configured
    if (!this.isValid) {
      console.error('Facebook Conversions API not properly configured');
      return { success: false, error: 'API not properly configured' };
    }
    
    if (!this.accessToken || !this.pixelId) {
      console.error('Facebook Conversions API not initialized - missing credentials');
      return { success: false, error: 'Missing credentials' };
    }

    try {
      const {
        eventName,
        eventId,
        userData = {},
        customData = {},
        sourceUrl,
        userAgent,
        clientIpAddress
      } = eventData;

      // Create user data object
      const fbUserData = new bizSdk.UserData();
      
      // Hash and set user data (Facebook automatically handles hashing)
      if (userData.email) fbUserData.setEmail(userData.email);
      if (userData.phone) fbUserData.setPhone(userData.phone);
      if (userData.firstName) fbUserData.setFirstName(userData.firstName);
      if (userData.lastName) fbUserData.setLastName(userData.lastName);
      if (userData.city) fbUserData.setCity(userData.city);
      if (userData.state) fbUserData.setState(userData.state);
      if (userData.zipCode) fbUserData.setZipCode(userData.zipCode);
      if (userData.country) fbUserData.setCountry(userData.country);
      if (clientIpAddress) fbUserData.setClientIpAddress(clientIpAddress);
      if (userAgent) fbUserData.setClientUserAgent(userAgent);

      // Create custom data object
      const fbCustomData = new bizSdk.CustomData();
      
      // Set custom data fields
      if (customData.value) fbCustomData.setValue(customData.value);
      if (customData.currency) fbCustomData.setCurrency(customData.currency);
      if (customData.contentName) fbCustomData.setContentName(customData.contentName);
      if (customData.contentCategory) fbCustomData.setContentCategory(customData.contentCategory);
      if (customData.contentIds) fbCustomData.setContentIds(customData.contentIds);
      if (customData.contentType) fbCustomData.setContentType(customData.contentType);

      // Create server event
      const serverEvent = new bizSdk.ServerEvent();
      serverEvent.setEventName(eventName);
      serverEvent.setEventTime(Math.floor(Date.now() / 1000));
      serverEvent.setUserData(fbUserData);
      serverEvent.setCustomData(fbCustomData);
      serverEvent.setActionSource('website');
      
      if (eventId) serverEvent.setEventId(eventId);
      if (sourceUrl) serverEvent.setEventSourceUrl(sourceUrl);

      // Ensure pixelId is a string and clean it
      const cleanPixelId = String(this.pixelId).trim();
      if (!cleanPixelId) {
        throw new Error('AdsPixel Id is empty after cleaning');
      }

      if (isDev) {
        console.log('About to execute Facebook event request with pixelId:', cleanPixelId, 'type:', typeof cleanPixelId);
      }

      // Create event request with proper array format
      const eventsData = [serverEvent];
      const eventRequest = new bizSdk.EventRequest(this.accessToken, cleanPixelId);
      eventRequest.setEvents(eventsData);
      
      // Add test event code if in development
      if (this.testEventCode && process.env.NODE_ENV === 'development') {
        eventRequest.setTestEventCode(this.testEventCode);
      }

      // Debug the eventRequest before execution
      if (isDev) {
        console.log('EventRequest created successfully, about to execute...');
      }

      // Send event
      const response = await eventRequest.execute();
      
      if (isDev) {
        console.log('Facebook Conversions API event sent successfully:', {
          eventName,
          eventId,
          pixelId: this.pixelId
        });
      }

      return { 
        success: true, 
        response,
        eventId 
      };

    } catch (error) {
      console.error('Facebook Conversions API error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Track a page view event
   */
  async trackPageView(userData, sourceUrl, userAgent, clientIpAddress) {
    const eventId = `pageview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return this.sendEvent({
      eventName: 'PageView',
      eventId,
      userData,
      sourceUrl,
      userAgent,
      clientIpAddress
    });
  }

  /**
   * Track a lead event (form submission)
   */
  async trackLead(userData, customData, sourceUrl, userAgent, clientIpAddress) {
    const eventId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return this.sendEvent({
      eventName: 'Lead',
      eventId,
      userData,
      customData,
      sourceUrl,
      userAgent,
      clientIpAddress
    });
  }

  /**
   * Track a custom event
   */
  async trackCustomEvent(eventName, userData, customData, sourceUrl, userAgent, clientIpAddress) {
    const eventId = `${eventName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return this.sendEvent({
      eventName,
      eventId,
      userData,
      customData,
      sourceUrl,
      userAgent,
      clientIpAddress
    });
  }
}

module.exports = FacebookConversionsAPI; 