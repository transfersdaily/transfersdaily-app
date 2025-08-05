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
    enabled: false // Set to true when approved
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
    enabled: false
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
    enabled: false
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
