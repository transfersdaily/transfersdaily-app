'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdSidebar2Props {
  className?: string;
}

export function AdSidebar2({ className = '' }: AdSidebar2Props) {
  return (
    <AdFreeZone>
      <div className={`w-full ${className}`} style={{ minWidth: '250px' }}>
        <AdSense
          adSlot="9448394733"
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
