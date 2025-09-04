'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className = '' }: AdBannerProps) {
  return (
    <AdFreeZone>
      <div className={`w-full ${className}`} style={{ minWidth: '300px' }}>
        <AdSense
          adSlot="9393673972"
          adFormat="auto"
          style={{
            minHeight: '90px',
            width: '100%'
          }}
        />
      </div>
    </AdFreeZone>
  );
}
