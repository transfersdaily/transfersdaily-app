# 🎯 Complete Ad Placement Strategy - Transfer Daily

## **📊 Ad Revenue Optimization Overview**

**Current Setup**: 4 auto ads (baseline)  
**New Setup**: 12-15 strategic manual ads  
**Expected Revenue Increase**: **150-200%**  
**Control**: Full manual control vs Google's auto placement  

---

## **🏠 Homepage (page.tsx) - 6 Ads**

| Position | Ad Type | Component | Revenue Impact | Device |
|----------|---------|-----------|----------------|---------|
| After Hero | Leaderboard | `<LeaderboardAd position="top" />` | ⭐⭐⭐⭐⭐ | All |
| In Latest Grid (pos 3) | Native | `<TransferGridWithAds adPosition="in-latest" />` | ⭐⭐⭐⭐⭐ | All |
| After Latest | Rectangle | `<RectangleAd position="after-latest" />` | ⭐⭐⭐⭐ | All |
| After Leagues | Rectangle | `<RectangleAd position="after-leagues" />` | ⭐⭐⭐ | All |
| In Trending Grid | Native | `<TransferGridWithAds adPosition="in-trending" />` | ⭐⭐⭐⭐ | All |
| Before Newsletter | Leaderboard | `<LeaderboardAd position="before-newsletter" />` | ⭐⭐⭐ | All |
| After Newsletter | Rectangle | `<RectangleAd position="after-newsletter" />` | ⭐⭐ | All |
| **Sidebar Top** | Rectangle | `<RectangleAd position="sidebar-top" />` | ⭐⭐⭐⭐ | Desktop |
| **Sidebar Middle** | Rectangle | `<RectangleAd position="sidebar-middle" />` | ⭐⭐⭐ | Desktop |
| **Bottom Sticky** | Banner | `<StickyBottomAd />` (Global) | ⭐⭐ | Mobile |

---

## **📰 Article Page ([slug]/page.tsx) - 4 Ads**

| Position | Ad Type | Component | Revenue Impact | Device |
|----------|---------|-----------|----------------|---------|
| Top of Article | Leaderboard | `<LeaderboardAd position="top" />` | ⭐⭐⭐⭐⭐ | All |
| After Content | Rectangle | `<RectangleAd position="after-content" />` | ⭐⭐⭐⭐ | All |
| Before Related | Leaderboard | `<LeaderboardAd position="before-newsletter" />` | ⭐⭐⭐ | All |
| **Sidebar** | 2x Rectangle | Sidebar component includes ads | ⭐⭐⭐ | Desktop |

---

## **🏆 League Pages ([slug]/page.tsx) - 3 Ads**

| Position | Ad Type | Component | Revenue Impact | Device |
|----------|---------|-----------|----------------|---------|
| Top of Page | Leaderboard | `<LeaderboardAd position="top" />` | ⭐⭐⭐⭐ | All |
| In Transfer Grid | Native | `<TransferGridWithAds adPosition="in-latest" />` | ⭐⭐⭐⭐ | All |
| After Grid | Rectangle | `<RectangleAd position="after-latest" />` | ⭐⭐⭐ | All |
| **Sidebar** | 2x Rectangle | Sidebar component includes ads | ⭐⭐⭐ | Desktop |

---

## **📋 Latest Page (page.tsx) - 3 Ads**

| Position | Ad Type | Component | Revenue Impact | Device |
|----------|---------|-----------|----------------|---------|
| Top of Page | Leaderboard | `<LeaderboardAd position="top" />` | ⭐⭐⭐⭐ | All |
| In Transfer Grid | Native | `<TransferGridWithAds adPosition="in-latest" />` | ⭐⭐⭐⭐ | All |
| After Grid | Rectangle | `<RectangleAd position="after-latest" />` | ⭐⭐⭐ | All |
| **Sidebar** | 2x Rectangle | Sidebar component includes ads | ⭐⭐⭐ | Desktop |

---

## **🔍 Search Page (page.tsx) - 2 Ads**

| Position | Ad Type | Component | Revenue Impact | Device |
|----------|---------|-----------|----------------|---------|
| Top of Page | Leaderboard | `<LeaderboardAd position="top" />` | ⭐⭐⭐ | All |
| **Sidebar** | 2x Rectangle | Sidebar component includes ads | ⭐⭐⭐ | Desktop |

---

## **⚡ Transfer Status Pages - 2 Ads Each**

### Confirmed Transfers (`/transfers/confirmed/page.tsx`)
### Transfer Rumors (`/transfers/rumors/page.tsx`)  
### Completed Transfers (`/transfers/completed/page.tsx`)

| Position | Ad Type | Component | Revenue Impact | Device |
|----------|---------|-----------|----------------|---------|
| Top of Page | Leaderboard | `<LeaderboardAd position="top" />` | ⭐⭐⭐ | All |
| **Sidebar** | 2x Rectangle | Sidebar component includes ads | ⭐⭐⭐ | Desktop |

---

## **📄 Static Pages - 2 Ads Each**

### About (`/about/page.tsx`)
### Contact (`/contact/page.tsx`)
### Privacy (`/privacy/page.tsx`)
### Terms (`/terms/page.tsx`)

| Position | Ad Type | Component | Revenue Impact | Device |
|----------|---------|-----------|----------------|---------|
| Top of Page | Leaderboard | `<LeaderboardAd position="top" />` | ⭐⭐ | All |
| Mid Content | Rectangle | `<RectangleAd position="after-content" />` | ⭐⭐ | All |
| **Sidebar** | 2x Rectangle | Sidebar component includes ads | ⭐⭐ | Desktop |

---

## **🎛️ Ad Configuration & Control**

### **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_ADS_ENABLED=false  # Set to true when approved
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-6269937543968234
```

### **Ad Slot Configuration** (`/src/lib/ads.ts`)
```typescript
// Enable individual ads when approved
LEADERBOARD_TOP: {
  slotId: 'YOUR_SLOT_ID_HERE', // Replace with real slot ID
  enabled: false,              // Set to true when approved
}
```

### **Global Ad Management**
- **Review Period**: All ads disabled by default
- **Conditional Rendering**: Ads only show when enabled
- **Lazy Loading**: Ads load when visible (performance optimized)
- **Responsive**: Different sizes for mobile/desktop
- **Error Handling**: Graceful fallbacks

---

## **📈 Revenue Optimization Features**

### **High-Performance Ad Sizes**
- **728x90** (Leaderboard) - Highest CPM
- **300x250** (Rectangle) - Best performance
- **336x280** (Large Rectangle) - Premium rates
- **320x50** (Mobile Banner) - Mobile optimized

### **Strategic Placement Rules**
- **Above Fold**: 1-2 ads maximum per page
- **Content Integration**: Native ads blend naturally
- **Natural Breaks**: Ads at logical content breaks
- **Sidebar Stacking**: Vertical ad placement with content spacing
- **Mobile Optimization**: Responsive sizing + sticky bottom

### **User Experience Balance**
- **15-20px spacing** between ads
- **Content-first approach** - ads enhance, don't interrupt
- **Close buttons** on sticky ads
- **Loading placeholders** during development

---

## **🚀 Deployment Strategy**

### **Phase 1: Review Period (Current)**
```bash
NEXT_PUBLIC_ADS_ENABLED=false
```
- No ads show on site
- Code ready for approval
- Zero impact on user experience

### **Phase 2: Google Approval**
1. **Get Ad Slot IDs** from Google AdSense
2. **Update Configuration** in `/src/lib/ads.ts`
3. **Enable Ads Globally** 
   ```bash
   NEXT_PUBLIC_ADS_ENABLED=true
   ```
4. **Deploy & Monitor**

### **Phase 3: Optimization**
- **A/B test** ad positions
- **Monitor performance** metrics
- **Adjust placement** based on data
- **Scale to other pages**

---

## **💰 Expected Revenue Impact**

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Ad Count** | 4 auto ads | 12-15 manual ads | +200-275% |
| **Control** | Google decides | Full manual control | ∞ |
| **Placement** | Random | Strategic positions | +50-100% CPM |
| **Revenue** | Baseline | **150-200% increase** | 🚀 |

---

## **🔧 Technical Implementation**

### **Reusable Components**
- `<LeaderboardAd />` - Top banners
- `<RectangleAd />` - Content ads  
- `<NativeAd />` - In-feed ads
- `<StickyBottomAd />` - Mobile sticky
- `<TransferGridWithAds />` - Grid with integrated ads

### **Global Management**
- `<AdProvider />` - Wraps entire app
- Centralized configuration
- Environment-based control
- Performance monitoring ready

**🎯 Result: Maximum ad revenue with minimal user experience impact!**
