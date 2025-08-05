'use client';

import { useEffect, useRef, useState } from 'react';
import { AD_CONFIG, type AdSlot, getResponsiveAdSizes } from '@/lib/ads';

interface AdSenseAdProps {
  slot: AdSlot;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSenseAd({ slot, className = '', style = {} }: AdSenseAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load AdSense script and initialize ad
  useEffect(() => {
    if (!slot.enabled || adLoaded) return;

    const loadAd = async () => {
      try {
        // Ensure AdSense script is loaded
        if (!window.adsbygoogle) {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
          
          // Wait for script to load
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        // Initialize adsbygoogle array if not exists
        window.adsbygoogle = window.adsbygoogle || [];

        // Push ad configuration
        try {
          window.adsbygoogle.push({});
          setAdLoaded(true);
        } catch (error) {
          console.error('AdSense push error:', error);
          setAdError(true);
        }
      } catch (error) {
        console.error('AdSense loading error:', error);
        setAdError(true);
      }
    };

    // Use intersection observer for lazy loading
    if (AD_CONFIG.lazyLoading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadAd();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      if (adRef.current) {
        observer.observe(adRef.current);
      }

      return () => observer.disconnect();
    } else {
      loadAd();
    }
  }, [slot.enabled, adLoaded]);

  // Don't render if slot is not enabled or has error
  if (!slot.enabled || adError) {
    return null;
  }

  // Get appropriate sizes for current device
  const adSizes = getResponsiveAdSizes(slot, isMobile);
  
  // Don't render if no sizes available for current device
  if (adSizes.length === 0) {
    return null;
  }

  // Format sizes for AdSense
  const formattedSizes = adSizes.map(size => size.join('x')).join(',');
  const primarySize = adSizes[0];

  return (
    <div 
      ref={adRef}
      className={`ad-container ${className}`}
      style={{
        minHeight: primarySize[1],
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style
      }}
      data-ad-slot={slot.id}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: primarySize[0],
          height: primarySize[1],
          ...style
        }}
        data-ad-client={AD_CONFIG.publisherId}
        data-ad-slot={slot.slotId}
        data-ad-format={slot.format === 'native' ? 'fluid' : 'auto'}
        data-full-width-responsive={slot.format !== 'sticky' ? 'true' : 'false'}
        {...(adSizes.length > 1 && {
          'data-ad-sizes': formattedSizes
        })}
      />
      
      {/* Loading placeholder */}
      {!adLoaded && (
        <div 
          className="ad-placeholder bg-muted/20 border border-dashed border-muted-foreground/20 rounded flex items-center justify-center text-muted-foreground text-sm"
          style={{
            width: primarySize[0],
            height: primarySize[1]
          }}
        >
          {AD_CONFIG.testMode ? `Ad: ${slot.id}` : ''}
        </div>
      )}
    </div>
  );
}
