'use client';

import { AdSenseAd } from './AdSenseAd';
import { AD_SLOTS, isAdSlotEnabled } from '@/lib/ads';

interface LeaderboardAdProps {
  position: 'top' | 'before-newsletter' | 'mid-content' | 'below-navbar';
  className?: string;
}

export function LeaderboardAd({ position, className = '' }: LeaderboardAdProps) {
  const slotKeyMap = {
    'top': 'LEADERBOARD_TOP',
    'before-newsletter': 'BANNER_BEFORE_NEWSLETTER',
    'mid-content': 'LEADERBOARD_MID_CONTENT',
    'below-navbar': 'LEADERBOARD_BELOW_NAVBAR'
  };
  
  const slotKey = slotKeyMap[position];
  const slot = AD_SLOTS[slotKey];

  if (!isAdSlotEnabled(slotKey)) {
    return null;
  }

  return (
    <div className={`w-full flex justify-center my-6 ${className}`}>
      <AdSenseAd 
        slot={slot}
        className="leaderboard-ad"
      />
    </div>
  );
}
