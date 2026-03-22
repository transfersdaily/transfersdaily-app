---
phase: 03-card-system-component-consolidation
plan: 02
subsystem: ui
tags: [react, next.js, article-card, cva, component-migration]

# Dependency graph
requires:
  - phase: 03-card-system-component-consolidation plan 01
    provides: ArticleCard component with hero/standard/compact/mini variants and ArticleCardSkeleton
provides:
  - All homepage card rendering via ArticleCard (hero, compact variants)
  - Sidebar recommended articles via ArticleCard mini variant
  - Skeleton loading states using ArticleCardSkeleton across all pages
  - Zero consumer files importing TransferCard, TransferCardSkeleton, or SidebarArticleItem
affects: [04-ad-system, 06-article-page, 08-animation, 09-mobile]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ArticleCard variant prop for all card rendering across the site"
    - "ArticleCardSkeleton grid pattern replacing TransferGridSkeleton"

key-files:
  created: []
  modified:
    - src/app/[locale]/page.tsx
    - src/components/RecommendedArticles.tsx
    - src/components/LatestPageClient.tsx
    - src/components/LeaguePageClient.tsx
    - src/components/SearchPageClient.tsx

key-decisions:
  - "Removed Image, Link, Badge, Card, Skeleton imports from homepage -- ArticleCard handles all internally"
  - "Removed mobileTypography unused import from RecommendedArticles during cleanup"

patterns-established:
  - "ArticleCard variant=hero for featured/hero sections with gradient overlay"
  - "ArticleCard variant=compact for league section horizontal cards"
  - "ArticleCard variant=mini for sidebar recommended articles"
  - "ArticleCardSkeleton grid wrapper replacing TransferGridSkeleton"

requirements-completed: [DS-01]

# Metrics
duration: 5min
completed: 2026-03-22
---

# Phase 3 Plan 02: Consumer Migration Summary

**All homepage, sidebar, and page-level card consumers migrated to ArticleCard variants, eliminating TransferCard/SidebarArticleItem imports from every consumer file**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-22T11:10:00Z
- **Completed:** 2026-03-22T11:15:00Z
- **Tasks:** 4 of 4 (3 auto + 1 checkpoint approved)
- **Files modified:** 12

## Accomplishments
- Homepage hero section, side articles, and league sections all render via ArticleCard variants (hero, compact)
- Sidebar recommended articles use ArticleCard variant=mini with skeleton loading states
- All 5 consumer files cleaned of TransferCard, TransferCardSkeleton, and SidebarArticleItem imports
- TypeScript compilation passes with zero errors after all migrations

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate homepage hero, side articles, LeagueSection to ArticleCard** - `e9b2b42` (feat)
2. **Task 2: Migrate RecommendedArticles sidebar to ArticleCard mini** - `3f8343c` (feat)
3. **Task 3: Clean up unused imports in LatestPageClient, LeaguePageClient, SearchPageClient** - `a382144` (chore)
4. **Task 4: Visual verification checkpoint** - Approved by user

**Post-checkpoint fixes (typography and cleanup):**
- `aef1bc2` - fix: standardize font-display typography across all pages and components
- `57ce441` - fix: standardize typography across sidebar and button headings
- `e682261` - fix: remove sidebar card wrappers, fix heading spacing
- `04bb4c7` - fix: standardize all empty state text to text-sm text-muted-foreground
- `746e494` - fix: replace hardcoded English empty states with t() translations

## Files Created/Modified
- `src/app/[locale]/page.tsx` - Homepage: hero, side articles, LeagueSection, skeletons all use ArticleCard
- `src/components/RecommendedArticles.tsx` - Sidebar: uses ArticleCard mini with ArticleCardSkeleton loading
- `src/components/LatestPageClient.tsx` - Removed TransferCard/TransferGridSkeleton, uses ArticleCardSkeleton
- `src/components/LeaguePageClient.tsx` - Removed TransferCard/TransferGridSkeleton, uses ArticleCardSkeleton
- `src/components/SearchPageClient.tsx` - Removed TransferCard, uses ArticleCardSkeleton for search loading
- `src/components/Footer.tsx` - Footer headings updated to font-display
- `src/components/PageHeader.tsx` - Simplified with font-display
- `src/components/Sidebar.tsx` - Card wrappers removed, spacing fixed
- `src/components/LeagueHero.tsx` - Typography standardized
- `src/components/TrendingTopics.tsx` - Typography standardized
- `src/components/ViewAllButton.tsx` - Typography standardized
- `src/lib/typography.ts` - Typography utilities updated

## Decisions Made
- Removed unused Image, Link, Badge, Card, Skeleton imports from homepage since ArticleCard handles all rendering internally
- Removed unused mobileTypography import from RecommendedArticles (Rule 2 cleanup)
- SearchPageClient inline skeleton replaced with ArticleCardSkeleton for consistency

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Cleanup] Removed unused mobileTypography import from RecommendedArticles**
- **Found during:** Task 2
- **Issue:** mobileTypography was imported but never used in the component body
- **Fix:** Removed the unused import
- **Files modified:** src/components/RecommendedArticles.tsx
- **Committed in:** 3f8343c (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 cleanup)
**Impact on plan:** Minor unused import cleanup. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All card consumers now use ArticleCard -- old TransferCard and SidebarArticleItem are dead code
- Ready for Phase 4 (ad system overhaul) -- ad placements preserved throughout migration
- Visual verification approved -- additional typography and empty state fixes applied post-checkpoint
- Phase 3 complete -- ready for Phase 4 (ad system overhaul)

---
*Phase: 03-card-system-component-consolidation*
*Completed: 2026-03-22*
