---
phase: 03-content-analytics
plan: 02
subsystem: content-analytics-ui
tags: [charts, recharts, translation-coverage, content-page, article-views]
dependency_graph:
  requires: [Plan 03-01 types/hooks/API routes, Phase 2 chart patterns]
  provides: [LeagueDistributionChart, CategoryDistributionChart, ArticlesPerDayChart, TranslationCoverageGrid, /admin/content page, Views column in articles table]
  affects: [Admin navigation (needs /admin/content link)]
tech_stack:
  added: []
  patterns: [Horizontal bar chart (layout=vertical), Translation coverage color tiers, GA4 views in table column]
key_files:
  created:
    - src/components/admin/LeagueDistributionChart.tsx
    - src/components/admin/CategoryDistributionChart.tsx
    - src/components/admin/ArticlesPerDayChart.tsx
    - src/components/admin/TranslationCoverageGrid.tsx
    - src/app/admin/content/page.tsx
  modified:
    - src/hooks/useArticles.ts
    - src/components/ArticlesTableMobile.tsx
    - src/components/admin/ArticlesPageLayout.tsx
decisions:
  - Horizontal bar charts use layout=vertical with recharts BarChart
  - Translation coverage tiers: green >=90%, amber >=50%, red <50%
  - Views column shows dash for articles without GA4 data
  - Content analytics page uses AdminPageLayout wrapper for consistency
metrics:
  duration: 4 min
  completed: 2026-03-25
---

# Phase 3 Plan 02: Content Analytics UI Summary

Content analytics UI with 4 visualization components, a content page, and per-article GA4 view counts in the articles table.

## One-liner

Horizontal bar charts for league/category distribution, dual-area time-series for articles per day, 5-language translation coverage grid with color-coded tiers, and GA4 views column in articles table.

## What Was Built

### Task 1: Distribution Charts and Articles-Per-Day Chart (452a4f5)

Created three chart components following the TrafficChart.tsx pattern:

- **LeagueDistributionChart**: Horizontal bar chart with per-league colors via Cell pattern, dynamic height based on league count
- **CategoryDistributionChart**: Horizontal bar chart with primary color, dynamic height
- **ArticlesPerDayChart**: Dual-area time-series (published + drafts) over 30 days, matching TrafficChart style

All three use Card wrapper, Skeleton loading, empty state, and `isAnimationActive={false}`.

### Task 2: Translation Coverage, Content Page, Views Column (db2203f)

- **TranslationCoverageGrid**: Responsive 5-column grid showing each language's translation count, coverage percentage with color-coded tiers (green/amber/red), and progress bar
- **Content analytics page** (`/admin/content`): Composes all 4 components -- articles-per-day (full width), league + category (2-col grid), translation coverage (full width)
- **useArticles hook**: Now calls `useArticleViews` with article slugs, exposes `articleViews` record
- **ArticlesTableMobile**: Added `slug` to Article interface, `articleViews` prop, and "Views" column showing localized count or dash
- **ArticlesPageLayout**: Passes `articleViews` through to ArticlesTableMobile

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added slug to Article interface in ArticlesTableMobile**
- **Found during:** Task 2
- **Issue:** Article interface in ArticlesTableMobile lacked `slug` field needed for views lookup
- **Fix:** Added optional `slug?: string` to the interface
- **Files modified:** src/components/ArticlesTableMobile.tsx
- **Commit:** db2203f

## Decisions Made

1. Translation coverage color tiers: green (>=90%), amber (>=50%), red (<50%) -- matches the plan's D-11 requirement to highlight under-translated languages
2. Views column placed after Translations column in desktop table, uses `tabular-nums` for alignment
3. Content page uses AdminPageLayout wrapper for consistent admin shell

## Self-Check: PASSED

- All 5 created files exist on disk
- Both commits verified: 452a4f5, db2203f
- All verification grep checks pass (useContentDistribution, useArticleViews, articleViews, isAnimationActive)
