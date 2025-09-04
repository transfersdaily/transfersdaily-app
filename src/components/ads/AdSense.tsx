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
    if (!isClient || !adRef.current) return;

    const checkWidth = () => {
      const width = adRef.current?.offsetWidth || 0;
      if (width > 0) {
        setTimeout(() => {
          try {
            if (typeof window !== 'undefined' && window.adsbygoogle) {
              window.adsbygoogle.push({});
              
              // Check if ad actually loaded after 2 seconds
              setTimeout(() => {
                const adElement = adRef.current?.querySelector('.adsbygoogle');
                if (adElement && adElement.getAttribute('data-adsbygoogle-status') === 'done') {
                  const hasContent = adElement.innerHTML.trim() !== '';
                  setAdLoaded(hasContent);
                }
              }, 2000);
            }
          } catch (error) {
            console.error('AdSense error:', error);
          }
        }, 100);
      }
    };

    checkWidth();
    const timer = setTimeout(checkWidth, 500);

    return () => clearTimeout(timer);
  }, [isClient]);

  if (!isClient) {
    return null; // No space during SSR
  }

  return (
    <div 
      ref={adRef} 
      className={`adsense-container ${className}`} 
      style={adLoaded ? { minHeight: '250px', width: '100%', ...style } : { display: 'none' }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
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
