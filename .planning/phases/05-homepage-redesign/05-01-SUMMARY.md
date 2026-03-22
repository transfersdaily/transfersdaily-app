---
phase: 05-homepage-redesign
plan: 01
subsystem: ui
tags: [nextjs, isr, react, component-decomposition]

# Dependency graph
requires:
  - phase: 03-article-cards
    provides: ArticleCard CVA variants (hero, standard, compact, mini)
  - phase: 04-ad-system
    provides: AdSlot unified component
provides:
  - HeroSection component for homepage hero layout
  - LatestSection component for latest transfers grid
  - LeagueSection component for per-league article grids
  - ISR-enabled homepage with 5-minute revalidation
affects: [06-article-page, 08-animations, 09-mobile]

# Tech tracking
tech-stack:
  added: []
  patterns: [section-component-extraction, isr-revalidation, slim-page-composer]

key-files:
  created:
    - src/components/sections/HeroSection.tsx
    - src/components/sections/LatestSection.tsx
    - src/components/sections/LeagueSection.tsx
  modified:
    - src/app/[locale]/page.tsx

key-decisions:
  - "Section components extracted to src/components/sections/ directory pattern"
  - "ISR revalidate=300 replaces force-dynamic for homepage caching"

patterns-established:
  - "Section extraction: page.tsx as slim composer importing section components from sections/"
  - "ISR config: export const revalidate = 300 at page level for 5-minute cache"

requirements-completed: [HOME-01, HOME-02, HOME-05, HOME-06]

# Metrics
duration: 2min
completed: 2026-03-22
---

# Phase 5 Plan 1: Homepage Decomposition Summary

**Homepage decomposed into 3 section components (Hero/Latest/League) with ISR 5-minute revalidation replacing force-dynamic**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-22T13:30:54Z
- **Completed:** 2026-03-22T13:32:58Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Extracted HeroSection (79 lines), LatestSection (51 lines), LeagueSection (55 lines) -- all under 150-line limit
- Reduced page.tsx from 471 to 344 lines with clean ~60-line HomePage composer function
- Switched from force-dynamic to ISR with 5-minute revalidation (revalidate=300)
- Preserved all SEO metadata, structured data, sidebar, ad slots, and responsive grid layout

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract section components** - `23cdc51` (feat)
2. **Task 2: Rewrite page.tsx as slim composer with ISR** - `dc4f356` (feat)

## Files Created/Modified
- `src/components/sections/HeroSection.tsx` - Hero section with featured article + 2 side articles, Suspense fallback
- `src/components/sections/LatestSection.tsx` - Latest transfers heading + TransferGrid with skeleton fallback
- `src/components/sections/LeagueSection.tsx` - Per-league compact article grid with ViewAllButton
- `src/app/[locale]/page.tsx` - Slim page composer importing sections, ISR revalidate=300

## Decisions Made
- Section components placed in `src/components/sections/` directory to establish a reusable extraction pattern
- ISR revalidate=300 (5 minutes) chosen per decision D-17 through D-20 from planning

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing type error in TrendingArticles.tsx (getTrending method missing) -- unrelated to this plan, not fixed

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Homepage section components are stable and ready for animation/transition work in Phase 8
- Section extraction pattern established for potential reuse in article page decomposition (Phase 6)
- ISR caching active -- pages will be served from cache and revalidated every 5 minutes

## Self-Check: PASSED

All 4 created/modified files verified on disk. Both task commits (23cdc51, dc4f356) verified in git log.

---
*Phase: 05-homepage-redesign*
*Completed: 2026-03-22*
