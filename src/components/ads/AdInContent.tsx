'use client';

import { AdSense } from './AdSense';
import { AdFreeZone } from './AdFreeZone';

interface AdInContentProps {
  slot: string;
  className?: string;
  type?: 'feed' | 'article' | 'grid';
}

export function AdInContent({ slot, className = '', type = 'feed' }: AdInContentProps) {
  const typeStyles = {
    feed: 'my-6 p-4 bg-muted/30 rounded-lg border border-border/50',
    article: 'my-8 p-4 bg-card rounded-lg border border-border shadow-sm',
    grid: 'my-4 p-3 bg-muted/20 rounded-lg'
  };

  return (
    <AdFreeZone>
      <div className={`w-full flex justify-center ${typeStyles[type]} ${className}`}>
        <div className="text-xs text-muted-foreground mb-2 text-center">Advertisement</div>
        <AdSense
          adSlot={slot}
          adFormat="auto"
          style={{
            minHeight: '250px',
            width: '100%',
            maxWidth: '300px'
          }}
        />
      </div>
    </AdFreeZone>
  );
}
