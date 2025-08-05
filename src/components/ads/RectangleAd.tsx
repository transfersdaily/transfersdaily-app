'use client';

import { AdSenseAd } from './AdSenseAd';
import { AD_SLOTS, isAdSlotEnabled } from '@/lib/ads';

interface RectangleAdProps {
  position: 'after-latest' | 'after-leagues' | 'after-newsletter' | 'after-content' | 'after-header' | 'before-pagination' | 'sidebar-top' | 'sidebar-middle' | 'sidebar-bottom' | 'sidebar-bottom-1' | 'sidebar-bottom-2';
  className?: string;
}

export function RectangleAd({ position, className = '' }: RectangleAdProps) {
  const slotKeyMap = {
    'after-latest': 'RECTANGLE_AFTER_LATEST',
    'after-leagues': 'RECTANGLE_AFTER_LEAGUES', 
    'after-newsletter': 'RECTANGLE_AFTER_NEWSLETTER',
    'after-content': 'RECTANGLE_AFTER_CONTENT',
    'after-header': 'RECTANGLE_AFTER_HEADER',
    'before-pagination': 'RECTANGLE_BEFORE_PAGINATION',
    'sidebar-top': 'SIDEBAR_TOP',
    'sidebar-middle': 'SIDEBAR_MIDDLE',
    'sidebar-bottom': 'SIDEBAR_BOTTOM',
    'sidebar-bottom-1': 'SIDEBAR_BOTTOM_1',
    'sidebar-bottom-2': 'SIDEBAR_BOTTOM_2'
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
