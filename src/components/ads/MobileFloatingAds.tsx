'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AdSenseAd } from './AdSenseAd';
import { AD_SLOTS } from '@/lib/ads';
import { MOBILE_AD_STRATEGY } from '@/lib/mobile-ads';

// Top floating ad (always visible)
export function MobileTopFloatingAd() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile || !MOBILE_AD_STRATEGY.MANUAL_MOBILE_ADS.TOP_FLOATING.enabled) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border shadow-sm lg:hidden">
      <div className="p-2 flex justify-center">
        <div className="w-[320px] h-[50px] bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
          Mobile Top Floating Ad (320x50)
        </div>
      </div>
    </div>
  );
}

// Enhanced bottom sticky ad (closeable)
export function MobileBottomFloatingAd() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile || !isVisible || !MOBILE_AD_STRATEGY.MANUAL_MOBILE_ADS.BOTTOM_FLOATING.enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg lg:hidden">
      <div className="relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-1 right-1 z-10 p-1 bg-background/80 rounded-full hover:bg-background transition-colors"
          aria-label="Close ad"
        >
          <X className="h-3 w-3" />
        </button>
        
        <div className="p-2 flex justify-center">
          <div className="w-[320px] h-[50px] bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
            Mobile Bottom Floating Ad (320x50) - Closeable
          </div>
        </div>
      </div>
    </div>
  );
}

// Auto ads enabler (when using Google's auto ads)
export function MobileAutoAds() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only enable auto ads on mobile when configured
  if (!isMobile || !MOBILE_AD_STRATEGY.USE_AUTO_ADS_ON_MOBILE) {
    return null;
  }

  useEffect(() => {
    // Enable Google Auto Ads for mobile
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      window.adsbygoogle.push({
        google_ad_client: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID,
        enable_page_level_ads: true,
        overlays: {bottom: true}, // Enable bottom anchor ads
        vignettes: {enabled: true} // Enable full-screen ads between pages
      });
    }
  }, []);

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
      crossOrigin="anonymous"
    />
  );
}
