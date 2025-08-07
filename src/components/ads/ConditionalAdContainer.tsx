'use client';

import { isAdSlotEnabled } from '@/lib/ads';
import { ReactNode } from 'react';

interface ConditionalAdContainerProps {
  position: string;
  children: ReactNode;
}

export function ConditionalAdContainer({ position, children }: ConditionalAdContainerProps) {
  // Map position to slot key
  const slotKeyMap: Record<string, string> = {
    // Homepage ads
    'below-navbar': 'LEADERBOARD_BELOW_NAVBAR',
    'after-latest': 'RECTANGLE_AFTER_LATEST',
    'after-leagues': 'RECTANGLE_AFTER_LEAGUES',
    'before-newsletter': 'BANNER_BEFORE_NEWSLETTER',
    'after-newsletter': 'RECTANGLE_AFTER_NEWSLETTER',
    
    // Sidebar ads
    'sidebar-top': 'SIDEBAR_TOP',
    'sidebar-middle': 'SIDEBAR_MIDDLE',
    'sidebar-bottom': 'SIDEBAR_BOTTOM',
    'sidebar-bottom-1': 'SIDEBAR_BOTTOM_1',
    'sidebar-bottom-2': 'SIDEBAR_BOTTOM_2',
    
    // Page ads
    'after-header': 'RECTANGLE_AFTER_HEADER',
    'mid-content': 'LEADERBOARD_MID_CONTENT',
    'before-pagination': 'RECTANGLE_BEFORE_PAGINATION',
    'after-content': 'RECTANGLE_AFTER_CONTENT',
    
    // Other positions
    'top': 'LEADERBOARD_TOP'
  };

  const slotKey = slotKeyMap[position];
  
  // Only render container if the ad slot is enabled
  if (!slotKey || !isAdSlotEnabled(slotKey)) {
    return null;
  }

  return <>{children}</>;
}
