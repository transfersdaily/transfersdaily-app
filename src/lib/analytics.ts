// Analytics Configuration for TransfersDaily
import { usePlausible } from 'next-plausible'

// Plausible Analytics Configuration
export const ANALYTICS_CONFIG = {
  domain: 'transfersdaily.com',
  trackOutboundLinks: true,
  trackFileDownloads: true,
  enabled: process.env.NODE_ENV === 'production',
  // Custom events for football content
  events: {
    // Article interactions
    ARTICLE_VIEW: 'Article View',
    ARTICLE_SHARE: 'Article Share',
    ARTICLE_LIKE: 'Article Like',
    
    // Newsletter interactions
    NEWSLETTER_SUBSCRIBE: 'Newsletter Subscribe',
    NEWSLETTER_UNSUBSCRIBE: 'Newsletter Unsubscribe',
    
    // Search interactions
    SEARCH_QUERY: 'Search Query',
    SEARCH_RESULT_CLICK: 'Search Result Click',
    
    // Transfer interactions
    TRANSFER_VIEW: 'Transfer View',
    TRANSFER_FILTER: 'Transfer Filter',
    
    // User engagement
    CONTACT_FORM_SUBMIT: 'Contact Form Submit',
    OUTBOUND_LINK_CLICK: 'Outbound Link Click',
    
    // Admin actions (for internal tracking)
    ADMIN_LOGIN: 'Admin Login',
    ADMIN_ARTICLE_CREATE: 'Admin Article Create',
    ADMIN_ARTICLE_PUBLISH: 'Admin Article Publish',
  }
}

// Custom hook for tracking events
export function useAnalytics() {
  const plausible = usePlausible()
  
  const trackEvent = (eventName: string, props?: Record<string, any>) => {
    if (ANALYTICS_CONFIG.enabled) {
      plausible(eventName, { props })
    }
  }
  
  // Specific tracking functions
  const trackArticleView = (articleId: string, title: string, category?: string) => {
    trackEvent(ANALYTICS_CONFIG.events.ARTICLE_VIEW, {
      articleId,
      title,
      category,
    })
  }
  
  const trackNewsletterSubscribe = (email?: string) => {
    trackEvent(ANALYTICS_CONFIG.events.NEWSLETTER_SUBSCRIBE, {
      timestamp: new Date().toISOString(),
    })
  }
  
  const trackSearch = (query: string, resultsCount?: number) => {
    trackEvent(ANALYTICS_CONFIG.events.SEARCH_QUERY, {
      query,
      resultsCount,
    })
  }
  
  const trackTransferView = (playerId?: string, playerName?: string, fromClub?: string, toClub?: string) => {
    trackEvent(ANALYTICS_CONFIG.events.TRANSFER_VIEW, {
      playerId,
      playerName,
      fromClub,
      toClub,
    })
  }
  
  const trackContactSubmission = (email?: string, subject?: string) => {
    trackEvent(ANALYTICS_CONFIG.events.CONTACT_FORM_SUBMIT, {
      email,
      subject,
      timestamp: new Date().toISOString(),
    })
  }
  
  return {
    trackEvent,
    trackArticleView,
    trackNewsletterSubscribe,
    trackSearch,
    trackTransferView,
    trackContactSubmission,
  }
}

// Page view tracking (automatic with next-plausible)
export function trackPageView(url: string, referrer?: string) {
  if (typeof window !== 'undefined' && ANALYTICS_CONFIG.enabled) {
    // This is handled automatically by next-plausible
    // But you can add custom logic here if needed
    console.log(`Page view tracked: ${url}`)
  }
}

// Standalone function for contact form tracking
export function trackContactSubmission(email?: string, subject?: string) {
  if (typeof window !== 'undefined' && ANALYTICS_CONFIG.enabled) {
    // You can implement direct tracking here if needed
    console.log('Contact form submitted:', { email, subject })
  }
}
