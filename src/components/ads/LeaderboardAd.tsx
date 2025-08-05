'use client';

import { AdSenseAd } from './AdSenseAd';
import { AD_SLOTS, isAdSlotEnabled } from '@/lib/ads';

interface LeaderboardAdProps {
  position: 'top' | 'before-newsletter';
  className?: string;
}

export function LeaderboardAd({ position, className = '' }: LeaderboardAdProps) {
  const slotKey = position === 'top' ? 'LEADERBOARD_TOP' : 'BANNER_BEFORE_NEWSLETTER';
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
