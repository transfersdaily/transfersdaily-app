# TransfersDaily Admin Redesign — v1 Requirements

## v1 Requirements

### Dashboard Foundation (DASH)
- [ ] **DASH-01**: Admin sees a modern dashboard shell with sidebar navigation, header with pipeline status indicator, and responsive grid layout
- [x] **DASH-02**: Dashboard loads all KPIs via a single aggregated API call (not N+1 fetches) with server-side rendering and 5-minute cache
- [x] **DASH-03**: Admin sees content velocity KPIs — articles published today, this week, this month — with 7-day sparkline trends
- [x] **DASH-04**: Admin sees draft backlog count with visual indicator of processing rate
- [ ] **DASH-05**: Admin sees unread contact message count as a badge in the sidebar navigation

### Traffic & Audience Analytics (TRAF)
- [ ] **TRAF-01**: Admin sees a time-series chart of page views and sessions over configurable date range (24h, 7d, 30d, 90d)
- [ ] **TRAF-02**: Admin sees audience overview KPIs — total users, sessions, page views, avg session duration, bounce rate — from GA4 Data API with 1-hour cache
- [ ] **TRAF-03**: Admin sees top 10 most-viewed articles in last 24h, 7d, or 30d with view counts from GA4
- [ ] **TRAF-04**: Admin can switch date ranges across all analytics views using a shared date range selector

### Content Analytics (CONT)
- [ ] **CONT-01**: Admin sees article distribution by league as a bar/pie chart
- [ ] **CONT-02**: Admin sees article distribution by source as a bar chart
- [ ] **CONT-03**: Admin sees articles published per day as a time-series chart (last 30 days)
- [ ] **CONT-04**: Admin sees per-article view count in the articles list table (from GA4 page path matching)
- [ ] **CONT-05**: Admin sees translation coverage — grid showing article count by language, highlighting untranslated articles

### Pipeline & Error Monitoring (PIPE)
- [ ] **PIPE-01**: Admin sees pipeline health summary on the main dashboard — last run time, success rate, failure count badge
- [ ] **PIPE-02**: Admin sees error/failure log with actual error messages, source name, and timestamp for failed pipeline runs
- [ ] **PIPE-03**: Admin sees per-source pipeline stats — articles fetched, analyzed, saved, published per source
- [ ] **PIPE-04**: Admin sees source health heatmap — 10 sources x 7 days grid, color-coded by status

### Social Media Results (SOCL)
- [x] **SOCL-01**: Admin sees social media posting results — success/failure per platform (Twitter, Bluesky, Facebook, Threads) per article
- [x] **SOCL-02**: Admin sees aggregate social posting stats — posts attempted, succeeded, failed by platform over last 7/30 days

### UI/UX Premium Redesign (UXUI)
- [ ] **UXUI-01**: Admin dashboard uses UI/UX Pro Max design system — premium editorial aesthetic, not a basic template
- [x] **UXUI-02**: All charts use consistent design language with proper tooltips, legends, and responsive sizing
- [x] **UXUI-03**: All admin pages are mobile-responsive using CSS-first approach (no JS-based mobile detection)
- [x] **UXUI-04**: Loading states use skeleton screens instead of spinners
- [x] **UXUI-05**: Data tables support sorting, filtering, and pagination with consistent UX

## v2 Requirements (Deferred)
- Audience geography map (GA4 country data)
- Peak traffic hours heatmap (hour x day-of-week)
- League coverage balance indicator (content % vs traffic %)
- Content calendar view
- Smart alerts/notification center
- Exportable reports (CSV/PDF)
- Bulk operations expansion
- Pipeline live status indicator in header (polling)

## Out of Scope
- Multi-user roles and permissions — single admin, not needed
- WebSocket real-time dashboard — polling every 30-60s is sufficient
- Custom dashboard widget builder — one admin, one layout
- A/B testing dashboard — no testing infrastructure exists
- Revenue/ad metrics — no monetization yet
- SEO keyword tracking — requires third-party subscriptions
- AI content quality scoring — use engagement metrics as proxy
- Newsletter management UI — explicitly out of scope
- Dark mode toggle — one theme, ship it

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DASH-01 | Phase 1: Dashboard Foundation | Pending |
| DASH-02 | Phase 1: Dashboard Foundation | Complete |
| DASH-03 | Phase 1: Dashboard Foundation | Complete |
| DASH-04 | Phase 1: Dashboard Foundation | Complete |
| DASH-05 | Phase 1: Dashboard Foundation | Pending |
| UXUI-01 | Phase 1: Dashboard Foundation | Pending |
| UXUI-04 | Phase 1: Dashboard Foundation | Complete |
| TRAF-01 | Phase 2: Traffic & Audience Analytics | Pending |
| TRAF-02 | Phase 2: Traffic & Audience Analytics | Pending |
| TRAF-03 | Phase 2: Traffic & Audience Analytics | Pending |
| TRAF-04 | Phase 2: Traffic & Audience Analytics | Pending |
| CONT-01 | Phase 3: Content Analytics | Pending |
| CONT-02 | Phase 3: Content Analytics | Pending |
| CONT-03 | Phase 3: Content Analytics | Pending |
| CONT-04 | Phase 3: Content Analytics | Pending |
| CONT-05 | Phase 3: Content Analytics | Pending |
| PIPE-01 | Phase 4: Pipeline & Error Monitoring | Pending |
| PIPE-02 | Phase 4: Pipeline & Error Monitoring | Pending |
| PIPE-03 | Phase 4: Pipeline & Error Monitoring | Pending |
| PIPE-04 | Phase 4: Pipeline & Error Monitoring | Pending |
| SOCL-01 | Phase 5: Social Media Results | Complete |
| SOCL-02 | Phase 5: Social Media Results | Complete |
| UXUI-02 | Phase 6: UI Polish & Responsive | Complete |
| UXUI-03 | Phase 6: UI Polish & Responsive | Complete |
| UXUI-05 | Phase 6: UI Polish & Responsive | Complete |
