'use client';

import { useEffect } from 'react';
import { AD_CONFIG, areAdsEnabled } from '@/lib/ads';

interface AdProviderProps {
  children: React.ReactNode;
}

export function AdProvider({ children }: AdProviderProps) {
  useEffect(() => {
    if (!areAdsEnabled()) return;

    // Enable auto ads since manual ads are disabled due to placeholder slot IDs
    if (AD_CONFIG.autoAdsEnabled) {
      // Initialize AdSense with auto ads enabled
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({
        google_ad_client: AD_CONFIG.publisherId,
        enable_page_level_ads: true // ✅ Enable auto ads
      });
    }

    // Add AdSense script to head if not already present
    if (!document.querySelector(`script[src*="${AD_CONFIG.publisherId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.publisherId}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

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
      {/* Note: Sticky bottom ad removed since it uses placeholder slot ID */}
    </>
  );
}
