# Phase 5: Homepage Redesign - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Decompose the homepage into clean section components, add a trending articles sidebar widget, optimize mobile layout, and switch from force-dynamic to ISR. Keep existing league-based sections (no category feeds). Hero section already done in Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Section Structure (HOME-01 already done, HOME-02 skipped)
- **D-01:** Keep existing hero section as-is — already uses ArticleCard variant="hero" from Phase 3. No redesign needed.
- **D-02:** Keep existing league sections (Premier League, La Liga, Serie A, Bundesliga, Ligue 1) with ArticleCard variant="compact". No category-based feeds.
- **D-03:** Keep existing "Latest Transfers" grid with ArticleCard variant="standard" via TransferGrid.

### Trending Sidebar Widget (HOME-03)
- **D-04:** Add a "Trending Articles" section to the sidebar — top 5 articles sorted by view count or engagement.
- **D-05:** Uses ArticleCard variant="mini" for each trending article.
- **D-06:** Sits above or below the existing "Recommended Articles" section in the sidebar.
- **D-07:** Falls back gracefully to empty state if no trending data available, using `t('sidebar.noTrendingArticles')`.

### Mobile Layout (HOME-04)
- **D-08:** Single column on mobile — hero stacks vertically, league feeds go full-width.
- **D-09:** Sidebar content (recommended, trending, most searched) moves below main content on mobile. Already handled by `lg:grid-cols-10` responsive grid.
- **D-10:** Touch targets 44px+ on all interactive elements (already enforced by Phase 1 tokens).

### Component Decomposition (HOME-05)
- **D-11:** Extract `HeroSection` component — hero grid with featured article + side articles.
- **D-12:** Extract `LatestSection` component — "Latest Transfers" heading + TransferGrid.
- **D-13:** `LeagueSection` already exists as a local function — extract to own file.
- **D-14:** Main page.tsx becomes a slim composer that imports sections, fetches data, and renders the layout. Target: under 150 lines.
- **D-15:** Each extracted section component should be under 150 lines.
- **D-16:** Data fetching (`getInitialData`) stays in page.tsx as a server function — section components receive data as props.

### ISR Performance (HOME-06)
- **D-17:** Remove `export const dynamic = 'force-dynamic'` and `export const revalidate = 0`.
- **D-18:** Add `export const revalidate = 300` (5-minute ISR revalidation).
- **D-19:** Keep `generateStaticParams` for locale-based static generation.
- **D-20:** All data fetching stays server-side — no client-side fetching on homepage.

### Claude's Discretion
- Exact file names for extracted section components
- Whether to co-locate section components in a `sections/` subfolder or keep in `components/`
- Trending articles data source (API endpoint or reuse existing)
- Exact trending widget placement relative to other sidebar sections
- ISR revalidation timing (300s is the target, can adjust if needed)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Current Homepage
- `src/app/[locale]/page.tsx` — Current homepage (471 lines). Contains hero, latest, league sections, sidebar, data fetching.

### Components Already Built (Phase 3 + 4)
- `src/components/ArticleCard.tsx` — 4 CVA variants: hero, standard, compact, mini + skeletons
- `src/components/TransferGrid.tsx` — Grid wrapper using ArticleCard standard + in-feed ads
- `src/components/ads/AdSlot.tsx` — Unified ad component with placement strings

### Sidebar Components
- `src/components/Sidebar.tsx` — Renders RecommendedArticles + TrendingTopics
- `src/components/RecommendedArticles.tsx` — Client-side, fetches articles via API
- `src/components/TrendingTopics.tsx` — Client-side, fetches most searched terms

### Design System
- `src/lib/typography.ts` — Typography tokens: section.title, heading.h2, body.base
- `src/app/globals.css` — CSS custom properties, ad slot styles
- `tailwind.config.js` — Theme config with font-display, spacing, etc.

### UI/UX Pro Max Rules Applied
- News/Media Platform: Hero-Centric Design + Feature-Rich
- §3 `content-jumping`: Reserve space for async content (ISR helps with this)
- §3 `lazy-loading`: Below-fold images lazy-loaded
- §5 `mobile-first`: Single-column mobile layout
- §5 `content-priority`: Core content first on mobile

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ArticleCard` (hero/standard/compact/mini) — all card rendering needs covered
- `ArticleCardSkeleton` — matching skeletons per variant
- `TransferGrid` — grid layout with in-feed ad insertion
- `AdSlot` — ad placement with collapse-on-empty
- `ViewAllButton` — consistent "View All" link styling
- `Sidebar` — wraps RecommendedArticles + TrendingTopics

### Established Patterns
- Server-side data fetching in page.tsx → pass as props to components
- `createTranslator(dict)` for i18n → `t()` function
- `formatTimeAgo()` for relative dates
- `font-display` for all headings, `font-sans` for body
- `text-sm text-muted-foreground` for empty states

### Integration Points
- `getInitialData(language)` fetches featured, latest, and per-league articles
- Sidebar receives `locale` + `dict` props
- Layout uses `lg:grid-cols-10` with col-span-7 main + col-span-3 sidebar

</code_context>

<specifics>
## Specific Ideas

- Homepage should feel like a sports news dashboard — scannable sections, clear hierarchy
- The Athletic / ESPN FC remain the reference points for visual style
- ISR at 5 minutes is a good balance between freshness and performance for a news site
- Component decomposition should make future homepage changes much easier (Phase 7+ features)

</specifics>

<deferred>
## Deferred Ideas

- Category-based feeds (confirmed/rumors/completed) — could be added as a future enhancement
- Homepage engagement widgets (polls, voting) — Phase 7+ v2 features

</deferred>

---

*Phase: 05-homepage-redesign*
*Context gathered: 2026-03-22*
