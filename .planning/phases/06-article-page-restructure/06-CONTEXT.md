# Phase 6: Article Page Restructure - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Restructure the article detail page with hero imagery, reading time, breadcrumb navigation, and component decomposition. No engagement features (sharing, related articles, progress bar) — those are Phase 7.

</domain>

<decisions>
## Implementation Decisions

### Hero Image (ART-01)
- **D-01:** Full-width hero image at top of article with gradient overlay (`bg-gradient-to-t from-black/90 via-black/40 to-transparent`), matching homepage hero pattern.
- **D-02:** League badge overlaid on hero image using existing `LeagueBadge` pattern from ArticleCard.
- **D-03:** Article title displayed over gradient in `font-display uppercase tracking-tight` (consistent with site headings).
- **D-04:** Hero image uses Next.js Image with `priority={true}` and `sizes="100vw"` for above-fold optimization.
- **D-05:** Fallback when no image: show `bg-card` container with title only (no gradient).

### Reading Time (ART-02)
- **D-06:** Calculate from content length at ~200 words per minute, rounded up.
- **D-07:** Display format: "5 min read" with a clock icon (Lucide `Clock`).
- **D-08:** Position: near the article title/metadata area, below the hero.
- **D-09:** Style: `font-sans text-sm text-muted-foreground` with icon.

### Breadcrumb Navigation (ART-04)
- **D-10:** Path structure: Home > League Name > Article Title (truncated to ~50 chars).
- **D-11:** Each segment is a navigable link except the current article title.
- **D-12:** Style: `font-sans text-xs text-muted-foreground` with `/` or `>` separators.
- **D-13:** Position: above the hero image, inside the container.

### Component Decomposition (ART-08)
- **D-14:** Extract `ArticleHero` — hero image + gradient + title overlay.
- **D-15:** Extract `ArticleMeta` — author, date, reading time, league badge, transfer details.
- **D-16:** Extract `ArticleBreadcrumb` — breadcrumb navigation.
- **D-17:** Extract `ArticleBody` — article content rendering (HTML to JSX).
- **D-18:** Place extracted components in `src/components/article/` subfolder.
- **D-19:** Main page.tsx becomes a slim composer under 200 lines.
- **D-20:** Migrate any remaining `TransferCard` usage to `ArticleCard`.
- **D-21:** Data fetching stays in page.tsx — section components receive data as props.

### Claude's Discretion
- Exact gradient opacity values for hero overlay
- Reading time icon size and exact placement
- Breadcrumb truncation logic details
- Whether to use a `<nav>` with `aria-label="Breadcrumb"` or simpler markup
- Component file naming within `article/` subfolder
- How to handle articles without a league (e.g., general news)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Current Article Page
- `src/app/[locale]/article/[slug]/page.tsx` — Current article page (716 lines). Monolithic, has inline rendering.
- `src/app/[locale]/article/[slug]/ArticleClientComponents.tsx` — Client-side article components (sharing, interactions).

### Components to Reuse
- `src/components/ArticleCard.tsx` — 4 CVA variants. Use for related articles (replacing TransferCard).
- `src/components/ads/AdSlot.tsx` — Already used in article page for ad placements.
- `src/components/Sidebar.tsx` — Sidebar with Recommended + Trending + Most Searched.

### Design System
- `src/lib/typography.ts` — Typography tokens: article.title, article.subtitle, article.body, article.meta
- `src/app/globals.css` — CSS custom properties, dark theme
- `tailwind.config.js` — Theme config

### Homepage Section Pattern (reference for decomposition)
- `src/components/sections/HeroSection.tsx` — Example of extracted section component (79 lines)
- `src/components/sections/LatestSection.tsx` — Example of slim section component (51 lines)

### UI/UX Pro Max Rules Applied
- §3 `image-optimization`: Hero image with srcset/sizes, priority loading
- §3 `content-jumping`: Fixed hero height prevents CLS
- §9 `breadcrumb-web`: Breadcrumbs for 3+ level deep hierarchies
- §6 `line-length`: Article body max-width 65ch for readability
- §5 `content-priority`: Core content first on mobile

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ArticleCard` variant="standard" — for related articles at bottom
- `AdSlot` — already wired in article page (paragraph-1, paragraph-3, after-article)
- `Sidebar` — sidebar with 3 sections
- `typography.article` — title, subtitle, body, meta classes
- `formatDisplayDate`, `formatTimeAgo` from `date-utils.ts`

### Established Patterns
- Server-side data fetching in page.tsx → props to components
- `createTranslator(dict)` for i18n
- `font-display` for all headings, `font-sans` for body
- Hero gradient overlay pattern from homepage HeroSection

### Integration Points
- Article page uses `transfersApi` for fetching article data
- Related articles currently use old `TransferCard` — migrate to `ArticleCard`
- `ArticleClientComponents` handles client-side interactions — keep separate
- AdSlot placements already configured in `AD_SLOTS.ARTICLE`

</code_context>

<specifics>
## Specific Ideas

- Article hero should feel like The Athletic article pages — large image, title over gradient, immersive
- Reading time helps readers decide whether to commit — show it prominently
- Breadcrumbs help with navigation context, especially when coming from search/external links
- Decomposition follows the same pattern as Phase 5 homepage — sections/ subfolder approach

</specifics>

<deferred>
## Deferred Ideas

- Social sharing buttons — Phase 7 (ART-03)
- Related articles section — Phase 7 (ART-05)
- Skeleton loading states — Phase 7 (ART-06)
- Reading progress bar — Phase 7 (ART-07)

</deferred>

---

*Phase: 06-article-page-restructure*
*Context gathered: 2026-03-22*
