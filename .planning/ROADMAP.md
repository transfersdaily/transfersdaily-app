# Roadmap: TransfersDaily Admin Dashboard Redesign

## Overview

Transform the TransfersDaily admin section from a basic content counter into a professional editorial dashboard. The journey starts with a solid data foundation (TanStack Query, aggregated API, dashboard shell), layers on analytics (GA4 traffic, content distribution), adds operational monitoring (pipeline health, social media results), and finishes with UI polish across all surfaces. Every phase delivers observable capability; each builds on the last.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Dashboard Foundation** - Data layer, shell layout, KPI cards with aggregated API and TanStack Query
- [ ] **Phase 2: Traffic & Audience Analytics** - GA4 integration with caching, traffic charts, top articles, shared date range
- [ ] **Phase 3: Content Analytics** - Article distribution by league/source/day, per-article views, translation coverage
- [ ] **Phase 4: Pipeline & Error Monitoring** - pipeline_runs table, health dashboard, error log, source heatmap
- [ ] **Phase 5: Social Media Results** - Store posting results from Lambda, display per-platform stats
- [ ] **Phase 6: UI Polish & Responsive** - Chart consistency, mobile-responsive CSS, data table UX, final design pass

## Phase Details

### Phase 1: Dashboard Foundation
**Goal**: Admin has a modern dashboard shell with instant-loading KPIs powered by a single aggregated API call and client-side caching
**Depends on**: Nothing (first phase)
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, UXUI-01, UXUI-04
**Success Criteria** (what must be TRUE):
  1. Admin sees a sidebar navigation layout with header and responsive grid -- visually distinct from the current basic admin
  2. Dashboard page loads all KPI data from a single /api/admin/dashboard endpoint (no N+1 fetches visible in Network tab)
  3. Admin sees articles published today/this week/this month with 7-day sparkline trends on KPI cards
  4. Admin sees draft backlog count with processing rate indicator
  5. Unread contact message count appears as a badge in sidebar navigation
**Plans**: 3 plans
Plans:
- [ ] 01-01-PLAN.md — Data layer: TanStack Query setup, DashboardResponse contract, aggregated API endpoint, useDashboardStats hook
- [ ] 01-02-PLAN.md — Shell layout: AdminSidebar, AdminMobileNav, AdminHeader, AdminShell, layout.tsx rewrite with QueryClientProvider
- [ ] 01-03-PLAN.md — Dashboard page: KPI cards with sparklines, skeleton loading, responsive grid, full page.tsx rewrite
**UI hint**: yes

### Phase 2: Traffic & Audience Analytics
**Goal**: Admin can see how their audience is engaging with the site through GA4-powered traffic metrics and article rankings
**Depends on**: Phase 1
**Requirements**: TRAF-01, TRAF-02, TRAF-03, TRAF-04
**Success Criteria** (what must be TRUE):
  1. Admin sees a time-series chart of page views and sessions that updates when switching between 24h, 7d, 30d, and 90d ranges
  2. Admin sees audience KPIs (users, sessions, page views, avg duration, bounce rate) that load within 2 seconds on repeat visits (TanStack Query cache)
  3. Admin sees top 10 most-viewed articles for the selected date range with view counts
  4. Changing the date range selector updates all analytics sections on the page simultaneously
**Plans**: 2 plans
Plans:
- [ ] 02-01-PLAN.md — Data layer: analytics types, traffic API (batchRunReports + unstable_cache), top-articles API (slug matching + Supabase titles), TanStack Query hooks, date range hook
- [ ] 02-02-PLAN.md — UI: DateRangeSelector, AudienceKpis (5 cards with % change), TrafficChart (AreaChart dual y-axis), TopArticlesTable, analytics page rewrite
**UI hint**: yes

### Phase 3: Content Analytics
**Goal**: Admin understands content distribution patterns and can identify coverage gaps across leagues, sources, and languages
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05
**Success Criteria** (what must be TRUE):
  1. Admin sees article distribution by league as a chart and can identify which leagues are over/under-covered
  2. Admin sees article distribution by source as a bar chart showing which RSS sources produce the most content
  3. Admin sees a 30-day time-series chart of articles published per day
  4. Article list table shows per-article view count sourced from GA4 page path matching
  5. Admin sees a translation coverage grid showing article counts per language with untranslated articles highlighted
**Plans**: 2 plans
Plans:
- [ ] 03-01-PLAN.md — Data layer: content analytics types, distribution API (league/category/daily from Supabase), article-views API (GA4 slug matching), translations API, TanStack Query hooks
- [ ] 03-02-PLAN.md — UI: LeagueDistributionChart, CategoryDistributionChart, ArticlesPerDayChart, TranslationCoverageGrid, content page, articles table views column
**UI hint**: yes

### Phase 4: Pipeline & Error Monitoring
**Goal**: Admin knows at a glance whether the content pipeline is healthy and can drill into failures without checking AWS console
**Depends on**: Phase 1
**Requirements**: PIPE-01, PIPE-02, PIPE-03, PIPE-04
**Success Criteria** (what must be TRUE):
  1. Main dashboard shows pipeline health summary -- last run time, 24h success rate, failure count badge
  2. Admin can view a failure log with actual error messages, source name, and timestamps
  3. Admin sees per-source stats -- articles fetched, analyzed, saved, published per source
  4. Admin sees a 10-source x 7-day heatmap color-coded by pipeline status (green/yellow/red/gray)
**Plans**: 2 plans
Plans:
- [ ] 04-01-PLAN.md — Data layer: pipeline types, Supabase-powered API routes (stats/errors/heatmap), dashboard endpoint extension, TanStack Query hooks
- [ ] 04-02-PLAN.md — UI: PipelineHealthCard on dashboard, PipelineMonitor rewrite, PipelineErrorLog, SourceHeatmap, pipeline page rewrite
**UI hint**: yes

### Phase 5: Social Media Results
**Goal**: Admin can see whether social media posts are reaching audiences across all platforms
**Depends on**: Phase 1
**Requirements**: SOCL-01, SOCL-02
**Success Criteria** (what must be TRUE):
  1. Admin sees per-article social media posting results showing success/failure for each platform (Twitter, Bluesky, Facebook, Threads)
  2. Admin sees aggregate social posting stats -- posts attempted, succeeded, and failed by platform over the last 7 and 30 days
**Plans**: 1 plan
Plans:
- [x] 05-01 — Types, API route, TanStack hook, SocialStatsCard, SocialPostStatus, dashboard + editor integration
**UI hint**: yes

### Phase 6: UI Polish & Responsive
**Goal**: Every admin page meets premium editorial dashboard standards with consistent charts, responsive layout, and professional data tables
**Depends on**: Phase 1, Phase 2, Phase 3, Phase 4, Phase 5
**Requirements**: UXUI-02, UXUI-03, UXUI-05
**Success Criteria** (what must be TRUE):
  1. All charts across the admin use consistent colors, tooltips, legends, and responsive sizing -- no visual inconsistencies between pages
  2. Admin can use the full dashboard on a mobile phone with CSS-only responsive layout (no JS-based mobile detection)
  3. All data tables support sorting, filtering, and pagination with consistent interaction patterns
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6
Note: Phases 4 and 5 depend only on Phase 1 (not on 2/3), so they could theoretically run after Phase 1, but sequential execution is simpler.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Dashboard Foundation | 0/3 | Planning complete | - |
| 2. Traffic & Audience Analytics | 0/2 | Planning complete | - |
| 3. Content Analytics | 0/2 | Planning complete | - |
| 4. Pipeline & Error Monitoring | 0/2 | Planning complete | - |
| 5. Social Media Results | 1/1 | Complete | 2026-03-25 |
| 6. UI Polish & Responsive | 1/1 | Complete | 2026-03-25 |
