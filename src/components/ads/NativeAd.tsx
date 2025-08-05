'use client';

import { AdSenseAd } from './AdSenseAd';
import { AD_SLOTS, isAdSlotEnabled } from '@/lib/ads';

interface NativeAdProps {
  position: 'in-latest' | 'in-trending' | 'in-search-results';
  className?: string;
}

export function NativeAd({ position, className = '' }: NativeAdProps) {
  const slotKeyMap = {
    'in-latest': 'NATIVE_IN_LATEST',
    'in-trending': 'NATIVE_IN_TRENDING',
    'in-search-results': 'NATIVE_IN_SEARCH_RESULTS'
  };
  
  const slotKey = slotKeyMap[position];
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
