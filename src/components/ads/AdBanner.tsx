'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdBannerProps {
  slot: string;
  className?: string;
  size?: 'header' | 'section' | 'footer';
}

export function AdBanner({ slot, className = '', size = 'section' }: AdBannerProps) {
  const sizeStyles = {
    header: 'min-h-[50px] md:min-h-[90px]',
    section: 'min-h-[100px] md:min-h-[90px]', 
    footer: 'min-h-[50px] md:min-h-[90px]'
  };

  return (
    <AdFreeZone>
      <div className={`w-full flex justify-center my-4 ${sizeStyles[size]} ${className}`}>
        <AdSense
          adSlot={slot}
          adFormat="auto"
          className="w-full max-w-[728px]"
          style={{ 
            minHeight: size === 'section' ? '100px' : '50px',
            width: '100%'
          }}
        />
      </div>
    </AdFreeZone>
  );
}
