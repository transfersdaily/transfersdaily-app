'use client';

import { AdSenseAd } from './AdSenseAd';
import { AD_SLOTS, isAdSlotEnabled } from '@/lib/ads';
import { Card, CardContent } from '@/components/ui/card';

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
    // Return a placeholder that matches TransferCard structure for consistent grid
    return (
      <Card className="h-full flex flex-col bg-muted/10 border-dashed">
        <div className="aspect-[16/10] bg-muted/20 flex items-center justify-center">
          <span className="text-muted-foreground text-xs">Ad Space</span>
        </div>
        <CardContent className="flex-grow flex items-center justify-center p-4">
          <span className="text-muted-foreground text-xs">Advertisement</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-full flex flex-col overflow-hidden ${className}`}>
      {/* Ad image area matching TransferCard aspect ratio */}
      <div className="aspect-[16/10] bg-muted/20 relative overflow-hidden flex-shrink-0">
        <AdSenseAd 
          slot={slot}
          className="native-ad w-full h-full"
          style={{
            borderRadius: '0',
            overflow: 'hidden',
            width: '100%',
            height: '100%'
          }}
        />
      </div>
      
      {/* Ad content area matching TransferCard structure */}
      <CardContent className="flex-grow flex flex-col justify-center p-4 text-center">
        <div className="text-xs text-muted-foreground mb-1">Advertisement</div>
        <div className="text-sm font-medium text-foreground">Sponsored Content</div>
      </CardContent>
    </Card>
  );
}
