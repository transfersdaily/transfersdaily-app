---
phase: 04-ad-system-overhaul
plan: 01
subsystem: ui
tags: [adsense, intersection-observer, cls, lazy-loading, content-validation]

# Dependency graph
requires:
  - phase: 01-design-tokens
    provides: CSS variables, spacing scale, animation tokens
provides:
  - AdSlot unified component replacing 12 ad components
  - SlotConfig type with per-placement metadata (minHeight, lazy, format)
  - getSlotConfig() placement string lookup function
  - Real shouldShowAds() content validation
affects: [04-ad-system-overhaul, 06-article-restructure]

# Tech tracking
tech-stack:
  added: []
  patterns: [placement-string-config-lookup, intersection-observer-lazy-loading, cls-height-reservation, mutation-observer-ad-fill-detection]

key-files:
  created:
    - src/components/ads/AdSlot.tsx
  modified:
    - src/lib/ads.ts
    - src/lib/content-validation.ts

key-decisions:
  - "Real slot IDs from existing 12 components mapped to AD_SLOTS config positions"
  - "Hooks called unconditionally with early returns after all hooks to satisfy React rules-of-hooks"
  - "AdFreeZone logic inlined in AdSlot instead of wrapping with AdFreeZone component"

patterns-established:
  - "Placement string pattern: 'page.position' maps to AD_SLOTS.PAGE.POSITION via getSlotConfig()"
  - "CLS reservation: min-height set from config before ad loads, animate-pulse skeleton shown"
  - "Lazy loading: IntersectionObserver with 200px rootMargin for below-fold ads"
  - "Collapse on empty: MutationObserver detects unfilled status, transitions to max-height 0"

requirements-completed: [DS-07, AD-01, AD-02, AD-03]

# Metrics
duration: 3min
completed: 2026-03-22
---

# Phase 4 Plan 1: Ad Infrastructure Summary

**Unified AdSlot component with per-placement SlotConfig metadata, IntersectionObserver lazy loading, CLS height reservation, and real shouldShowAds() content validation**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-22T12:08:47Z
- **Completed:** 2026-03-22T12:11:52Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Extended AD_SLOTS config from plain strings to SlotConfig objects with minHeight, lazy, format, layout, layoutKey per placement
- Built unified AdSlot component that replaces all 12 duplicate ad components with a single placement-string API
- Fixed shouldShowAds() from always-true stub to real content validation using validateContentQuality()

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend AD_SLOTS config and implement shouldShowAds()** - `a047060` (feat)
2. **Task 2: Build AdSlot component with CLS reservation and lazy loading** - `d3098ed` (feat)

## Files Created/Modified
- `src/components/ads/AdSlot.tsx` - Unified ad component with placement string API, lazy loading, CLS reservation, sticky mode
- `src/lib/ads.ts` - SlotConfig interface, extended AD_SLOTS with per-placement metadata, getSlotConfig() lookup
- `src/lib/content-validation.ts` - Real shouldShowAds() that validates content length and quality

## Decisions Made
- Mapped real hardcoded slot IDs from existing 12 components to correct AD_SLOTS config positions for backward compatibility
- All React hooks called unconditionally with early returns placed after hooks to satisfy rules-of-hooks
- AdFreeZone logic inlined via usePathname() check instead of wrapping with separate AdFreeZone component
- Kept getAdSlot() for backward compatibility, updated to read SlotConfig.slotId

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed React rules-of-hooks violation in AdSlot**
- **Found during:** Task 2 (AdSlot component build)
- **Issue:** Initial implementation had early returns before useEffect hooks, violating React rules-of-hooks
- **Fix:** Moved all early returns (isAdFree, !config) after all hook declarations
- **Files modified:** src/components/ads/AdSlot.tsx
- **Verification:** Component type-checks cleanly, hooks called unconditionally
- **Committed in:** d3098ed (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Auto-fix necessary for React correctness. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- AdSlot component ready for consumer migration (plan 04-02 will replace old components with AdSlot)
- All 12 existing ad components still present for backward compatibility during migration
- shouldShowAds() now validates real content quality, ready to be integrated into ad rendering flow

---
*Phase: 04-ad-system-overhaul*
*Completed: 2026-03-22*
