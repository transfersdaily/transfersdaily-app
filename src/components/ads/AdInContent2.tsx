'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdInContent2Props {
  className?: string;
}

export function AdInContent2({ className = '' }: AdInContent2Props) {
  return (
    <AdFreeZone>
      <div className={`w-full flex justify-center my-6 ${className}`} style={{ minWidth: '300px' }}>
        <div style={{ width: '100%' }}>
          <AdSense
            adSlot="9448394733"
            adFormat="auto"
            style={{
              minHeight: '250px',
              width: '100%'
            }}
          />
        </div>
      </div>
    </AdFreeZone>
  );
}
