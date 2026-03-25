---
phase: 04-pipeline-error-monitoring
plan: 01
subsystem: pipeline-data-layer
tags: [pipeline, api, types, hooks, supabase]
dependency_graph:
  requires: []
  provides: [pipeline-types, pipeline-stats-api, pipeline-errors-api, pipeline-heatmap-api, pipeline-hooks, dashboard-pipeline-health]
  affects: [admin-dashboard]
tech_stack:
  added: []
  patterns: [unstable_cache-60s, tanstack-query-1min-stale, supabase-jsonb-extraction, graceful-table-fallback]
key_files:
  created:
    - src/types/pipeline.ts
    - src/app/api/admin/pipeline/errors/route.ts
    - src/app/api/admin/pipeline/heatmap/route.ts
    - src/hooks/use-pipeline.ts
    - supabase/migrations/004_pipeline_events.sql
  modified:
    - src/app/api/admin/pipeline/stats/route.ts
    - src/app/api/admin/dashboard/route.ts
    - src/types/dashboard.ts
decisions:
  - Direct Supabase queries for all pipeline data (no Lambda proxy)
  - Stale drafts (>2h in draft) used as failure proxy when pipeline_events table absent
  - Pipeline health embedded in dashboard response for single-request loading
  - 1-min cache TTL for pipeline routes (faster refresh than dashboard 5-min)
metrics:
  duration: 4 min
  completed: 2026-03-25
  tasks: 2
  files_created: 5
  files_modified: 3
---

# Phase 4 Plan 1: Pipeline Data Layer Summary

Supabase-powered pipeline monitoring API with per-source stats, error detection via stale drafts, 7-day heatmap grid, and TanStack Query hooks -- all querying directly from the articles and sources tables.

## Tasks Completed

### Task 1: Types, migration SQL, and pipeline stats/errors/heatmap API routes
**Commit:** dbad943

- Created `src/types/pipeline.ts` with 8 exported interfaces: PipelineHealthSummary, PipelineSourceStats, PipelineStatsResponse, PipelineError, PipelineErrorsResponse, PipelineHeatmapCell, PipelineHeatmapRow, PipelineHeatmapResponse
- Created `supabase/migrations/004_pipeline_events.sql` with pipeline_events table schema and indexes
- Rewrote `src/app/api/admin/pipeline/stats/route.ts` from Lambda proxy to direct Supabase queries -- extracts sourceName from social_media_data JSONB, computes per-source article counts for 24h/7d/all-time windows
- Created `src/app/api/admin/pipeline/errors/route.ts` with dual error sources: pipeline_events table (graceful fallback if missing) and stale draft detection (articles stuck in draft >2h)
- Created `src/app/api/admin/pipeline/heatmap/route.ts` with 7-day x source grid, color-coded cells (green/yellow/red/gray), and optional pipeline_events error overlay

### Task 2: Extend dashboard API with pipeline health + create TanStack Query hooks
**Commit:** 1c8a99e

- Extended `DashboardResponse` type with `pipelineHealth: PipelineHealthSummary | null`
- Added 4 parallel pipeline queries to dashboard route: total processed, total published, stale drafts, last run time -- all with graceful degradation
- Created `src/hooks/use-pipeline.ts` with usePipelineStats, usePipelineErrors, usePipelineHeatmap hooks following established TanStack Query pattern (1-min staleTime, refetchOnWindowFocus)

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **Stale draft threshold: 2 hours** -- Articles in draft status for >2h within the last 24h are treated as pipeline failures, matching the plan specification.
2. **Success rate precision: 1 decimal** -- `successRate24h` computed to one decimal place (e.g., 85.7%) for meaningful dashboard display.
3. **Source discovery: hybrid** -- Sources come from the `sources` table, but articles with unrecognized sourceName values are also included in stats/heatmap rather than dropped.

## Known Stubs

None -- all data sources are wired to Supabase queries. The pipeline_events table may not exist yet (migration must be run manually), but all routes gracefully handle this.
