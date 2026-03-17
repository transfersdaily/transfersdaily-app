'use client';

import { useEffect, useRef, useState } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
  fullWidthResponsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSense({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  style = {},
  className = '',
  fullWidthResponsive = true,
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [isClient]);

  // Detect if ad actually rendered content (collapse if empty)
  useEffect(() => {
    if (!isClient || !adRef.current) return;

    const checkAdLoaded = () => {
      const ins = adRef.current?.querySelector('ins.adsbygoogle');
      if (ins) {
        const hasContent = ins.getAttribute('data-ad-status') === 'filled' ||
          (ins as HTMLElement).offsetHeight > 0;
        setAdLoaded(hasContent);
      }
    };

    // Check after AdSense has time to fill the slot
    const timer = setTimeout(checkAdLoaded, 2000);

    // Also observe for attribute changes on the ins element
    const ins = adRef.current?.querySelector('ins.adsbygoogle');
    let observer: MutationObserver | null = null;
    if (ins) {
      observer = new MutationObserver(() => {
        checkAdLoaded();
      });
      observer.observe(ins, { attributes: true, childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [isClient]);

  if (!isClient) {
    // Return empty collapsed container during SSR
    return null;
  }

  // Strip minHeight from style to prevent empty space reservation
  const { minHeight, ...safeStyle } = style as Record<string, any>;

  return (
    <div
      ref={adRef}
      className={`adsense-container ${className}`}
      style={{
        ...safeStyle,
        // Collapse when no ad has loaded
        ...(adLoaded ? {} : { overflow: 'hidden', maxHeight: 0 }),
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6269937543968234"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}
