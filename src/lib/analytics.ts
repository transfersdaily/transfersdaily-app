// Analytics Configuration for TransfersDaily - Google Analytics 4

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA4_MEASUREMENT_ID = 'G-2VJKVM04W7';

/**
 * Track a custom event via GA4 gtag.
 * Safe to call server-side or during SSR (no-ops when window is unavailable).
 */
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

/**
 * Track a successful contact form submission.
 */
export function trackContactSubmission(subject?: string): void {
  trackEvent('contact_form_submit', {
    subject,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track a successful newsletter subscription.
 */
export function trackNewsletterSubscribe(): void {
  trackEvent('newsletter_subscribe', {
    timestamp: new Date().toISOString(),
  });
}
