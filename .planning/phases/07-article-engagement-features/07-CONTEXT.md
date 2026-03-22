# Phase 7: Article Engagement Features - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Add social sharing, related articles, skeleton loading, and reading progress bar to the article page. These are engagement features layered on top of Phase 6's restructured article page.

</domain>

<decisions>
## Implementation Decisions

### Social Sharing (ART-03)
- **D-01:** Share buttons: Copy Link, X/Twitter, WhatsApp — three buttons in a horizontal row.
- **D-02:** Position: below article meta (after reading time), visible without scrolling.
- **D-03:** Copy Link shows brief "Copied!" toast/feedback on click.
- **D-04:** X/Twitter and WhatsApp open native share URLs in new tab.
- **D-05:** Style: icon buttons with `text-muted-foreground hover:text-primary`, 44px touch targets.
- **D-06:** Use Lucide icons (Link, Twitter/X icon, MessageCircle for WhatsApp) or simple SVGs.

### Related Articles (ART-05)
- **D-07:** Show 3-4 related articles at bottom of article, before footer.
- **D-08:** Use ArticleCard variant="standard" in a responsive grid (1-col mobile, 2-col tablet, 3-col desktop).
- **D-09:** Related articles fetched by same league or matching tags.
- **D-10:** Section heading: "Related Articles" using `font-display uppercase tracking-tight`.
- **D-11:** Empty state: hide section entirely if no related articles found.

### Skeleton Loading (ART-06)
- **D-12:** Article page shows skeleton placeholders while data loads.
- **D-13:** Skeleton for: hero image (full-width rectangle), meta area (badge + text lines), body (paragraph blocks).
- **D-14:** Use existing ArticleCardSkeleton for related articles section.
- **D-15:** Skeleton uses `bg-muted animate-pulse` pattern (consistent with all other skeletons).

### Reading Progress Bar (ART-07)
- **D-16:** Thin horizontal bar fixed at top of viewport showing scroll progress through article content.
- **D-17:** Color: `bg-primary` (pink/magenta) — 2-3px height.
- **D-18:** Only visible when reading the article body (not on scroll to related articles/footer).
- **D-19:** Respects `prefers-reduced-motion` — hidden when motion reduced.
- **D-20:** Client component using scroll event listener with throttle.

### Claude's Discretion
- Exact share URL formats for X/Twitter and WhatsApp
- Related articles algorithm (tag matching vs league matching vs both)
- Skeleton line widths and counts
- Progress bar scroll calculation (element-based vs page-based)
- Whether to use Suspense boundaries or loading states for skeleton

</decisions>

<canonical_refs>
## Canonical References

### Article Page (from Phase 6)
- `src/app/[locale]/article/[slug]/page.tsx` — Restructured article page composer
- `src/components/article/index.ts` — Barrel export for article sub-components
- `src/components/article/ArticleHero.tsx` — Hero with gradient overlay
- `src/components/article/ArticleMeta.tsx` — Date, reading time, league badge
- `src/components/article/ArticleBody.tsx` — Content rendering with ad slots

### Reusable Components
- `src/components/ArticleCard.tsx` — Use variant="standard" for related articles
- `src/components/ui/skeleton.tsx` — Base skeleton component

### UI/UX Pro Max Rules
- §2 `touch-target-size`: 44px min for share buttons
- §7 `duration-timing`: Progress bar animation 150-300ms
- §7 `loading-states`: Skeleton for operations >300ms
- §1 `reduced-motion`: Respect prefers-reduced-motion for progress bar

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ArticleCard` variant="standard" for related articles grid
- `ArticleCardSkeleton` variant="standard" for related articles loading
- `Skeleton` component for custom skeleton layouts
- `formatTimeAgo`, `formatDisplayDate` from date-utils

### Integration Points
- Share buttons integrate into ArticleMeta or as a standalone component below meta
- Related articles section goes after ArticleBody, before footer
- Progress bar is a fixed-position client component in the article layout
- Skeleton wraps the Suspense fallback for the article page

</code_context>

<specifics>
## Specific Ideas

- Share buttons should feel minimal — icons only, no labels, clean row
- Related articles should feel like "keep reading" encouragement, not a wall of cards
- Progress bar like The Athletic — thin, subtle, disappears when done

</specifics>

<deferred>
## Deferred Ideas

None — all features are within Phase 7 scope

</deferred>

---

*Phase: 07-article-engagement-features*
*Context gathered: 2026-03-22*
