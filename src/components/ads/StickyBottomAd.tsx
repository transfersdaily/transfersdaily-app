'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AdSenseAd } from './AdSenseAd';
import { AD_SLOTS } from '@/lib/ads';

export function StickyBottomAd() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only show on mobile
  if (!isMobile || !isVisible) return null;

  const slot = AD_SLOTS.STICKY_BOTTOM_MOBILE;
  if (!slot.enabled) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg lg:hidden">
      <div className="relative">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-1 right-1 z-10 p-1 bg-background/80 rounded-full hover:bg-background transition-colors"
          aria-label="Close ad"
        >
          <X className="h-3 w-3" />
        </button>
        
        {/* Ad content */}
        <div className="p-2">
          <AdSenseAd 
            slot={slot}
            className="sticky-bottom-ad"
          />
        </div>
      </div>
    </div>
  );
}
