'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className = '' }: AdBannerProps) {
  return (
    <AdFreeZone>
      <div className={`w-full flex justify-center my-4 ${className}`}>
        <div className="w-full max-w-4xl px-4">
          <AdSense
            adSlot="9393673972"
            adFormat="auto"
            style={{
              minHeight: '90px',
              width: '100%'
            }}
          />
        </div>
      </div>
    </AdFreeZone>
  );
}
