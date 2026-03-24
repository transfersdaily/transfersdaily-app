---
phase: 01-dashboard-foundation
plan: 01
subsystem: admin-dashboard-data-layer
tags: [tanstack-query, api, data-contract, hooks]
dependency_graph:
  requires: []
  provides: [DashboardResponse, useDashboardStats, getQueryClient, /api/admin/dashboard]
  affects: [admin-layout, kpi-cards, sidebar-badge]
tech_stack:
  added: ["@tanstack/react-query@5", "@tanstack/react-query-devtools@5"]
  patterns: [unstable_cache, useQuery-singleton, parallel-supabase-queries]
key_files:
  created:
    - src/types/dashboard.ts
    - src/app/api/admin/dashboard/route.ts
    - src/lib/query-client.ts
    - src/hooks/use-dashboard.ts
  modified:
    - package.json
    - package-lock.json
decisions:
  - "Direct Supabase queries in aggregated endpoint (not Lambda proxy) for speed and richer data"
  - "Browser singleton pattern for QueryClient to prevent cache loss on re-render"
  - "Graceful fallback to 0 for contact_submissions if table missing or query fails"
metrics:
  duration: "3 minutes"
  completed: "2026-03-25"
  tasks: 2
  files_created: 4
  files_modified: 2
---

# Phase 1 Plan 01: Dashboard Data Layer Summary

TanStack Query v5 installed with aggregated /api/admin/dashboard endpoint using direct Supabase queries with unstable_cache (5-min server TTL), returning all KPI metrics in a single DashboardResponse contract.

## What Was Built

### Task 1: TanStack Query + DashboardResponse Contract
- Installed `@tanstack/react-query` v5 and devtools
- Created `DashboardResponse` interface defining the complete data contract: publishedToday, publishedThisWeek, publishedThisMonth, draftBacklog, processingRate, 7-day trends (publishedDaily/draftsDaily arrays), unreadMessages, cachedAt
- Created `getQueryClient()` singleton with 5-min staleTime default, window focus refetch, retry=1

### Task 2: Aggregated API Endpoint + Hook
- Created `/api/admin/dashboard` endpoint with auth guard (validateAuth)
- Uses `unstable_cache` with key `['admin-dashboard']` and 300s revalidation
- 7 parallel Supabase queries via Promise.all: today/week/month published counts, draft backlog, published trend, drafts trend, contact submissions count
- Processing rate computed as published-last-7-days / 7
- groupByDay helper transforms raw rows into 7-entry arrays for sparklines
- Every query wrapped in .catch() for graceful degradation
- Created `useDashboardStats()` hook wrapping useQuery with typed DashboardResponse generic

## Deviations from Plan

None -- plan executed exactly as written.

## Key Technical Decisions

1. **Direct Supabase over Lambda proxy** -- The aggregated endpoint queries Supabase directly instead of proxying through Lambda. This avoids cold start latency and enables richer queries (date ranges, counts) that the current Lambda does not support.

2. **contact_submissions graceful fallback** -- Table existence is not guaranteed. The query uses .catch() to return count=0 if the table is missing or has different schema.

3. **groupByDay JS aggregation** -- Rather than complex SQL date grouping, raw rows are fetched and grouped in JS. Acceptable for 7-day windows with moderate article volume.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | f6e4071 | Install TanStack Query v5, create DashboardResponse type and QueryClient singleton |
| 2 | 292c0f8 | Create aggregated dashboard API endpoint and useDashboardStats hook |

## Known Stubs

None -- all data sources are wired to Supabase queries with graceful fallbacks.

## Self-Check: PASSED

- All 4 created files verified on disk
- Both commits (f6e4071, 292c0f8) verified in git log
- No console.log in any new file
- All acceptance criteria confirmed
