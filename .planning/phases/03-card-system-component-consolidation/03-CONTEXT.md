# Phase 3: Card System & Component Consolidation - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a single, composable ArticleCard component system with 4 variants (hero, standard, compact, mini) that replaces all scattered article card patterns across the site. Includes matching skeleton loading states for each variant. No page layout changes — just the card component system and swapping existing card code to use it.

</domain>

<decisions>
## Implementation Decisions

### Card Variants (4 total)
- **D-01:** Hero variant — full-bleed image with gradient overlay, title + excerpt + badge over image. Used for homepage featured article.
- **D-02:** Standard variant — vertical card with 16:9 image on top, badge + title + excerpt + time below. Used in grid pages (latest, league, search).
- **D-03:** Compact variant — horizontal row with 128×80 thumbnail left, title + time right. Used in homepage league section rows.
- **D-04:** Mini variant — horizontal row with 64×64 square thumbnail left, title + badge + time right. Used in sidebar recommended articles.

### Visual Styling
- **D-05:** 16:9 aspect ratio for Standard card images (aspect-video).
- **D-06:** League indicated by text badge with league brand color — `text-[10px] font-bold uppercase tracking-wide px-2 py-0.5` pill.
- **D-07:** Card surface uses `bg-card border border-border rounded-lg` — no glassmorphism, no backdrop-blur, no gradient borders. Clean flat dark surfaces.
- **D-08:** Hover effect: `translateY(-2px)` + image `scale(1.03)` over 200ms ease-out. Title color transitions to `text-primary`. No shadow changes on OLED black bg.
- **D-09:** `cursor-pointer` on all card variants.

### Component API
- **D-10:** Single `ArticleCard` component with `variant` prop (`'hero' | 'standard' | 'compact' | 'mini'`).
- **D-11:** Props: `variant`, `title`, `href`, `imageUrl?`, `league?`, `timeAgo?`, `excerpt?` (hero+standard only), `priority?` (image loading priority for hero).
- **D-12:** Matching `ArticleCardSkeleton` component with same `variant` prop. Each variant has a skeleton that mirrors exact layout dimensions to prevent CLS.

### Skeleton & Loading States
- **D-13:** Each variant has a matching skeleton using `animate-pulse` on `bg-muted` elements.
- **D-14:** Skeleton mirrors exact layout dimensions of the real card (image placeholder, text line widths) to prevent CLS.
- **D-15:** Images below fold use `loading="lazy"`. Hero image uses `priority={true}`.

### Migration / Replacement Map
- **D-16:** `TransferCard.tsx` → `ArticleCard variant="standard"` (TransferGrid, latest, league, search pages)
- **D-17:** `SidebarArticleItem.tsx` → `ArticleCard variant="mini"` (Sidebar recommended)
- **D-18:** Homepage `LeagueSection` inline JSX → `ArticleCard variant="compact"` (Homepage league rows)
- **D-19:** Homepage hero inline JSX → `ArticleCard variant="hero"` (Homepage featured)
- **D-20:** `TransferCardSkeleton` / `TransferGridSkeleton` → `ArticleCardSkeleton variant="standard"` + grid wrapper

### Claude's Discretion
- Exact Tailwind class composition per variant (spacing, font sizes within the established scale)
- Internal component structure (sub-components vs conditional rendering)
- Image fallback design when no imageUrl provided
- Exact skeleton line widths and counts per variant
- Whether to keep TransferGrid as a wrapper or replace with a generic grid utility

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Current Card Components (to replace)
- `src/components/TransferCard.tsx` — Current standard vertical card. Study props and rendering.
- `src/components/TransferCardSkeleton.tsx` — Current skeleton + TransferGridSkeleton. Study dimensions.
- `src/components/SidebarArticleItem.tsx` — Current sidebar mini card. Study layout and link behavior.
- `src/components/TransferGrid.tsx` — Grid wrapper with in-feed ads. Study ad insertion pattern.

### Current Card Consumers (to migrate)
- `src/app/[locale]/page.tsx` — Homepage: hero section (inline JSX), LeagueSection (inline JSX), TransferGrid usage
- `src/components/RecommendedArticles.tsx` — Sidebar: uses SidebarArticleItem
- `src/components/LatestPageClient.tsx` — Latest page: uses TransferCard via TransferGrid
- `src/components/LeaguePageClient.tsx` — League page: uses TransferCard via TransferGrid
- `src/components/SearchPageClient.tsx` — Search page: uses TransferCard

### Design System
- `src/app/globals.css` — CSS custom properties: `--card`, `--border`, `--muted`, `--primary`, league color vars
- `src/lib/typography.ts` — Typography scale: card-relevant text sizes and weights
- `tailwind.config.js` — Tailwind theme: colors, fonts, spacing, border-radius
- `design-system/transfersdaily/MASTER.md` — Global design system: Editorial Grid/Magazine style, OLED Dark, effects

### UI/UX Pro Max Rules Applied
- §1 Accessibility: `color-contrast` (4.5:1 badge text), `alt-text` (image alt), `heading-hierarchy`
- §2 Touch: `touch-target-size` (44px min for card tap area), `cursor-pointer`
- §3 Performance: `lazy-loading` (below-fold images), `content-jumping` (skeleton CLS prevention), `image-dimension` (aspect-ratio)
- §4 Style: `elevation-consistent` (no random shadows), `state-clarity` (distinct hover), `dark-mode-pairing`
- §6 Typography: `weight-hierarchy` (bold titles, regular body), `color-semantic` (league color tokens), `line-height` (1.5+ for body)
- §7 Animation: `duration-timing` (200ms hover), `transform-performance` (translateY + scale only), `loading-states` (skeleton)

### Phase 1 Context (inherited decisions)
- `.planning/phases/01-design-tokens-theming/01-CONTEXT.md` — Color tokens, typography scale, OLED dark mode, spacing system, animation tokens

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/card.tsx` — shadcn/ui Card + CardContent primitives. ArticleCard can use these internally.
- `src/components/ui/badge.tsx` — shadcn/ui Badge. Can be used for league badges.
- `src/components/ui/skeleton.tsx` — shadcn/ui Skeleton with animate-pulse. Use for ArticleCardSkeleton.
- `src/lib/date-utils.ts` — `formatTimeAgo()` function. Cards receive pre-formatted timeAgo string.
- `src/lib/api.ts` — `Transfer` type defines the data shape cards consume.

### Established Patterns
- CSS variables (HSL) in globals.css → Tailwind config → components consume via `bg-card`, `text-foreground`, etc.
- `cn()` utility from clsx + tailwind-merge for conditional class composition
- Next.js `Image` component with `sizes` prop for responsive images
- `Link` wrapping entire card for navigation (existing pattern in TransferCard)
- League color vars already defined: `--premier-league`, `--la-liga`, `--serie-a`, `--bundesliga`, `--ligue-1`

### Integration Points
- `TransferGrid` handles ad insertion every 6 articles — this pattern must be preserved during migration
- All card consumers pass `locale` for URL construction (`/${locale}/article/${slug}`)
- Dictionary/translation system (`t()`) used for time formatting — cards receive pre-formatted strings
- Homepage `getInitialData()` fetches data server-side — card component is purely presentational

</code_context>

<specifics>
## Specific Ideas

- Cards should feel clean and editorial — flat dark surfaces, no decorative effects, content-first
- League color badges are the primary visual accent on cards — make them pop against the dark background
- The Athletic and ESPN FC card patterns are the reference — minimal, image-led, scannable
- Hover state should feel responsive but not dramatic — subtle lift, not bouncy
- UI/UX Pro Max "Editorial Grid / Magazine" style: asymmetric grid, print-inspired typography, large imagery
- UI/UX Pro Max "Dark Mode (OLED)" style: deep black, high contrast 7:1+, minimal glow, vibrant accents

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-card-system-component-consolidation*
*Context gathered: 2026-03-22*
