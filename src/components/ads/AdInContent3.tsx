'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdInContent3Props {
  className?: string;
}

export function AdInContent3({ className = '' }: AdInContent3Props) {
  return (
    <AdFreeZone>
      <div className={`w-full ${className}`} style={{ minWidth: '300px' }}>
        <AdSense
          adSlot="3074558076"
          adFormat="auto"
          style={{
            minHeight: '250px',
            width: '100%'
          }}
        />
      </div>
    </AdFreeZone>
  );
}
