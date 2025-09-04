'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdInContent3Props {
  className?: string;
}

export function AdInContent3({ className = '' }: AdInContent3Props) {
  return (
    <AdFreeZone>
      <div className={`w-full flex justify-center my-6 ${className}`} style={{ minWidth: '300px' }}>
        <div style={{ width: '100%' }}>
          <AdSense
            adSlot="9228902885"
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
