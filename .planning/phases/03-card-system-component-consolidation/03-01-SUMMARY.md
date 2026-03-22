---
phase: 03-card-system-component-consolidation
plan: 01
subsystem: ui
tags: [react, cva, class-variance-authority, cards, tailwind, next-image, skeleton]

# Dependency graph
requires:
  - phase: 01-design-tokens-theming
    provides: color tokens, league color CSS vars, typography scale, OLED dark mode
provides:
  - ArticleCard component with 4 CVA variants (hero, standard, compact, mini)
  - ArticleCardSkeleton with matching skeleton for each variant
  - TransferGrid migrated to use ArticleCard variant="standard"
affects: [03-02-PLAN, homepage, latest-page, league-page, search-page, sidebar]

# Tech tracking
tech-stack:
  added: []
  patterns: [CVA variant-driven component, flat props card API, internal sub-components pattern]

key-files:
  created:
    - src/components/ArticleCard.tsx
  modified:
    - src/components/TransferGrid.tsx

key-decisions:
  - "Server component compatible: no 'use client' directive on ArticleCard"
  - "Internal sub-components (LeagueBadge, CardImage, HeroLayout, etc.) not exported -- single clean API"

patterns-established:
  - "CVA variant pattern: cva() for card variants with VariantProps typing"
  - "Flat props pattern: cards receive pre-formatted strings, no Transfer objects"
  - "League color mapping: Record<string, string> map from league name to Tailwind class"

requirements-completed: [DS-01]

# Metrics
duration: 2min
completed: 2026-03-22
---

# Phase 3 Plan 1: ArticleCard Component System Summary

**Single ArticleCard with 4 CVA variants (hero, standard, compact, mini) plus matching skeletons, TransferGrid migrated as first consumer**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-22T11:05:27Z
- **Completed:** 2026-03-22T11:07:35Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created ArticleCard component with hero, standard, compact, and mini variants using class-variance-authority
- Created ArticleCardSkeleton with matching skeleton layout for each variant to prevent CLS
- Migrated TransferGrid from TransferCard to ArticleCard variant="standard" preserving ad insertion pattern

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ArticleCard + ArticleCardSkeleton with CVA variants** - `dd802a6` (feat)
2. **Task 2: Migrate TransferGrid to use ArticleCard** - `14ebbc5` (feat)

## Files Created/Modified
- `src/components/ArticleCard.tsx` - ArticleCard (4 variants) + ArticleCardSkeleton + ArticleCardProps export, LeagueBadge and CardImage internal sub-components
- `src/components/TransferGrid.tsx` - Replaced TransferCard import/usage with ArticleCard variant="standard"

## Decisions Made
- No 'use client' directive -- ArticleCard is purely presentational, works in both server and client components
- Internal sub-components (LeagueBadge, CardImage, HeroLayout, StandardLayout, CompactLayout, MiniLayout) kept unexported for clean API surface
- League color mapping uses a simple Record lookup with bg-primary fallback for unknown leagues

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing build failure in admin dashboard (recharts missing react-is dependency) -- out of scope, does not affect card system. TypeScript compilation passes cleanly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- ArticleCard component ready for Plan 02 consumer migrations (homepage hero, league sections, sidebar)
- All pages using TransferGrid (homepage latest, LatestPageClient, LeaguePageClient, SearchPageClient) automatically use new cards

---
*Phase: 03-card-system-component-consolidation*
*Completed: 2026-03-22*
