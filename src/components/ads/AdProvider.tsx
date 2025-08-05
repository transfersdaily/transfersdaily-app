'use client';

import { useEffect } from 'react';
import { AD_CONFIG, areAdsEnabled } from '@/lib/ads';
import { StickyBottomAd } from './StickyBottomAd';

interface AdProviderProps {
  children: React.ReactNode;
}

export function AdProvider({ children }: AdProviderProps) {
  useEffect(() => {
    if (!areAdsEnabled()) return;

    // Disable auto ads if using manual placement
    if (!AD_CONFIG.autoAdsEnabled) {
      // Add meta tag to disable auto ads
      const metaTag = document.createElement('meta');
      metaTag.name = 'google-adsense-platform-account';
      metaTag.content = AD_CONFIG.publisherId;
      document.head.appendChild(metaTag);

      // Disable auto ads via adsbygoogle
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({
        google_ad_client: AD_CONFIG.publisherId,
        enable_page_level_ads: false
      });
    }

    // Add AdSense script to head
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.publisherId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      const existingScript = document.querySelector(`script[src*="${AD_CONFIG.publisherId}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <>
      {children}
      {/* Global sticky bottom ad for mobile */}
      <StickyBottomAd />
    </>
  );
}
