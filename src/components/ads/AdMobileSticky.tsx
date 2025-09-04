'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdMobileStickyProps {
  slot: string;
}

export function AdMobileSticky({ slot }: AdMobileStickyProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile || !isVisible) return null;

  return (
    <AdFreeZone>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
        <div className="relative">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-1 right-1 z-10 p-1 bg-background/80 rounded-full"
            aria-label="Close ad"
          >
            <X className="h-3 w-3" />
          </button>
          <AdSense
            adSlot={slot}
            adFormat="auto"
            style={{
              minHeight: '50px',
              width: '100%'
            }}
          />
        </div>
      </div>
    </AdFreeZone>
  );
}
