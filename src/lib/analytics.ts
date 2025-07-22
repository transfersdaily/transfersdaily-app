// Google Analytics utility functions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: parameters?.label || '',
      value: parameters?.value || 0,
      ...parameters,
    });
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-XXXXXXXXXX', {
      page_title: title || document.title,
      page_location: url,
    });
  }
};

// Track newsletter signup
export const trackNewsletterSignup = (email: string) => {
  trackEvent('newsletter_signup', {
    event_category: 'conversion',
    event_label: 'newsletter',
    custom_parameters: {
      method: 'website_form',
    },
  });
};

// Track contact form submission
export const trackContactSubmission = (subject: string) => {
  trackEvent('contact_form_submit', {
    event_category: 'conversion',
    event_label: 'contact',
    custom_parameters: {
      subject_category: subject,
    },
  });
};

// Track article views
export const trackArticleView = (articleId: string, title: string, category: string) => {
  trackEvent('article_view', {
    event_category: 'content',
    event_label: 'article',
    custom_parameters: {
      article_id: articleId,
      article_title: title,
      article_category: category,
    },
  });
};

// Track search queries
export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('search', {
    event_category: 'engagement',
    event_label: 'site_search',
    custom_parameters: {
      search_term: query,
      results_count: resultsCount,
    },
  });
};

// Track user engagement
export const trackEngagement = (action: string, target: string) => {
  trackEvent('engagement', {
    event_category: 'user_interaction',
    event_label: action,
    custom_parameters: {
      target_element: target,
    },
  });
};
