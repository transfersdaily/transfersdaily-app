---
phase: "06"
plan: "01"
subsystem: "admin-ui"
tags: [charts, responsive, tables, css, polish]
dependency-graph:
  requires: [01-shell, 02-analytics, 03-content, 04-pipeline]
  provides: [consistent-charts, responsive-admin, sortable-tables]
  affects: [all-admin-pages]
tech-stack:
  added: []
  patterns: [css-first-responsive, sortable-table-pattern, chart-legend-pattern]
key-files:
  created: []
  modified:
    - src/components/admin/TrafficChart.tsx
    - src/components/admin/ArticlesPerDayChart.tsx
    - src/components/admin/LeagueDistributionChart.tsx
    - src/components/admin/CategoryDistributionChart.tsx
    - src/components/admin/SourceHeatmap.tsx
    - src/components/admin/PipelineMonitor.tsx
    - src/components/admin/PipelineErrorLog.tsx
    - src/components/admin/TopArticlesTable.tsx
    - src/components/admin/AdminPageLayout.tsx
    - src/components/admin/ArticlesPageLayout.tsx
    - src/components/admin/AudienceKpis.tsx
    - src/components/ArticlesTableMobile.tsx
    - src/app/admin/analytics/page.tsx
decisions:
  - "CSS-first responsive: replaced all useIsMobile JS detection with Tailwind breakpoint classes"
  - "Chart legends: added ChartLegend/ChartLegendContent from shadcn chart to all recharts charts"
  - "Card consistency: standardized bg-white border border-gray-200 shadow-sm across all admin cards"
  - "Table pattern: useMemo for filtered/sorted data, local state for sort/search/page, consistent pagination UI"
metrics:
  duration: "7 min"
  completed: "2026-03-25"
---

# Phase 6: UI Polish & Responsive Summary

CSS-first responsive admin with chart legends, consistent card styling, and sortable/filterable/paginated data tables across all admin components.

## What Was Done

### Task 1: Chart Consistency
Added `ChartLegend` with `ChartLegendContent` to all four recharts-based chart components:
- TrafficChart (Page Views + Sessions legend)
- ArticlesPerDayChart (Published + Drafts legend)
- LeagueDistributionChart (count legend)
- CategoryDistributionChart (articles legend)

All charts already had tooltips and responsive containers via shadcn ChartContainer. The SourceHeatmap already had its own manual legend.

### Task 2: CSS-First Mobile Responsive
Removed `useIsMobile` JS hook from three core components:
- **AdminPageLayout**: Replaced JS conditional layout with `flex-col md:flex-row` for actions stacking
- **ArticlesPageLayout**: Removed isMobile-based conditional rendering of skeleton counts and grid classes, replaced with Tailwind responsive classes
- **ArticlesTableMobile**: Replaced all `isMobile ? 'class-a' : 'class-b'` patterns with `flex-col md:flex-row`, `w-full sm:w-[140px]`, `hidden md:block` / `md:hidden` for mobile/desktop layout switching

Also made the analytics page header responsive (`flex-col sm:flex-row`) and updated AudienceKpis grid to `grid-cols-1 xs:grid-cols-2 lg:grid-cols-5`.

Note: `useIsMobile` still exists in 12 other files (MobileArticleEditor, MobileAnalytics, MobileSettings, etc.) that were not in scope for this phase. Those are specialized mobile components that could be refactored in a future pass.

### Task 3: Table Sorting/Filtering/Pagination
Rewrote three tables to add full interactive features:

**TopArticlesTable**: Sortable by rank, title, views, avg duration. Search filter on title/slug. Pagination with 10/25/50 rows per page.

**PipelineMonitor**: Sortable by all 7 columns (source name, total, 24h, 7d, published, drafts, last article). Search filter on source name. Pagination with 10/25/50 rows per page. Upgraded from raw HTML `<table>` to shadcn Table.

**PipelineErrorLog**: Sortable by time, source, step, status. Search filter on source/step/message. Status dropdown filter (all/resolved/unresolved). Pagination with 10/25/50 rows per page. Upgraded from raw HTML `<table>` to shadcn Table.

All tables use the same pattern:
- Ghost button sort headers with ArrowUpDown/ArrowUp/ArrowDown icons
- `useMemo` for filtered/sorted data
- Local `useState` for sort key, direction, search, page, perPage
- Consistent pagination bar: count label, rows-per-page select, page indicator, prev/next buttons

### Task 4: Consistent Card Styling
Standardized all Card components across admin to use `bg-white border border-gray-200 shadow-sm`:
- SourceHeatmap (3 Card instances)
- PipelineMonitor (all summary + table cards)
- PipelineErrorLog (2 Card instances)

These now match the styling already used by TrafficChart, ArticlesPerDayChart, LeagueDistributionChart, CategoryDistributionChart, AudienceKpis, and TopArticlesTable.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing] Analytics page header not responsive**
- **Found during:** Task 2
- **Issue:** Analytics page header used `flex items-center justify-between` which breaks on narrow screens
- **Fix:** Changed to `flex-col sm:flex-row` with gap-4
- **Files modified:** src/app/admin/analytics/page.tsx
- **Commit:** 36ea6d0

## Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1+4 | Chart legends + card consistency | 67f1205 | 7 chart/card components |
| 2 | CSS-first responsive | 36ea6d0 | 5 layout/table components |
| 3 | Table sorting/filtering/pagination | b86d41c | 3 table components |

## Known Stubs

None. All features are fully wired to their data sources.

## Self-Check: PASSED

All modified files exist. All 3 commits verified in git log.
