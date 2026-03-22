// Ad slot configuration for different page types and positions

export interface SlotConfig {
  slotId: string;
  minHeight: number; // CLS reservation in px
  lazy: boolean; // true = IntersectionObserver, false = load immediately
  format: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  layout?: string; // for fluid/in-article ads
  layoutKey?: string; // for fluid/in-feed ads
}

export const AD_SLOTS = {
  // Homepage slots
  HOMEPAGE: {
    HEADER: { slotId: '9393673972', minHeight: 90, lazy: false, format: 'auto' } as SlotConfig,
    POST_HERO: { slotId: '5167488500', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    PRE_LATEST: { slotId: '1234567892', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    IN_LATEST_GRID: { slotId: '3976576205', minHeight: 250, lazy: true, format: 'fluid', layoutKey: '-6l+ck+46-u-1' } as SlotConfig,
    POST_LATEST: { slotId: '1234567894', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    POST_LEAGUE: { slotId: '1234567895', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    PRE_COMPLETED: { slotId: '1234567896', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    IN_COMPLETED_GRID: { slotId: '1234567897', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    PRE_TRENDING: { slotId: '1234567898', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    IN_TRENDING_GRID: { slotId: '1234567899', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    PRE_NEWSLETTER: { slotId: '1234567800', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    SIDEBAR_TOP: { slotId: '6321073481', minHeight: 250, lazy: false, format: 'auto' } as SlotConfig,
    SIDEBAR_MIDDLE_1: { slotId: '9448394733', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    SIDEBAR_MIDDLE_2: { slotId: '1234567803', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    SIDEBAR_BOTTOM: { slotId: '1234567804', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    MOBILE_STICKY: { slotId: '9228902885', minHeight: 50, lazy: true, format: 'auto' } as SlotConfig,
  },

  // Article page slots
  ARTICLE: {
    HEADER: { slotId: '2234567890', minHeight: 90, lazy: false, format: 'auto' } as SlotConfig,
    AFTER_TITLE: { slotId: '2234567891', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    PARAGRAPH_1: { slotId: '3074558076', minHeight: 250, lazy: true, format: 'fluid', layout: 'in-article' } as SlotConfig,
    PARAGRAPH_3: { slotId: '2234567893', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    PARAGRAPH_6: { slotId: '2234567894', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    BEFORE_CONCLUSION: { slotId: '2234567895', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    AFTER_ARTICLE: { slotId: '9448394733', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    RELATED_ARTICLES: { slotId: '2234567897', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    SIDEBAR_TOP: { slotId: '2234567898', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    SIDEBAR_MIDDLE: { slotId: '2234567899', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    SIDEBAR_BOTTOM: { slotId: '2234567800', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    MOBILE_STICKY: { slotId: '2234567801', minHeight: 50, lazy: true, format: 'auto' } as SlotConfig,
  },

  // League page slots
  LEAGUE: {
    HEADER: { slotId: '3234567890', minHeight: 90, lazy: false, format: 'auto' } as SlotConfig,
    AFTER_HERO: { slotId: '3234567891', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    IN_TRANSFERS: { slotId: '3234567892', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    SIDEBAR_TOP: { slotId: '3234567893', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    SIDEBAR_MIDDLE: { slotId: '3234567894', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    SIDEBAR_BOTTOM: { slotId: '3234567895', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    MOBILE_STICKY: { slotId: '3234567896', minHeight: 50, lazy: true, format: 'auto' } as SlotConfig,
  },

  // Search page slots
  SEARCH: {
    HEADER: { slotId: '4234567890', minHeight: 90, lazy: false, format: 'auto' } as SlotConfig,
    IN_RESULTS: { slotId: '4234567891', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    SIDEBAR_TOP: { slotId: '4234567892', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    SIDEBAR_BOTTOM: { slotId: '4234567893', minHeight: 250, lazy: true, format: 'auto' } as SlotConfig,
    MOBILE_STICKY: { slotId: '4234567894', minHeight: 50, lazy: true, format: 'auto' } as SlotConfig,
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
  return config?.slotId || '1234567890'; // fallback slot
}

// Ad configuration
export const AD_CONFIG = {
  CLIENT_ID: 'ca-pub-6269937543968234',
  LAZY_LOAD: true,
  REFRESH_RATE: 30000, // 30 seconds
  MAX_ADS_PER_PAGE: 15,
} as const;
