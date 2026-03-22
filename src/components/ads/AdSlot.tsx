'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { AdSense } from './AdSense';
import { getSlotConfig, AD_CONFIG } from '@/lib/ads';
import type { SlotConfig } from '@/lib/ads';

interface AdSlotProps {
  placement: string;
  lazy?: boolean;
  sticky?: boolean;
  className?: string;
}

export function AdSlot({ placement, lazy, sticky, className }: AdSlotProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adFilled, setAdFilled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);

  const config = getSlotConfig(placement);
  const shouldLazy = lazy !== undefined ? lazy : (config?.lazy ?? AD_CONFIG.LAZY_LOAD);

  const isAdFree = pathname?.includes('/admin') ||
                   pathname?.includes('/login') ||
                   pathname?.includes('/debug');

  useEffect(() => {
    if (!sticky) return;
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [sticky]);

  useEffect(() => {
    if (!shouldLazy) { setIsVisible(true); return; }
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { rootMargin: '200px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [shouldLazy]);

  // Repeatedly check if the ad filled — collapse if not
  useEffect(() => {
    if (!isVisible || collapsed || adFilled) return;

    const check = () => {
      const container = containerRef.current;
      if (!container) return;

      const ins = container.querySelector('ins.adsbygoogle');
      if (!ins) { setCollapsed(true); return; }

      const status = ins.getAttribute('data-ad-status');
      if (status === 'filled') {
        setAdFilled(true);
        return;
      }
      if (status === 'unfilled') {
        setCollapsed(true);
        return;
      }

      // Check if ins has actual rendered ad content (child iframes)
      const hasContent = ins.querySelector('iframe') !== null ||
                         (ins as HTMLElement).offsetHeight > 10;
      if (hasContent) {
        setAdFilled(true);
      }
    };

    // Check at 500ms, 1.5s, and 3s
    const t1 = setTimeout(check, 500);
    const t2 = setTimeout(check, 1500);
    const t3 = setTimeout(() => {
      // Final fallback — if still not filled, collapse
      if (!adFilled) setCollapsed(true);
    }, 3000);

    // Also listen for attribute changes
    const ins = containerRef.current?.querySelector('ins.adsbygoogle');
    let obs: MutationObserver | null = null;
    if (ins) {
      obs = new MutationObserver(check);
      obs.observe(ins, { attributes: true, childList: true, subtree: true });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      obs?.disconnect();
    };
  }, [isVisible, collapsed, adFilled]);

  if (isAdFree) return null;
  if (!config) return null;
  if (collapsed) return null;

  if (sticky) {
    if (!isMobile || stickyDismissed) return null;
    return (
      <div ref={containerRef} className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
        <div className="relative">
          <button onClick={() => setStickyDismissed(true)} className="absolute top-1 right-1 z-10 p-1 bg-background/80 rounded-full" aria-label="Close ad">
            <X className="h-3 w-3" />
          </button>
          {isVisible && (
            <AdSense adSlot={config.slotId} adFormat={config.format === 'fluid' ? 'auto' : config.format} adLayout={config.layout} adLayoutKey={config.layoutKey} style={{ width: '100%' }} />
          )}
        </div>
      </div>
    );
  }

  // Hide the container visually while waiting for the ad to fill or collapse
  // This prevents white blocks from flashing during the 3s check window
  const hideUntilFilled = !adFilled ? { overflow: 'hidden' as const, height: 0 } : {};

  return (
    <div
      ref={containerRef}
      className={`w-full ${className ?? ''}`}
      style={hideUntilFilled}
    >
      {isVisible ? (
        <AdSense
          adSlot={config.slotId}
          adFormat={config.format === 'fluid' ? 'auto' : config.format}
          adLayout={config.layout}
          adLayoutKey={config.layoutKey}
          style={{ width: '100%' }}
        />
      ) : (
        <div style={{ height: 1 }} />
      )}
    </div>
  );
}
