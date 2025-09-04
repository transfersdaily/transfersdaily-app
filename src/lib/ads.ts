// Ad slot configuration for different page types and positions
export const AD_SLOTS = {
  // Homepage slots
  HOMEPAGE: {
    HEADER: '1234567890',
    POST_HERO: '1234567891', 
    PRE_LATEST: '1234567892',
    IN_LATEST_GRID: '1234567893',
    POST_LATEST: '1234567894',
    POST_LEAGUE: '1234567895',
    PRE_COMPLETED: '1234567896',
    IN_COMPLETED_GRID: '1234567897',
    PRE_TRENDING: '1234567898',
    IN_TRENDING_GRID: '1234567899',
    PRE_NEWSLETTER: '1234567800',
    SIDEBAR_TOP: '1234567801',
    SIDEBAR_MIDDLE_1: '1234567802',
    SIDEBAR_MIDDLE_2: '1234567803',
    SIDEBAR_BOTTOM: '1234567804',
    MOBILE_STICKY: '1234567805'
  },
  
  // Article page slots
  ARTICLE: {
    HEADER: '2234567890',
    AFTER_TITLE: '2234567891',
    PARAGRAPH_1: '2234567892',
    PARAGRAPH_3: '2234567893', 
    PARAGRAPH_6: '2234567894',
    BEFORE_CONCLUSION: '2234567895',
    AFTER_ARTICLE: '2234567896',
    RELATED_ARTICLES: '2234567897',
    SIDEBAR_TOP: '2234567898',
    SIDEBAR_MIDDLE: '2234567899',
    SIDEBAR_BOTTOM: '2234567800',
    MOBILE_STICKY: '2234567801'
  },

  // League page slots
  LEAGUE: {
    HEADER: '3234567890',
    AFTER_HERO: '3234567891',
    IN_TRANSFERS: '3234567892',
    SIDEBAR_TOP: '3234567893',
    SIDEBAR_MIDDLE: '3234567894',
    SIDEBAR_BOTTOM: '3234567895',
    MOBILE_STICKY: '3234567896'
  },

  // Search page slots
  SEARCH: {
    HEADER: '4234567890',
    IN_RESULTS: '4234567891',
    SIDEBAR_TOP: '4234567892',
    SIDEBAR_BOTTOM: '4234567893',
    MOBILE_STICKY: '4234567894'
  }
} as const;

// Helper function to get ad slot by page and position
export function getAdSlot(page: keyof typeof AD_SLOTS, position: string): string {
  const pageSlots = AD_SLOTS[page] as Record<string, string>;
  return pageSlots[position] || '1234567890'; // fallback slot
}

// Ad configuration
export const AD_CONFIG = {
  CLIENT_ID: 'ca-pub-6269937543968234',
  LAZY_LOAD: true,
  REFRESH_RATE: 30000, // 30 seconds
  MAX_ADS_PER_PAGE: 15
} as const;
