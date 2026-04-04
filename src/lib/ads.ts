// Ad slot configuration for different page types and positions

export interface SlotConfig {
  slotId: string;
  minHeight: number; // CLS reservation in px
  lazy: boolean; // true = IntersectionObserver, false = load immediately
  format: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  layout?: string; // for fluid/in-article ads
  layoutKey?: string; // for fluid/in-feed ads
}

// Ad unit IDs from AdSense account
const UNITS = {
  HEADER:      '9393673972', // Homepage Header — display, above fold
  CONTENT:     '5167488500', // Homepage Content — display, general content areas
  IN_FEED:     '3976576205', // Article List Feed — in-feed, blends with card grids
  SIDEBAR:     '6321073481', // Sidebar — display, desktop only
  BOTTOM:      '9448394733', // Article Bottom — display, after content
  IN_ARTICLE:  '3074558076', // Article Content — in-article, between paragraphs
  STICKY:      '9228902885', // Mobile Sticky — display, anchored bottom
} as const;

export const AD_SLOTS = {
  // Homepage: header + post-hero + in-grid + mid-leagues + sidebar + mobile sticky = 6
  HOMEPAGE: {
    HEADER:        { slotId: UNITS.HEADER,     minHeight: 90,  lazy: false, format: 'auto' } as SlotConfig,
    POST_HERO:     { slotId: UNITS.CONTENT,    minHeight: 250, lazy: true,  format: 'auto' } as SlotConfig,
    IN_LATEST_GRID:{ slotId: UNITS.IN_FEED,    minHeight: 250, lazy: true,  format: 'fluid', layoutKey: '-6l+ck+46-u-1' } as SlotConfig,
    POST_LEAGUE:   { slotId: UNITS.CONTENT,    minHeight: 250, lazy: true,  format: 'auto' } as SlotConfig,
    SIDEBAR_TOP:   { slotId: UNITS.SIDEBAR,    minHeight: 250, lazy: false, format: 'auto' } as SlotConfig,
    SIDEBAR_MIDDLE_1: { slotId: UNITS.SIDEBAR, minHeight: 250, lazy: true,  format: 'auto' } as SlotConfig,
    MOBILE_STICKY: { slotId: UNITS.STICKY,     minHeight: 50,  lazy: true,  format: 'auto' } as SlotConfig,
  },

  // Article: in-body x2 + after-article + sidebar + mobile sticky = 5
  ARTICLE: {
    PARAGRAPH_1:   { slotId: UNITS.IN_ARTICLE, minHeight: 250, lazy: true,  format: 'fluid', layout: 'in-article' } as SlotConfig,
    PARAGRAPH_3:   { slotId: UNITS.IN_ARTICLE, minHeight: 250, lazy: true,  format: 'fluid', layout: 'in-article' } as SlotConfig,
    AFTER_ARTICLE: { slotId: UNITS.BOTTOM,     minHeight: 250, lazy: true,  format: 'auto' } as SlotConfig,
    SIDEBAR_TOP:   { slotId: UNITS.SIDEBAR,    minHeight: 250, lazy: false, format: 'auto' } as SlotConfig,
    MOBILE_STICKY: { slotId: UNITS.STICKY,     minHeight: 50,  lazy: true,  format: 'auto' } as SlotConfig,
  },

  // League/Latest: in-feed after grid + sidebar + mobile sticky = 3
  LEAGUE: {
    IN_TRANSFERS:  { slotId: UNITS.IN_FEED,    minHeight: 250, lazy: true,  format: 'fluid', layoutKey: '-6l+ck+46-u-1' } as SlotConfig,
    SIDEBAR_TOP:   { slotId: UNITS.SIDEBAR,    minHeight: 250, lazy: false, format: 'auto' } as SlotConfig,
    MOBILE_STICKY: { slotId: UNITS.STICKY,     minHeight: 50,  lazy: true,  format: 'auto' } as SlotConfig,
  },

  // Search: sidebar + mobile sticky = 2
  SEARCH: {
    SIDEBAR_TOP:   { slotId: UNITS.SIDEBAR,    minHeight: 250, lazy: false, format: 'auto' } as SlotConfig,
    MOBILE_STICKY: { slotId: UNITS.STICKY,     minHeight: 50,  lazy: true,  format: 'auto' } as SlotConfig,
  },
};

/**
 * Get slot config by placement string (e.g. "homepage.sidebar-top")
 */
export function getSlotConfig(placement: string): SlotConfig | null {
  const [page, position] = placement.split('.');
  if (!page || !position) return null;
  const pageKey = page.toUpperCase() as keyof typeof AD_SLOTS;
  const posKey = position.toUpperCase().replace(/-/g, '_');
  const pageSlots = AD_SLOTS[pageKey];
  if (!pageSlots) return null;
  return (pageSlots as Record<string, SlotConfig>)[posKey] || null;
}

/**
 * Helper function to get ad slot ID by page and position (backward compatible)
 */
export function getAdSlot(page: keyof typeof AD_SLOTS, position: string): string {
  const pageSlots = AD_SLOTS[page] as Record<string, SlotConfig>;
  const config = pageSlots[position];
  return config?.slotId || '5167488500'; // fallback to Homepage Content
}

// Ad configuration
export const AD_CONFIG = {
  CLIENT_ID: 'ca-pub-6269937543968234',
  LAZY_LOAD: true,
  REFRESH_RATE: 30000, // 30 seconds
  MAX_ADS_PER_PAGE: 15,
} as const;
