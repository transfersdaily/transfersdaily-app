# Phase 3: Card System & Component Consolidation - Research

**Researched:** 2026-03-22
**Domain:** React component architecture, variant-based card system, Next.js Image optimization
**Confidence:** HIGH

## Summary

Phase 3 replaces 4+ scattered card rendering patterns (TransferCard, SidebarArticleItem, homepage hero inline JSX, homepage LeagueSection inline JSX) with a single `ArticleCard` component using a `variant` prop (`hero | standard | compact | mini`). The project already has class-variance-authority (CVA) v0.7.1 installed and uses it in the existing Badge component, making it the natural tool for variant-based component architecture. The existing shadcn/ui primitives (Card, Skeleton, Badge) and `cn()` utility provide the foundation.

The codebase analysis reveals 5 consumer files and 4 source components to replace. The migration is well-scoped: all card rendering is presentational (data fetching happens upstream), and the `Transfer` type from `src/lib/api.ts` provides the data contract. The key complexity is preserving the TransferGrid ad insertion pattern (every 6 articles) while swapping the inner card component.

**Primary recommendation:** Build `ArticleCard` with CVA for variant styling, using the existing shadcn Card/Skeleton primitives internally. Implement as a server-compatible component (no `'use client'` directive needed since it is purely presentational). Migrate consumers one-by-one with visual diff verification.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Hero variant -- full-bleed image with gradient overlay, title + excerpt + badge over image. Used for homepage featured article.
- **D-02:** Standard variant -- vertical card with 16:9 image on top, badge + title + excerpt + time below. Used in grid pages (latest, league, search).
- **D-03:** Compact variant -- horizontal row with 128x80 thumbnail left, title + time right. Used in homepage league section rows.
- **D-04:** Mini variant -- horizontal row with 64x64 square thumbnail left, title + badge + time right. Used in sidebar recommended articles.
- **D-05:** 16:9 aspect ratio for Standard card images (aspect-video).
- **D-06:** League indicated by text badge with league brand color -- `text-[10px] font-bold uppercase tracking-wide px-2 py-0.5` pill.
- **D-07:** Card surface uses `bg-card border border-border rounded-lg` -- no glassmorphism, no backdrop-blur, no gradient borders. Clean flat dark surfaces.
- **D-08:** Hover effect: `translateY(-2px)` + image `scale(1.03)` over 200ms ease-out. Title color transitions to `text-primary`. No shadow changes on OLED black bg.
- **D-09:** `cursor-pointer` on all card variants.
- **D-10:** Single `ArticleCard` component with `variant` prop (`'hero' | 'standard' | 'compact' | 'mini'`).
- **D-11:** Props: `variant`, `title`, `href`, `imageUrl?`, `league?`, `timeAgo?`, `excerpt?` (hero+standard only), `priority?` (image loading priority for hero).
- **D-12:** Matching `ArticleCardSkeleton` component with same `variant` prop. Each variant has a skeleton that mirrors exact layout dimensions to prevent CLS.
- **D-13:** Each variant has a matching skeleton using `animate-pulse` on `bg-muted` elements.
- **D-14:** Skeleton mirrors exact layout dimensions of the real card (image placeholder, text line widths) to prevent CLS.
- **D-15:** Images below fold use `loading="lazy"`. Hero image uses `priority={true}`.
- **D-16:** `TransferCard.tsx` -> `ArticleCard variant="standard"` (TransferGrid, latest, league, search pages)
- **D-17:** `SidebarArticleItem.tsx` -> `ArticleCard variant="mini"` (Sidebar recommended)
- **D-18:** Homepage `LeagueSection` inline JSX -> `ArticleCard variant="compact"` (Homepage league rows)
- **D-19:** Homepage hero inline JSX -> `ArticleCard variant="hero"` (Homepage featured)
- **D-20:** `TransferCardSkeleton` / `TransferGridSkeleton` -> `ArticleCardSkeleton variant="standard"` + grid wrapper

### Claude's Discretion
- Exact Tailwind class composition per variant (spacing, font sizes within the established scale)
- Internal component structure (sub-components vs conditional rendering)
- Image fallback design when no imageUrl provided
- Exact skeleton line widths and counts per variant
- Whether to keep TransferGrid as a wrapper or replace with a generic grid utility

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DS-01 | Consolidated reusable card component system (article cards, league cards, transfer cards) replacing scattered one-off components | Full component API defined (D-10/D-11), 4 variants specified (D-01 to D-04), migration map complete (D-16 to D-20), skeleton system (D-12 to D-14) |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| class-variance-authority | 0.7.1 | Variant-based component styling | Already used in Badge component; standard for multi-variant components with TypeScript support |
| clsx | 2.1.1 | Conditional class composition | Already used via `cn()` utility |
| tailwind-merge | 3.3.1 | Merge Tailwind classes without conflicts | Already used via `cn()` utility |
| next/image | 15.3.5 (Next.js) | Optimized image rendering with lazy loading | Already used in all existing card components |
| next/link | 15.3.5 (Next.js) | Client-side navigation | Already used for card linking |

### Supporting (Already Installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-slot | 1.2.3 | Polymorphic component rendering | If ArticleCard needs asChild pattern (not required for this phase) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CVA | Direct conditional classes | CVA provides type-safe variants and cleaner separation; already in project |
| Custom skeleton | react-loading-skeleton | Overkill; existing Skeleton primitive with animate-pulse/shimmer is sufficient |

**Installation:** No new packages needed. Everything is already installed.

## Architecture Patterns

### Recommended Project Structure
```
src/components/
  ArticleCard.tsx         # Single file: ArticleCard + ArticleCardSkeleton
  TransferGrid.tsx        # Keep: update to use ArticleCard internally
  TransferCard.tsx        # DELETE after migration
  TransferCardSkeleton.tsx # DELETE after migration
  SidebarArticleItem.tsx  # DELETE after migration
```

### Pattern 1: CVA Variant Component with Compound Rendering
**What:** Single `ArticleCard` component using CVA for base/variant classes with conditional JSX blocks per variant.
**When to use:** When variants share common props but differ significantly in layout structure.
**Example:**
```typescript
// src/components/ArticleCard.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

const articleCardVariants = cva(
  "group cursor-pointer overflow-hidden transition-all duration-200 ease-out", // base
  {
    variants: {
      variant: {
        hero: "relative rounded-lg h-full",
        standard: "flex flex-col h-full bg-card border border-border rounded-lg hover:-translate-y-0.5",
        compact: "flex gap-3 p-3 rounded-lg hover:bg-card/80 transition-colors",
        mini: "flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors",
      },
    },
    defaultVariants: {
      variant: "standard",
    },
  }
)

interface ArticleCardProps extends VariantProps<typeof articleCardVariants> {
  title: string
  href: string
  imageUrl?: string
  league?: string
  timeAgo?: string
  excerpt?: string       // hero + standard only
  priority?: boolean     // image loading priority (hero)
  className?: string
}
```

### Pattern 2: Image Fallback with Muted Placeholder
**What:** When no `imageUrl` is provided, render a muted background with league initial or generic icon.
**When to use:** Any card variant missing an image.
**Example:**
```typescript
function CardImage({ imageUrl, alt, league, ...props }: {
  imageUrl?: string; alt: string; league?: string;
  className?: string; sizes?: string; priority?: boolean;
  width?: number; height?: number; fill?: boolean;
}) {
  if (!imageUrl) {
    return (
      <div className={cn("bg-muted flex items-center justify-center", props.className)}>
        <span className="text-muted-foreground text-sm font-bold">
          {league?.charAt(0)?.toUpperCase() || 'T'}
        </span>
      </div>
    )
  }
  return (
    <Image
      src={imageUrl}
      alt={alt}
      className={cn("object-cover group-hover:scale-[1.03] transition-transform duration-200", props.className)}
      {...props}
    />
  )
}
```

### Pattern 3: League Badge with Brand Color
**What:** League name displayed as a small colored pill badge using league CSS variables.
**When to use:** On all card variants that show league info.
**Example:**
```typescript
function LeagueBadge({ league }: { league: string }) {
  // Map league names to CSS variable-based colors
  const leagueColorMap: Record<string, string> = {
    'Premier League': 'bg-league-premier-league',
    'La Liga': 'bg-league-la-liga',
    'Serie A': 'bg-league-serie-a',
    'Bundesliga': 'bg-league-bundesliga',
    'Ligue 1': 'bg-league-ligue-1',
  }
  const bgClass = leagueColorMap[league] || 'bg-primary'

  return (
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm text-white",
      bgClass
    )}>
      {league}
    </span>
  )
}
```

### Anti-Patterns to Avoid
- **Separate files per variant:** Do NOT create HeroCard.tsx, StandardCard.tsx, etc. The whole point is a single component with a `variant` prop.
- **Passing raw Transfer objects:** Cards receive flat props (`title`, `href`, `imageUrl`), not data models. This keeps cards purely presentational.
- **Shadow changes on hover:** The OLED black background makes shadow-based elevation changes invisible or ugly. Use translateY + scale only (D-08).
- **Using `'use client'` unnecessarily:** ArticleCard is presentational with no hooks or event handlers beyond Link navigation. It can be a server component unless a specific consumer needs client interactivity.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Variant class management | Manual if/else class strings | CVA `cva()` + `VariantProps` | Type-safe, readable, matches Badge pattern |
| Class merging | String concatenation | `cn()` (clsx + tailwind-merge) | Handles conflicts correctly |
| Image optimization | Custom lazy loading | Next.js `Image` with `sizes` + `priority` | Handles srcset, lazy loading, format negotiation |
| Skeleton animation | Custom CSS animation | Existing `Skeleton` component (shimmer) | Already styled with shimmer keyframe |
| Loading states | Custom loading spinners | `ArticleCardSkeleton` with variant prop | Exact layout match prevents CLS |

**Key insight:** This phase is purely a component consolidation. Every building block already exists in the project. The work is composing them into a single, consistent API.

## Common Pitfalls

### Pitfall 1: CLS from Skeleton Dimension Mismatch
**What goes wrong:** Skeleton renders at different dimensions than the real card, causing layout shift when data loads.
**Why it happens:** Skeleton placeholders use approximate sizes instead of matching exact aspect ratios and padding.
**How to avoid:** Each skeleton variant must use identical outer dimensions, aspect ratios, and padding as its real counterpart. Use `aspect-video` for standard image placeholder, fixed `h-[420px]` for hero, `w-32 h-20` for compact thumbnail, `w-16 h-16` for mini thumbnail.
**Warning signs:** Visible "jump" when content loads, CLS score degradation in Lighthouse.

### Pitfall 2: Breaking TransferGrid Ad Insertion
**What goes wrong:** Ad slots inserted every 6 articles stop rendering correctly after swapping TransferCard for ArticleCard.
**Why it happens:** TransferGrid.tsx has specific grid span logic (`col-span-1 md:col-span-2 lg:col-span-3`) for ad rows that depends on the card being in a `col-span-1` wrapper.
**How to avoid:** Keep TransferGrid as the grid wrapper. Only swap the inner `<TransferCard>` call to `<ArticleCard variant="standard">`. Do not change the grid/ad logic.
**Warning signs:** Ads rendering inline with cards instead of spanning full width, or ads disappearing entirely.

### Pitfall 3: Locale URL Construction Leaking into Card
**What goes wrong:** Card component starts constructing URLs internally using locale, making it context-dependent.
**Why it happens:** Current TransferCard receives `href` as a pre-built URL, but SidebarArticleItem constructs `/${locale}/article/${slug}` internally.
**How to avoid:** ArticleCard always receives a pre-built `href` string. URL construction happens in the consumer, not the card.
**Warning signs:** Card component importing locale-related modules.

### Pitfall 4: Image `sizes` Prop Misconfiguration
**What goes wrong:** Images load at wrong resolution, either too large (wasting bandwidth) or too small (blurry).
**Why it happens:** `sizes` prop not updated to match the card's actual rendered width at each breakpoint.
**How to avoid:** Set `sizes` per variant:
  - Hero: `(max-width: 768px) 100vw, 66vw` (2/3 of 10-col grid)
  - Standard: `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw` (3-col grid)
  - Compact: `128px` (fixed thumbnail)
  - Mini: `64px` (fixed thumbnail)
**Warning signs:** Network tab showing 1200px images for 64px thumbnails.

### Pitfall 5: Hover State on Touch Devices
**What goes wrong:** `hover:-translate-y-0.5` causes sticky hover states on mobile that look broken.
**Why it happens:** Touch devices trigger hover on tap and don't reliably remove it.
**How to avoid:** Use `@media (hover: hover)` for the translateY effect, or use Tailwind's built-in `hover:` modifier which respects `@media (hover: hover)` in modern browsers. The `scale(1.03)` on images is fine since it's inside `overflow-hidden`.
**Warning signs:** Cards appearing "stuck" in lifted state on mobile Safari.

## Code Examples

### ArticleCard Component Structure (Recommended)
```typescript
// src/components/ArticleCard.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// --- Variant styles ---
const cardVariants = cva(
  "group cursor-pointer transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        hero: "relative rounded-lg overflow-hidden h-full",
        standard: [
          "flex flex-col h-full overflow-hidden",
          "bg-card border border-border rounded-lg",
          "hover:-translate-y-0.5",
        ].join(" "),
        compact: "flex gap-3 p-3 rounded-lg hover:bg-card/80 transition-colors",
        mini: "flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors",
      },
    },
    defaultVariants: { variant: "standard" },
  }
)

// --- Props ---
export interface ArticleCardProps extends VariantProps<typeof cardVariants> {
  title: string
  href: string
  imageUrl?: string
  league?: string
  timeAgo?: string
  excerpt?: string
  priority?: boolean
  className?: string
}

// --- Main component ---
export function ArticleCard({
  variant = "standard",
  title,
  href,
  imageUrl,
  league,
  timeAgo,
  excerpt,
  priority = false,
  className,
}: ArticleCardProps) {
  return (
    <Link href={href} className={cn("block", variant === "standard" && "h-full")}>
      <article className={cn(cardVariants({ variant }), className)}>
        {variant === "hero" && (
          <HeroLayout title={title} imageUrl={imageUrl} league={league}
            timeAgo={timeAgo} excerpt={excerpt} priority={priority} />
        )}
        {variant === "standard" && (
          <StandardLayout title={title} imageUrl={imageUrl} league={league}
            timeAgo={timeAgo} excerpt={excerpt} />
        )}
        {variant === "compact" && (
          <CompactLayout title={title} imageUrl={imageUrl} timeAgo={timeAgo} />
        )}
        {variant === "mini" && (
          <MiniLayout title={title} imageUrl={imageUrl} league={league} timeAgo={timeAgo} />
        )}
      </article>
    </Link>
  )
}
```

### Skeleton Component Structure
```typescript
export function ArticleCardSkeleton({
  variant = "standard",
}: {
  variant?: "hero" | "standard" | "compact" | "mini"
}) {
  if (variant === "hero") {
    return <Skeleton className="w-full h-full rounded-lg" />
  }
  if (variant === "standard") {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-card border border-border rounded-lg">
        <Skeleton className="aspect-video w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    )
  }
  if (variant === "compact") {
    return (
      <div className="flex gap-3 p-3">
        <Skeleton className="w-32 h-20 flex-shrink-0 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    )
  }
  // mini
  return (
    <div className="flex gap-3 p-3">
      <Skeleton className="w-16 h-16 flex-shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}
```

### TransferGrid Migration (Minimal Change)
```typescript
// TransferGrid.tsx -- only change: swap TransferCard for ArticleCard
import { ArticleCard } from '@/components/ArticleCard'

// Inside the forEach loop, replace:
//   <TransferCard title={...} excerpt={...} primaryBadge={...} ... />
// With:
//   <ArticleCard variant="standard" title={...} excerpt={...} league={...} ... />
```

### Homepage Hero Migration
```typescript
// In page.tsx hero section, replace inline JSX with:
<ArticleCard
  variant="hero"
  title={featuredTransfer.title}
  href={`/${locale}/article/${featuredTransfer.slug}`}
  imageUrl={featuredTransfer.imageUrl}
  league={featuredTransfer.league}
  timeAgo={formatTimeAgo(featuredTransfer.publishedAt, t)}
  excerpt={featuredTransfer.excerpt}
  priority
/>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Per-component styling | CVA variant-based styling | CVA 0.7.x (stable) | Type-safe variants, cleaner than conditionals |
| Custom loading spinners | Skeleton components matching layout | 2023+ standard | CLS prevention, better perceived performance |
| `loading="lazy"` attribute | Next.js Image auto-lazy + priority prop | Next.js 13+ | Automatic optimization, just set `priority` for above-fold |

**Deprecated/outdated:**
- The existing `TransferCard` uses `hover:shadow-xl` and `duration-300`/`duration-500` which conflict with D-07 (no shadow changes) and D-08 (200ms timing). The new component corrects these.
- The existing `SidebarArticleItem` accepts a raw `Transfer` object -- the new component receives flat props for better separation.

## Open Questions

1. **Keep TransferGrid or replace with generic ArticleGrid?**
   - What we know: TransferGrid handles ad insertion every 6 articles, uses 3-column responsive grid, accepts Transfer[] + locale + dict.
   - What's unclear: Whether renaming to ArticleGrid is desired now or deferred. The ad insertion pattern is TransferGrid's unique responsibility.
   - Recommendation: Keep TransferGrid for now (avoid scope creep). Update it internally to use ArticleCard. Renaming is cosmetic and can happen in a later cleanup pass.

2. **Side articles in hero section (the 2 smaller overlay cards)**
   - What we know: Homepage hero grid has 2 smaller side articles (lines 294-329 in page.tsx) that use the same overlay pattern as hero but at smaller scale.
   - What's unclear: These are not a 5th variant -- they look like a smaller hero. Should they use `variant="hero"` with a size modifier, or stay as inline JSX?
   - Recommendation: Use `variant="hero"` for these as well. The hero variant should adapt to its container size via CSS (fills parent height/width). The grid layout controls sizing, not the card.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None configured (no test framework detected) |
| Config file | none -- see Wave 0 |
| Quick run command | `npm run build` (type-check + build verification) |
| Full suite command | `npm run build` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DS-01 | ArticleCard renders 4 variants correctly | manual + build | `npm run build` | N/A -- no test framework |
| DS-01 | Existing pages render without errors after migration | smoke | `npm run build && npm run dev` (manual verify) | N/A |
| DS-01 | No visual regressions on homepage, latest, league, search, sidebar | manual | Visual comparison in browser | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (catches TypeScript errors, broken imports)
- **Per wave merge:** `npm run build` + manual visual check of all 5 consumer pages
- **Phase gate:** Full build green + visual verification across homepage, latest, league, search, sidebar

### Wave 0 Gaps
- No test framework is configured. Given project constraints ("Full test suite" is out of scope per REQUIREMENTS.md), validation relies on TypeScript build checks and manual visual verification.
- Build verification (`npm run build`) is the primary automated gate.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis of all 4 source components: TransferCard.tsx, TransferCardSkeleton.tsx, SidebarArticleItem.tsx, TransferGrid.tsx
- Direct codebase analysis of all 5 consumer files: page.tsx (homepage), RecommendedArticles.tsx, LatestPageClient.tsx, LeaguePageClient.tsx, SearchPageClient.tsx
- Direct analysis of design system files: globals.css, tailwind.config.js, typography.ts
- Existing CVA usage in src/components/ui/badge.tsx (establishes the variant pattern)
- package.json verified versions: CVA 0.7.1, Next.js 15.3.5, React 19, clsx 2.1.1, tailwind-merge 3.3.1

### Secondary (MEDIUM confidence)
- CVA documentation for variant composition patterns (well-established library, stable API)

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed and in use in the project
- Architecture: HIGH - CVA variant pattern already established in Badge component; card props clearly defined in CONTEXT.md
- Pitfalls: HIGH - derived from direct analysis of existing code (ad insertion, locale URLs, image sizes, skeleton dimensions)

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (stable -- no external dependencies or fast-moving APIs)
