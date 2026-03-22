'use client';

import { useEffect, useState } from 'react';

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

// Load the AdSense script once globally (no auto-ads)
let scriptLoaded = false;
function ensureAdSenseScript() {
  if (scriptLoaded || typeof window === 'undefined') return;
  if (document.querySelector('script[src*="adsbygoogle"]')) {
    scriptLoaded = true;
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6269937543968234';
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
  scriptLoaded = true;
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    ensureAdSenseScript();
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

  if (!isClient) return null;

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', width: '100%', background: 'transparent', ...style }}
      data-ad-client="ca-pub-6269937543968234"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-ad-layout={adLayout}
      data-ad-layout-key={adLayoutKey}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
}
