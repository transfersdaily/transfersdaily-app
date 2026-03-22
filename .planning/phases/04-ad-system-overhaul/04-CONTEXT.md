# Phase 4: Ad System Overhaul - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Consolidate 12 duplicate ad components into a single configurable AdSlot component. Add CLS-safe height reservation, lazy loading via IntersectionObserver, and real shouldShowAds() validation. No new ad placements or revenue strategy changes — just infrastructure consolidation and performance.

</domain>

<decisions>
## Implementation Decisions

### Single AdSlot Component
- **D-01:** Create one `AdSlot` component replacing all 12 ad components (AdInContent1/2/3, AdSidebar, AdSidebar2, AdBanner, AdInFeed, AdMobileSticky, AdArticleContent, AdArticleBottom, AdInContent).
- **D-02:** Component API: `<AdSlot placement="homepage.sidebar-top" />` — placement string maps to existing `AD_SLOTS` config in `src/lib/ads.ts`.
- **D-03:** Optional props: `lazy` (boolean, default true for non-hero), `sticky` (boolean, for mobile sticky), `className` (string).
- **D-04:** AdSlot internally wraps with `AdFreeZone` logic (check pathname for admin/login/debug) — no separate wrapper needed.

### CLS Prevention (UI/UX Pro Max §3: content-jumping, image-dimension)
- **D-05:** Each placement in `AD_SLOTS` config gets a `minHeight` value (e.g., sidebar: 250px, in-content: 250px, banner: 90px, mobile-sticky: 50px).
- **D-06:** AdSlot renders container with `min-height` from config IMMEDIATELY, before ad script loads — prevents layout shift.
- **D-07:** While ad loads, show `bg-muted/30` placeholder with subtle `animate-pulse` skeleton (UI/UX Pro Max §7: loading-states).
- **D-08:** When ad fails to load or is empty, collapse container to 0 height (existing behavior from Phase 2 that collapses empty ad containers).

### Lazy Loading (UI/UX Pro Max §3: lazy-loading)
- **D-09:** Above-fold ads (hero positions, first sidebar) load immediately — no lazy loading.
- **D-10:** Below-fold ads use `IntersectionObserver` with `rootMargin: '200px'` to preload 200px before becoming visible.
- **D-11:** Wire up existing `AD_CONFIG.LAZY_LOAD` flag from `src/lib/ads.ts` to control global lazy behavior.

### shouldShowAds() Validation (AD-03)
- **D-12:** Implement real `shouldShowAds()` in `src/lib/ads.ts` replacing the always-true stub.
- **D-13:** Validation checks: article content length > 200 chars, page is public (not admin/login/debug), article status is "published".
- **D-14:** Return false for error pages, 404s, and pages without meaningful content.

### Migration
- **D-15:** Replace all 12 ad component imports across the codebase with `AdSlot placement="..."` calls.
- **D-16:** Keep `AD_SLOTS` config structure but extend each slot entry with `{ slotId, minHeight, lazy }` metadata.
- **D-17:** Delete all 12 individual ad component files after migration. Keep `AdSense` as the internal rendering primitive.
- **D-18:** Update `src/components/ads/index.ts` to export only `AdSlot` and `shouldShowAds`.

### Claude's Discretion
- Exact minHeight values per placement (balance between CLS prevention and wasted space)
- IntersectionObserver implementation details (threshold, root)
- Whether to use a React hook (useInView) or native IntersectionObserver
- Skeleton/placeholder visual design for loading state
- shouldShowAds() content quality threshold details beyond the basics in D-13

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Current Ad Components (to replace)
- `src/components/ads/index.ts` — Current barrel export of all 12 ad components + AdFreeZone + ads.ts
- `src/components/ads/AdSense.tsx` — Base AdSense component (keep as internal primitive)
- `src/components/ads/AdFreeZone.tsx` — Admin path detection (fold into AdSlot)
- `src/components/ads/AdInContent1.tsx` — Example of current pattern: AdFreeZone → div → AdSense
- `src/components/ads/AdSidebar.tsx` — Example sidebar ad pattern
- `src/components/ads/AdMobileSticky.tsx` — Mobile sticky pattern

### Ad Configuration
- `src/lib/ads.ts` — AD_SLOTS config (per-page/position slot IDs), AD_CONFIG, getAdSlot() helper

### Current Ad Consumers
- `src/app/[locale]/page.tsx` — Homepage: uses AdInContent1/2/3, AdSidebar, AdSidebar2, AdMobileSticky
- `src/components/TransferGrid.tsx` — Uses AdInFeed every 6 articles
- `src/app/[locale]/article/[slug]/page.tsx` — Article page: uses AdArticleContent, AdArticleBottom

### UI/UX Pro Max Rules Applied
- §3 `content-jumping` (HIGH): Reserve space with min-height for all ad containers
- §3 `lazy-loading` (MEDIUM): IntersectionObserver for below-fold ads
- §3 `image-dimension` (HIGH): Fixed dimensions prevent CLS
- §7 `loading-states` (HIGH): Skeleton placeholder while ad loads
- §3 `lazy-load-below-fold`: loading="lazy" pattern for non-critical content

### Phase 1 Context (inherited)
- `.planning/phases/01-design-tokens-theming/01-CONTEXT.md` — OLED dark theme tokens (bg-muted for placeholders)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ads/AdSense.tsx` — Base AdSense rendering component. AdSlot should use this internally.
- `src/components/ads/AdFreeZone.tsx` — Pathname-based admin detection. Logic should be folded into AdSlot.
- `src/lib/ads.ts` — Well-structured AD_SLOTS config with per-page/position mapping. Extend with minHeight/lazy metadata.

### Established Patterns
- All 12 ad components follow identical pattern: `AdFreeZone` → `div` with `minHeight: 250px` → `AdSense` with hardcoded `adSlot`
- `AdFreeZone` uses `usePathname()` to check admin/login/debug paths
- `AD_CONFIG.LAZY_LOAD = true` exists but is not wired to any implementation
- `AD_CONFIG.MAX_ADS_PER_PAGE = 15` — not enforced anywhere

### Integration Points
- Homepage imports from `@/components/ads` barrel file — single import point
- TransferGrid inserts `AdInFeed` every 6 articles — this pattern must be preserved with AdSlot
- Article page uses ads at specific content positions — placement config already mapped in AD_SLOTS

</code_context>

<specifics>
## Specific Ideas

- Ad containers that fail to load should collapse gracefully (already working from Phase 2 fix)
- The existing AD_SLOTS config is well-structured — extend it, don't replace it
- shouldShowAds() should be simple and deterministic — no async calls, just content quality checks
- Mobile sticky ad should be the last thing to load (lowest priority)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-ad-system-overhaul*
*Context gathered: 2026-03-22*
