// Ad configuration and management system
export interface AdSlot {
  id: string;
  slotId: string;
  sizes: {
    desktop: [number, number][];
    mobile: [number, number][];
  };
  format: 'display' | 'native' | 'sticky';
  position: string;
  enabled: boolean;
}

// Ad slots configuration - Update slotId when you get them from Google
export const AD_SLOTS: Record<string, AdSlot> = {
  // High-value positions
  LEADERBOARD_TOP: {
    id: 'leaderboard-top',
    slotId: 'YOUR_SLOT_ID_HERE', // Replace when approved
    sizes: {
      desktop: [[728, 90], [970, 250]],
      mobile: [[320, 50], [300, 50]]
    },
    format: 'display',
    position: 'after-hero',
    enabled: true // ✅ ENABLED
  },

  LEADERBOARD_BELOW_NAVBAR: {
    id: 'leaderboard-below-navbar',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[728, 90], [970, 250], [970, 90]],
      mobile: [[320, 50], [300, 50]]
    },
    format: 'display',
    position: 'below-navbar',
    enabled: true // ✅ ENABLED
  },
  
  RECTANGLE_AFTER_LATEST: {
    id: 'rectangle-after-latest',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250], [336, 280]],
      mobile: [[300, 250], [320, 50]]
    },
    format: 'display',
    position: 'after-latest-transfers',
    enabled: true // ✅ ENABLED
  },

  NATIVE_IN_LATEST: {
    id: 'native-in-latest',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250]],
      mobile: [[300, 250]]
    },
    format: 'native',
    position: 'in-latest-grid',
    enabled: false
  },

  RECTANGLE_AFTER_LEAGUES: {
    id: 'rectangle-after-leagues',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250]],
      mobile: [[300, 250]]
    },
    format: 'display',
    position: 'after-browse-leagues',
    enabled: false
  },

  SIDEBAR_TOP: {
    id: 'sidebar-top',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250], [300, 600]],
      mobile: [[300, 250]]
    },
    format: 'display',
    position: 'sidebar-top',
    enabled: true // ✅ ENABLED
  },

  SIDEBAR_MIDDLE: {
    id: 'sidebar-middle',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250]],
      mobile: [[300, 250]]
    },
    format: 'display',
    position: 'sidebar-middle',
    enabled: true // ✅ ENABLED
  },

  SIDEBAR_BOTTOM: {
    id: 'sidebar-bottom',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250], [336, 280]],
      mobile: [] // Hidden on mobile (sidebar not shown)
    },
    format: 'display',
    position: 'sidebar-bottom',
    enabled: false
  },

  SIDEBAR_BOTTOM_1: {
    id: 'sidebar-bottom-1',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250], [336, 280]],
      mobile: [] // Hidden on mobile
    },
    format: 'display',
    position: 'sidebar-bottom-1',
    enabled: false
  },

  SIDEBAR_BOTTOM_2: {
    id: 'sidebar-bottom-2',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250], [336, 280]],
      mobile: [] // Hidden on mobile
    },
    format: 'display',
    position: 'sidebar-bottom-2',
    enabled: false
  },

  NATIVE_IN_TRENDING: {
    id: 'native-in-trending',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250]],
      mobile: [[300, 250]]
    },
    format: 'native',
    position: 'in-trending-grid',
    enabled: false
  },

  BANNER_BEFORE_NEWSLETTER: {
    id: 'banner-before-newsletter',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[728, 90], [970, 250]],
      mobile: [[320, 50], [300, 50]]
    },
    format: 'display',
    position: 'before-newsletter',
    enabled: false
  },

  RECTANGLE_AFTER_NEWSLETTER: {
    id: 'rectangle-after-newsletter',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250]],
      mobile: [[300, 250]]
    },
    format: 'display',
    position: 'after-newsletter',
    enabled: false
  },

  RECTANGLE_AFTER_CONTENT: {
    id: 'rectangle-after-content',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250], [336, 280]],
      mobile: [[300, 250]]
    },
    format: 'display',
    position: 'after-content',
    enabled: false
  },

  STICKY_BOTTOM_MOBILE: {
    id: 'sticky-bottom-mobile',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [],
      mobile: [[320, 50], [300, 50]]
    },
    format: 'sticky',
    position: 'bottom-sticky',
    enabled: true // ✅ ENABLED
  },

  // Additional high-value ad slots
  LEADERBOARD_MID_CONTENT: {
    id: 'leaderboard-mid-content',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[728, 90], [970, 250]],
      mobile: [[320, 50], [300, 50]]
    },
    format: 'display',
    position: 'mid-content',
    enabled: false
  },

  RECTANGLE_BEFORE_PAGINATION: {
    id: 'rectangle-before-pagination',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250], [336, 280]],
      mobile: [[300, 250]]
    },
    format: 'display',
    position: 'before-pagination',
    enabled: false
  },

  NATIVE_IN_SEARCH_RESULTS: {
    id: 'native-in-search-results',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250]],
      mobile: [[300, 250]]
    },
    format: 'native',
    position: 'in-search-results',
    enabled: false
  },

  RECTANGLE_AFTER_HEADER: {
    id: 'rectangle-after-header',
    slotId: 'YOUR_SLOT_ID_HERE',
    sizes: {
      desktop: [[300, 250], [336, 280]],
      mobile: [[300, 250]]
    },
    format: 'display',
    position: 'after-header',
    enabled: false
  }
};

// Global ad settings
export const AD_CONFIG = {
  publisherId: 'ca-pub-6269937543968234',
  testMode: process.env.NODE_ENV === 'development',
  autoAdsEnabled: false, // Disable auto ads when using manual
  adBlockDetection: true,
  lazyLoading: true,
  refreshInterval: 30000, // 30 seconds for refresh
};

// Check if ads are globally enabled (for review period)
export const areAdsEnabled = (): boolean => {
  // You can control this via environment variable
  return process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
};

// Get enabled ad slots only
export const getEnabledAdSlots = (): AdSlot[] => {
  if (!areAdsEnabled()) return [];
  
  return Object.values(AD_SLOTS).filter(slot => slot.enabled);
};

// Check if specific ad slot is enabled
export const isAdSlotEnabled = (slotKey: string): boolean => {
  if (!areAdsEnabled()) return false;
  
  const slot = AD_SLOTS[slotKey];
  return slot ? slot.enabled : false;
};

// Get responsive ad sizes based on device
export const getResponsiveAdSizes = (slot: AdSlot, isMobile: boolean): [number, number][] => {
  return isMobile ? slot.sizes.mobile : slot.sizes.desktop;
};
