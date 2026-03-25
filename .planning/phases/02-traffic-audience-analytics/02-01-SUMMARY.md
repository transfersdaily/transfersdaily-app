---
phase: 02-traffic-audience-analytics
plan: 01
subsystem: analytics-data-layer
tags: [ga4, api-routes, tanstack-query, caching, typescript]
dependency_graph:
  requires: [ga4-client, supabase-auth-guard, tanstack-react-query]
  provides: [TrafficResponse, TopArticlesResponse, useTrafficData, useTopArticles, useDateRange]
  affects: [admin-analytics-page]
tech_stack:
  added: []
  patterns: [batchRunReports, unstable_cache-1hr, url-search-params-state, query-key-per-range]
key_files:
  created:
    - src/types/analytics.ts
    - src/app/api/admin/analytics/traffic/route.ts
    - src/app/api/admin/analytics/top-articles/route.ts
    - src/hooks/use-analytics.ts
    - src/hooks/use-date-range.ts
  modified: []
decisions:
  - batchRunReports combines 3 GA4 reports in single round-trip (current KPIs, previous KPIs, time-series)
  - bounceRate multiplied by 100 server-side (GA4 returns 0.0-1.0)
  - Top articles aggregated by slug across all 5 locales before ranking
  - unstable_cache keyed by days argument for per-range cache entries
metrics:
  duration: 2 min
  completed: 2026-03-25
  tasks_completed: 3
  tasks_total: 3
  files_created: 5
  files_modified: 0
---

# Phase 2 Plan 01: Analytics Data Layer Summary

GA4 batchRunReports with unstable_cache (1hr TTL) powering traffic KPIs, time-series, and top articles with Supabase title matching.

## What Was Built

### Type Contracts (src/types/analytics.ts)
- `TrafficResponse`: 5 KPI metrics (pageViews, sessions, totalUsers, avgSessionDuration, bounceRate) each with value and percentage change, plus gap-filled time-series array
- `TopArticlesResponse`: Ranked articles with slug, DB-matched title, pageViews, avgDuration, URL
- `DateRange` type union ('1' | '7' | '30' | '90') and `DATE_RANGE_OPTIONS` constant

### Traffic API Route (src/app/api/admin/analytics/traffic/route.ts)
- Single `batchRunReports()` call combining 3 GA4 reports: current period KPIs, previous period KPIs (for % change), and time-series
- `unstable_cache` with 1-hour revalidation, cache key includes days argument
- Gap-filled time-series: daily labels ("Mar 1") for 7d/30d/90d, hourly labels ("2 PM") for 24h
- bounceRate multiplied by 100 before returning (GA4 returns 0.0-1.0)
- Percentage change calculation: `((current - previous) / previous) * 100`, zero-safe

### Top Articles API Route (src/app/api/admin/analytics/top-articles/route.ts)
- GA4 runReport with pagePath CONTAINS '/article/' filter, limit 500
- Slug extraction and aggregation across all locale paths (en, es, fr, de, it)
- Weighted average duration calculation per slug
- Supabase query to match slugs to article titles
- Returns top 10 sorted by pageViews descending

### TanStack Query Hooks (src/hooks/use-analytics.ts)
- `useTrafficData(days)` and `useTopArticles(days)` following Phase 1 useDashboardStats pattern
- Query keys include `days` for per-range caching
- 1-hour staleTime matching server cache, refetchOnWindowFocus disabled

### Date Range Hook (src/hooks/use-date-range.ts)
- Reads/writes URL `?days=` search param via Next.js useSearchParams + useRouter
- Default: '30' (30 days)
- Returns `{ days, daysParam, setDays }`

## Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Analytics type contracts and date range hook | 05e3cd9 | src/types/analytics.ts, src/hooks/use-date-range.ts |
| 2 | Traffic API route with batchRunReports and caching | 0c55973 | src/app/api/admin/analytics/traffic/route.ts |
| 3 | Top articles API route and TanStack Query hooks | 06f4c98 | src/app/api/admin/analytics/top-articles/route.ts, src/hooks/use-analytics.ts |

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all data flows are wired to GA4 and Supabase.

## Verification Results

- All 5 files exist at correct paths
- `npx tsc --noEmit` passes with no errors in new files
- Traffic route uses `batchRunReports` (confirmed via grep)
- Both API routes use `unstable_cache` with `revalidate: 3600`
- Both hooks include `days` in queryKey array
- Types define all 5 KPI metrics with value+change
