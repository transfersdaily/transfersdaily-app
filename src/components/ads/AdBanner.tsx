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
        <div style={{ width: '728px', height: '90px' }}>
          <AdSense
            adSlot="9393673972"
            adFormat="rectangle"
            style={{
              width: '728px',
              height: '90px'
            }}
            fullWidthResponsive={false}
          />
        </div>
      </div>
    </AdFreeZone>
  );
}
