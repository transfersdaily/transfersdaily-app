'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdSidebarProps {
  slot: string;
  size?: 'medium' | 'large';
  className?: string;
}

export function AdSidebar({ slot, size = 'medium', className = '' }: AdSidebarProps) {
  const sizeConfig = {
    medium: {
      minHeight: '250px',
      maxWidth: '300px'
    },
    large: {
      minHeight: '600px', 
      maxWidth: '300px'
    }
  };

  const config = sizeConfig[size];

  return (
    <AdFreeZone>
      <div className={`w-full flex justify-center ${className}`}>
        <AdSense
          adSlot={slot}
          adFormat="rectangle"
          style={{
            minHeight: config.minHeight,
            maxWidth: config.maxWidth,
            width: '100%'
          }}
        />
      </div>
    </AdFreeZone>
  );
}
