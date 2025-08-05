// Mobile-specific ad configuration
// TOGGLE: Choose your mobile ad strategy

export const MOBILE_AD_STRATEGY = {
  // 🎯 TOGGLE THIS: Choose mobile ad strategy
  USE_AUTO_ADS_ON_MOBILE: false, // Set to true for Google's 4 auto ads
  
  // Option 1: Manual mobile ads (6-8 ads) - Full control
  MANUAL_MOBILE_ADS: {
    TOP_FLOATING: { enabled: true, size: [320, 50] },
    AFTER_HEADER: { enabled: true, size: [300, 250] },
    IN_FEED_NATIVE: { enabled: true, type: 'native' },
    MID_CONTENT: { enabled: true, size: [300, 250] },
    BEFORE_FOOTER: { enabled: true, size: [300, 250] },
    BOTTOM_FLOATING: { enabled: true, size: [320, 50], closeable: true }
  },
  
  // Option 2: Google Auto Ads (4 ads) - Google optimizes
  AUTO_ADS_CONFIG: {
    maxAds: 4,
    types: ['anchor', 'display', 'in-feed', 'vignette'],
    // Google automatically finds best positions
    // Higher RPM but less control
  }
};

// 💰 Revenue Comparison:
// Manual: 6-8 ads, full control, predictable placement
// Auto: 4 ads, Google optimized, potentially higher RPM
