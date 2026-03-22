'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Detects scroll direction with a threshold to avoid jitter.
 * Returns "up" or "down". Defaults to "up" (header visible).
 */
export function useScrollDirection(threshold = 10): 'up' | 'down' {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) >= threshold) {
        setScrollDirection(delta > 0 ? 'down' : 'up');
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrollDirection;
}
