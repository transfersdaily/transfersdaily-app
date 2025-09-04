'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdInContent2Props {
  className?: string;
}

export function AdInContent2({ className = '' }: AdInContent2Props) {
  return (
    <AdFreeZone>
      <div className={`w-full ${className}`} style={{ minWidth: '300px' }}>
        <AdSense
          adSlot="3976576205"
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
