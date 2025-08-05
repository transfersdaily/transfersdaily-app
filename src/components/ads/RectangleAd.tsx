'use client';

import { AdSenseAd } from './AdSenseAd';
import { AD_SLOTS, isAdSlotEnabled } from '@/lib/ads';

interface RectangleAdProps {
  position: 'after-latest' | 'after-leagues' | 'after-newsletter' | 'after-content' | 'sidebar-top' | 'sidebar-middle';
  className?: string;
}

export function RectangleAd({ position, className = '' }: RectangleAdProps) {
  const slotKeyMap = {
    'after-latest': 'RECTANGLE_AFTER_LATEST',
    'after-leagues': 'RECTANGLE_AFTER_LEAGUES', 
    'after-newsletter': 'RECTANGLE_AFTER_NEWSLETTER',
    'after-content': 'RECTANGLE_AFTER_CONTENT',
    'sidebar-top': 'SIDEBAR_TOP',
    'sidebar-middle': 'SIDEBAR_MIDDLE'
  };

  const slotKey = slotKeyMap[position];
  const slot = AD_SLOTS[slotKey];

  if (!isAdSlotEnabled(slotKey)) {
    return null;
  }

  const isSidebar = position.includes('sidebar');

  return (
    <div className={`w-full flex justify-center ${isSidebar ? 'my-4' : 'my-6'} ${className}`}>
      <AdSenseAd 
        slot={slot}
        className={`rectangle-ad ${isSidebar ? 'sidebar-ad' : ''}`}
      />
    </div>
  );
}
