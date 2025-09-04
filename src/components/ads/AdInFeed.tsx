'use client';

import { useEffect } from 'react';
import { AdFreeZone } from './AdFreeZone';

interface AdInFeedProps {
  className?: string;
}

export function AdInFeed({ className = '' }: AdInFeedProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <AdFreeZone>
      <div className={`w-full ${className}`} style={{ minWidth: '250px' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="fluid"
          data-ad-layout-key="-6l+ck+46-u-1"
          data-ad-client="ca-pub-6269937543968234"
          data-ad-slot="3976576205"
        />
      </div>
    </AdFreeZone>
  );
}
