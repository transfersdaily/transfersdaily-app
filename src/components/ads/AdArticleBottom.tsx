'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdArticleBottomProps {
  className?: string;
}

export function AdArticleBottom({ className = '' }: AdArticleBottomProps) {
  return (
    <AdFreeZone>
      <div className={`w-full flex justify-center my-8 ${className}`}>
        <AdSense
          adSlot="9448394733"
          adFormat="auto"
          style={{
            minHeight: '250px',
            width: '100%',
            maxWidth: '100%'
          }}
        />
      </div>
    </AdFreeZone>
  );
}
