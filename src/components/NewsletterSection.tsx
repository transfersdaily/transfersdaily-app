'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { newsletterApi } from '@/lib/api';
import { useAnalytics } from '@/lib/analytics'; // Updated import
import { Loader2, CheckCircle, Mail, Users } from 'lucide-react';
import { type Locale, type Dictionary, getTranslation } from '@/lib/i18n';

interface NewsletterSectionProps {
  locale: Locale;
  dict: Dictionary;
}

export function NewsletterSection({ locale, dict }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  
  // Initialize analytics hook
  const { trackNewsletterSubscribe } = useAnalytics();

  const t = (key: string) => getTranslation(dict, key);

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  // Handle email input change with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Reset error state when user starts typing
    if (subscriptionStatus === 'error') {
      setSubscriptionStatus('idle');
      setErrorMessage('');
    }
    
    // Real-time validation (only show error if user has typed something)
    if (newEmail.length > 0) {
      setIsEmailValid(isValidEmail(newEmail));
    } else {
      setIsEmailValid(true);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error state
    setErrorMessage('');
    setSubscriptionStatus('idle');

    // Validate email
    if (!email.trim()) {
      setSubscriptionStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setSubscriptionStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubscribing(true);

    try {
      const success = await newsletterApi.subscribe(email.trim());

      if (success) {
        setSubscriptionStatus('success');
        setEmail('');
        setErrorMessage('');
        // Track successful newsletter signup with new analytics system
        trackNewsletterSubscribe();
      } else {
        setSubscriptionStatus('error');
        setErrorMessage('Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section className="py-20 bg-muted -mx-4 px-4">
      <div className="max-w-full mx-auto">
        <Card className="border shadow-md bg-card">
          <CardContent className="p-12 md:p-16">
            {subscriptionStatus === 'success' ? (
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-600 mb-2">
                  {t('newsletter.successTitle')}
                </h3>
                <p className="text-muted-foreground">
                  {t('newsletter.successMessage')}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="bg-primary p-3 rounded-full">
                    <Mail className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {t('newsletter.title')}
                  </h3>
                </div>

                <p className="text-muted-foreground mb-6 text-sm max-w-2xl mx-auto">
                  {t('newsletter.description')}
                </p>

                <form
                  onSubmit={handleNewsletterSubmit}
                  className="mb-6 max-w-md mx-auto"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder={t('newsletter.emailPlaceholder')}
                      className={`flex-1 h-11 focus:border-primary focus:ring-primary focus:outline-none ${
                        !isEmailValid && email.length > 0 ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                      }`}
                      value={email}
                      onChange={handleEmailChange}
                      disabled={isSubscribing}
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      title="Please enter a valid email address"
                    />
                    <Button
                      type="submit"
                      className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                      disabled={isSubscribing || !email || !isEmailValid}
                    >
                      {isSubscribing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('newsletter.subscribing')}
                        </>
                      ) : (
                        t('newsletter.subscribe')
                      )}
                    </Button>
                  </div>

                  {subscriptionStatus === 'error' && (
                    <p className="text-sm text-destructive mt-3">
                      {errorMessage || 'Please check your email and try again.'}
                    </p>
                  )}
                </form>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {t('newsletter.joinSubscribers')} • No spam • Unsubscribe
                    anytime
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
