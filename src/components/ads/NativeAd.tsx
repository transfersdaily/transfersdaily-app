'use client';

import { AdSenseAd } from './AdSenseAd';
import { AD_SLOTS, isAdSlotEnabled } from '@/lib/ads';

interface NativeAdProps {
  position: 'in-latest' | 'in-trending';
  className?: string;
}

export function NativeAd({ position, className = '' }: NativeAdProps) {
  const slotKey = position === 'in-latest' ? 'NATIVE_IN_LATEST' : 'NATIVE_IN_TRENDING';
  const slot = AD_SLOTS[slotKey];

  if (!isAdSlotEnabled(slotKey)) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <AdSenseAd 
        slot={slot}
        className="native-ad"
        style={{
          borderRadius: '0.75rem', // Match your card styling
          overflow: 'hidden'
        }}
      />
    </div>
  );
}
