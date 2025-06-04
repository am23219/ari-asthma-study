const bizSdk = require('facebook-nodejs-business-sdk');

class FacebookConversionsAPI {
  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    this.pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    this.testEventCode = process.env.FACEBOOK_TEST_EVENT_CODE;
    
    if (!this.accessToken || !this.pixelId) {
      console.warn('Facebook Conversions API: Missing required environment variables');
      return;
    }

    // Initialize the SDK once with the access token
    this.api = bizSdk.FacebookAdsApi.init(this.accessToken);
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
      if (userData.country) fbUserData.setCountryCode(userData.country);
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

      // Create event request
      const eventsData = [serverEvent];
      const eventRequest = new bizSdk.EventRequest(
        this.accessToken,
        this.pixelId
      );
      // ensure the request uses the correct token and pixel ID
      eventRequest.setAccessToken(this.accessToken);
      eventRequest.setEvents(eventsData);
      
      // Add test event code if in development
      if (this.testEventCode && process.env.NODE_ENV === 'development') {
        eventRequest.setTestEventCode(this.testEventCode);
      }

      // Send event
      const response = await eventRequest.execute();
      
      console.log('Facebook Conversions API event sent successfully:', {
        eventName,
        eventId,
        pixelId: this.pixelId
      });

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

module.exports = new FacebookConversionsAPI(); 