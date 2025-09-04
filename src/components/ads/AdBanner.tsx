'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className = '' }: AdBannerProps) {
  return (
    <AdFreeZone>
      <div className={`w-full flex justify-center my-4 ${className}`} style={{ minWidth: '300px' }}>
        <div style={{ width: '100%', maxWidth: '728px' }}>
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
