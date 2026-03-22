'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { AdSense } from './AdSense';
import { getSlotConfig, AD_CONFIG } from '@/lib/ads';
import type { SlotConfig } from '@/lib/ads';

interface AdSlotProps {
  placement: string;       // e.g. "homepage.sidebar-top" — maps to AD_SLOTS config
  lazy?: boolean;          // override config default
  sticky?: boolean;        // for mobile sticky behavior
  className?: string;      // additional classes
}

export function AdSlot({ placement, lazy, sticky, className }: AdSlotProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adEmpty, setAdEmpty] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);

  // Config lookup (must be before hooks that depend on it, but after all hook declarations)
  const config = getSlotConfig(placement);

  // Determine lazy behavior: prop > config > global fallback
  const shouldLazy = lazy !== undefined ? lazy : (config?.lazy ?? AD_CONFIG.LAZY_LOAD);

  // AdFreeZone logic inlined — no ads on admin/login/debug paths
  const isAdFree = pathname?.includes('/admin') ||
                   pathname?.includes('/login') ||
                   pathname?.includes('/debug');

  // Mobile detection for sticky mode
  useEffect(() => {
    if (!sticky) return;
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [sticky]);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (!shouldLazy) {
      setIsVisible(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLazy]);

  // Monitor ad fill status via MutationObserver + timeout fallback for adblockers
  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const checkAdStatus = () => {
      const ins = containerRef.current?.querySelector('ins.adsbygoogle');
      if (!ins) {
        // No ins element at all — likely adblocker prevented it
        setAdEmpty(true);
        return;
      }
      const status = ins.getAttribute('data-ad-status');
      if (status === 'filled' || (ins as HTMLElement).offsetHeight > 0) {
        setAdLoaded(true);
        setAdEmpty(false);
      } else if (status === 'unfilled') {
        setAdEmpty(true);
      }
    };

    // Quick check after 1.5s for fast ad loads
    const quickTimer = setTimeout(checkAdStatus, 1500);

    // Fallback: if ad still hasn't loaded after 4s, collapse
    const fallbackTimer = setTimeout(() => {
      if (!adLoaded) {
        const ins = containerRef.current?.querySelector('ins.adsbygoogle');
        if (!ins || (ins as HTMLElement).offsetHeight === 0) {
          setAdEmpty(true);
        }
      }
    }, 4000);

    const ins = containerRef.current?.querySelector('ins.adsbygoogle');
    let observer: MutationObserver | null = null;
    if (ins) {
      observer = new MutationObserver(checkAdStatus);
      observer.observe(ins, { attributes: true, childList: true, subtree: true });
    }

    return () => {
      clearTimeout(quickTimer);
      clearTimeout(fallbackTimer);
      observer?.disconnect();
    };
  }, [isVisible, adLoaded]);

  // Early returns after all hooks
  if (isAdFree) return null;
  if (!config) return null;

  // Render AdSense with config
  const renderAd = (slotConfig: SlotConfig) => (
    <AdSense
      adSlot={slotConfig.slotId}
      adFormat={slotConfig.format === 'fluid' ? 'auto' : slotConfig.format}
      adLayout={slotConfig.layout}
      adLayoutKey={slotConfig.layoutKey}
      style={{ minHeight: slotConfig.minHeight + 'px', width: '100%' }}
    />
  );

  // Sticky mode: only show on mobile, respect dismiss
  if (sticky) {
    if (!isMobile || stickyDismissed) return null;

    return (
      <div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg"
      >
        <div className="relative">
          <button
            onClick={() => setStickyDismissed(true)}
            className="absolute top-1 right-1 z-10 p-1 bg-background/80 rounded-full"
            aria-label="Close ad"
          >
            <X className="h-3 w-3" />
          </button>
          {isVisible && renderAd(config)}
        </div>
      </div>
    );
  }

  // Standard ad slot with CLS reservation, skeleton, and collapse-on-empty
  return (
    <div
      ref={containerRef}
      className={`w-full transition-all duration-300 ${className ?? ''}`}
      style={{
        minHeight: adEmpty ? 0 : config.minHeight + 'px',
        overflow: adEmpty ? 'hidden' : undefined,
        maxHeight: adEmpty ? 0 : undefined,
      }}
    >
      {/* Skeleton placeholder while loading */}
      {!adLoaded && !adEmpty && (
        <div
          className="bg-muted/30 animate-pulse rounded"
          style={{ minHeight: config.minHeight + 'px', width: '100%' }}
        />
      )}

      {/* Render AdSense when visible (or immediately if not lazy) */}
      {isVisible && renderAd(config)}
    </div>
  );
}
