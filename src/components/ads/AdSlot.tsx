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

  // AdFreeZone logic — no ads on admin/login/debug
  const isAdFree = pathname?.includes('/admin') ||
                   pathname?.includes('/login') ||
                   pathname?.includes('/debug');

  // Mobile detection for sticky
  useEffect(() => {
    if (!sticky) return;
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [sticky]);

  // Lazy loading via IntersectionObserver
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

  // Check if ad actually filled — collapse if not
  const checkFill = useCallback(() => {
    const ins = containerRef.current?.querySelector('ins.adsbygoogle');
    if (!ins) { setCollapsed(true); return; }
    const status = ins.getAttribute('data-ad-status');
    if (status === 'filled') {
      setAdFilled(true);
    } else if (status === 'unfilled') {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Check quickly, then again as fallback
    const t1 = setTimeout(checkFill, 1500);
    const t2 = setTimeout(() => {
      // If still not filled after 3s, collapse
      if (!containerRef.current?.querySelector('ins.adsbygoogle[data-ad-status="filled"]')) {
        setCollapsed(true);
      }
    }, 3000);

    // Also watch for attribute changes
    const ins = containerRef.current?.querySelector('ins.adsbygoogle');
    let obs: MutationObserver | null = null;
    if (ins) {
      obs = new MutationObserver(checkFill);
      obs.observe(ins, { attributes: true, childList: true, subtree: true });
    }

    return () => { clearTimeout(t1); clearTimeout(t2); obs?.disconnect(); };
  }, [isVisible, checkFill]);

  // Early returns
  if (isAdFree) return null;
  if (!config) return null;
  if (collapsed) return null;

  // Sticky mode
  if (sticky) {
    if (!isMobile || stickyDismissed) return null;
    return (
      <div ref={containerRef} className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
        <div className="relative">
          <button onClick={() => setStickyDismissed(true)} className="absolute top-1 right-1 z-10 p-1 bg-background/80 rounded-full" aria-label="Close ad">
            <X className="h-3 w-3" />
          </button>
          {isVisible && (
            <AdSense
              adSlot={config.slotId}
              adFormat={config.format === 'fluid' ? 'auto' : config.format}
              adLayout={config.layout}
              adLayoutKey={config.layoutKey}
              style={{ width: '100%' }}
            />
          )}
        </div>
      </div>
    );
  }

  // Standard slot — only show AdSense, no skeleton (avoids white block issue)
  // Container collapses to null when ad doesn't fill
  return (
    <div
      ref={containerRef}
      className={`w-full ${className ?? ''}`}
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
        // Minimal placeholder for IntersectionObserver to target (no visible height)
        <div style={{ height: 1 }} />
      )}
    </div>
  );
}
