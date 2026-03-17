# Architecture Research

**Domain:** Design system consolidation + interactive features for sports media blog
**Researched:** 2026-03-17
**Confidence:** HIGH

## System Overview

```
+-----------------------------------------------------------------------+
|                     Next.js 15 App Router                              |
|  +------------------------------------------------------------------+ |
|  |                  Page Layer (Server Components)                    | |
|  |  +-----------+  +------------+  +-----------+  +---------------+  | |
|  |  | HomePage  |  | ArticlePage|  | LeaguePage|  | TransferPages |  | |
|  |  +-----+-----+  +-----+------+  +-----+-----+  +------+------+  | |
|  |        |               |               |                |         | |
|  +--------+---------------+---------------+----------------+---------+ |
|           |               |               |                |           |
|  +--------v---------------v---------------v----------------v---------+ |
|  |               Section Composition Layer                           | |
|  |  +----------+ +----------+ +----------+ +-----------+ +--------+ | |
|  |  | HeroSect | | FeedSect | | LeaguNav | | Engagement| | AdSlot | | |
|  |  +----+-----+ +----+-----+ +----+-----+ +-----+-----+ +---+---+ | |
|  +-------+-----------+-----------+----------+-----+----------+-+-----+ |
|           |           |           |                |            |       |
|  +--------v-----------v-----------v----------------v------------v----+ |
|  |                  Design System Layer                              | |
|  |  +--------+ +--------+ +--------+ +--------+ +--------+          | |
|  |  |  Card  | | Badge  | | Button | | Layout | |  Typo  |          | |
|  |  +--------+ +--------+ +--------+ +--------+ +--------+          | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  |              Client-Side Interactive Layer                        | |
|  |  +--------------+ +----------------+ +-------------------------+ | |
|  |  | VotingEngine | | RatingEngine   | | EngagementWidgets       | | |
|  |  | (localStorage)| (localStorage) | | (client components)     | | |
|  |  +--------------+ +----------------+ +-------------------------+ | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  |              Ad Management Layer                                  | |
|  |  +------------+ +-------------+ +------------------+              | |
|  |  | AdSlot     | | AdConfig    | | AdPlacement      |              | |
|  |  | (unified)  | | (lib/ads.ts)| | (layout-aware)   |              | |
|  |  +------------+ +-------------+ +------------------+              | |
|  +------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| Page Components | Data fetching (server), SEO metadata, section orchestration | Section Components, API layer |
| Section Components | Layout of a discrete page section (hero, feed, league nav) | Design System primitives, Ad slots |
| Design System Layer | Visual primitives: cards, badges, buttons, typography tokens | Nothing upstream; consumed by everything |
| Interactive Layer | Client-side voting, rating, engagement state | localStorage, Design System for UI |
| Ad Management Layer | Unified ad slot rendering, placement decisions | Page layout, Ad config |

## Recommended Project Structure

The key change is introducing a `components/sections/` layer between pages and primitives, and a `components/interactive/` directory for the new engagement features.

```
src/
├── components/
│   ├── ui/                          # shadcn/ui primitives (keep as-is)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── design-system/               # NEW: Composed design tokens + patterns
│   │   ├── article-card.tsx         # Replaces inline card JSX everywhere
│   │   ├── article-card-featured.tsx # Hero card variant
│   │   ├── article-card-compact.tsx # Sidebar/list variant
│   │   ├── section-header.tsx       # "Latest Transfers" header + accent bar
│   │   ├── page-layout.tsx          # Main content + sidebar grid wrapper
│   │   ├── content-grid.tsx         # Responsive article grid with ad slot support
│   │   ├── league-badge.tsx         # League logo + name pill
│   │   ├── transfer-meta.tsx        # Fee, clubs, date metadata line
│   │   └── index.ts                 # Barrel export
│   ├── sections/                    # NEW: Page section compositions
│   │   ├── hero-section.tsx         # Featured article hero (extracted from homepage)
│   │   ├── article-feed-section.tsx # Generic feed section (latest, trending, completed)
│   │   ├── league-browser-section.tsx # League grid navigation
│   │   ├── article-body-section.tsx # Article content + inline ads
│   │   ├── related-articles-section.tsx
│   │   └── newsletter-section.tsx   # Move from components root
│   ├── interactive/                 # NEW: Client-side engagement features
│   │   ├── player-rating.tsx        # Star/slider rating widget
│   │   ├── transfer-vote.tsx        # "Better transfer?" A vs B voting
│   │   ├── transfer-ranking.tsx     # Leaderboard/ranking display
│   │   ├── vote-results.tsx         # Results visualization (bar chart)
│   │   ├── engagement-sidebar.tsx   # Sidebar widget aggregating interactive features
│   │   └── hooks/
│   │       ├── use-vote.ts          # localStorage voting logic
│   │       ├── use-rating.ts        # localStorage rating logic
│   │       └── use-engagement-store.ts # Shared engagement state
│   ├── ads/                         # REFACTORED: Unified ad system
│   │   ├── ad-slot.tsx              # Single unified component replacing 12 variants
│   │   ├── ad-config.ts             # Slot IDs, placement rules, validation
│   │   └── index.ts
│   ├── layout/                      # NEW: Structural layout components
│   │   ├── client-navbar.tsx        # Moved, enhanced
│   │   ├── footer.tsx               # Moved, enhanced
│   │   ├── mobile-bottom-nav.tsx    # Moved
│   │   └── sidebar.tsx              # Public sidebar wrapper
│   └── ...                          # Existing admin/ and publishing/ stay
├── lib/
│   ├── design-tokens.ts             # NEW: Spacing, color semantics, breakpoints
│   ├── typography.ts                # EXISTS: Enhanced with article reading tokens
│   ├── ads.ts                       # EXISTS: Enhanced with validation logic
│   └── ...
└── hooks/
    └── ...
```

### Structure Rationale

- **design-system/:** These are composed components built from shadcn/ui primitives. An `article-card` composes `Card`, `Badge`, `Image`, and typography tokens into a single reusable unit. This eliminates the 50+ lines of inline JSX repeated across the homepage for every card variant.
- **sections/:** Each section is a self-contained block that a page can compose. The homepage currently has 925 lines because it manually builds each section inline. Extracting to sections drops it to ~150 lines of section composition.
- **interactive/:** All new engagement features are client components. They share a common localStorage-based state pattern. Isolating them keeps the server component tree clean.
- **ads/ (refactored):** The current 12 ad components (AdBanner, AdInContent1, AdInContent2, AdInContent3, AdSidebar, AdSidebar2, etc.) all do the same thing with different slot IDs. A single `AdSlot` component with a `placement` prop replaces them all.

## Architectural Patterns

### Pattern 1: Server-First Section Composition

**What:** Pages are thin server components that compose extracted section components, passing server-fetched data as props. Sections handle their own layout and ad placement.

**When to use:** Every public-facing page.

**Trade-offs:** Keeps pages readable and testable. Adds one more layer of abstraction, but worth it given 900+ line pages.

**Example:**
```typescript
// src/app/[locale]/page.tsx — AFTER decomposition (~120 lines)
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const data = await getInitialData(locale);

  return (
    <PageLayout locale={locale} sidebar={<HomeSidebar locale={locale} dict={dict} />}>
      <HeroSection
        featured={data.featuredTransfer}
        secondary={data.latestTransfers.slice(0, 2)}
        locale={locale}
        dict={dict}
      />
      <ArticleFeedSection
        title={t('homepage.latestTransfers')}
        articles={data.latestTransfers.slice(2, 8)}
        viewAllHref={`/${locale}/latest`}
        locale={locale}
        dict={dict}
        adPlacement="after-row-1"
      />
      <LeagueBrowserSection leagues={data.leagues} locale={locale} />
      <ArticleFeedSection
        title={t('homepage.completedTransfers')}
        articles={data.completedTransfers}
        viewAllHref={`/${locale}/transfers/completed`}
        locale={locale}
        dict={dict}
        adPlacement="between-rows"
      />
      <ArticleFeedSection
        title={t('homepage.trendingArticles')}
        articles={data.trendingTransfers}
        viewAllHref={`/${locale}/latest`}
        locale={locale}
        dict={dict}
        adPlacement="between-rows"
      />
      <NewsletterSection locale={locale} dict={dict} />
    </PageLayout>
  );
}
```

### Pattern 2: Unified Ad Slot with Placement-Aware Rendering

**What:** Replace 12 distinct ad components with a single `AdSlot` that takes a `placement` prop (e.g., `"homepage-header"`, `"article-paragraph-3"`, `"sidebar-top"`) and resolves the correct slot ID from configuration.

**When to use:** Everywhere ads appear.

**Trade-offs:** Centralizes ad logic, makes A/B testing placement trivial, simplifies component tree. Requires migrating all 12 components to the new pattern.

**Example:**
```typescript
// src/components/ads/ad-slot.tsx
'use client';

interface AdSlotProps {
  placement: string;        // e.g., "homepage.POST_HERO", "article.PARAGRAPH_3"
  format?: 'auto' | 'rectangle' | 'leaderboard' | 'skyscraper';
  className?: string;
}

export function AdSlot({ placement, format = 'auto', className }: AdSlotProps) {
  const [page, position] = placement.split('.');
  const slotId = getAdSlot(page as keyof typeof AD_SLOTS, position);

  if (!shouldShowAd(placement)) return null; // Real validation logic

  return (
    <div className={cn('ad-container', className)} data-ad-placement={placement}>
      <ins
        className="adsbygoogle"
        data-ad-client={AD_CONFIG.CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

### Pattern 3: localStorage Engagement Engine

**What:** Anonymous voting and rating using localStorage for state persistence, with a hook-based API for components to read/write votes. No backend required.

**When to use:** Player ratings, transfer voting, any anonymous engagement feature.

**Trade-offs:** No cross-device sync, vulnerable to localStorage clearing, limited analytics. But zero-friction for users (no login) and zero backend changes required.

**Example:**
```typescript
// src/components/interactive/hooks/use-vote.ts
'use client';

interface VoteState {
  votes: Record<string, 'a' | 'b'>;    // matchupId -> choice
  ratings: Record<string, number>;       // entityId -> rating value
  timestamps: Record<string, number>;    // entityId -> when voted
}

const STORAGE_KEY = 'td-engagement';
const VOTE_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useVote(matchupId: string) {
  const [state, setState] = useState<VoteState>(() => loadState());

  const hasVoted = state.votes[matchupId] !== undefined;
  const currentVote = state.votes[matchupId];

  const castVote = useCallback((choice: 'a' | 'b') => {
    if (hasVoted) return; // Already voted

    setState(prev => {
      const next = {
        ...prev,
        votes: { ...prev.votes, [matchupId]: choice },
        timestamps: { ...prev.timestamps, [matchupId]: Date.now() },
      };
      saveState(next);
      return next;
    });
  }, [matchupId, hasVoted]);

  return { hasVoted, currentVote, castVote };
}

function loadState(): VoteState {
  if (typeof window === 'undefined') return { votes: {}, ratings: {}, timestamps: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { votes: {}, ratings: {}, timestamps: {} };
  } catch {
    return { votes: {}, ratings: {}, timestamps: {} };
  }
}

function saveState(state: VoteState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* localStorage full or unavailable */ }
}
```

### Pattern 4: Safe Component Decomposition via Extract-Wrap-Replace

**What:** A three-step process for breaking apart monolithic components without regression:

1. **Extract:** Copy a section of JSX into a new component file. Pass all referenced variables as props. Do not change any logic.
2. **Wrap:** Import the new component back into the original file. Render it in place of the extracted JSX. Verify behavior is identical.
3. **Replace:** Once all sections are extracted, the original file becomes a thin composition of imported sections.

**When to use:** Any component over 300 lines, especially the 925-line homepage and 726-line article page.

**Trade-offs:** Slow and methodical, but zero-risk. Each step is independently verifiable. Avoids the "big bang rewrite" trap.

**Decomposition map for the homepage (925 lines):**

| Lines | Current Content | Extract To |
|-------|----------------|------------|
| 1-30 | Imports + config | Keep in page |
| 32-211 | generateMetadata + SEO | Keep in page (server function) |
| 218-236 | Data fetching setup | Keep in page |
| 238-350 | Structured data JSON-LD | Extract: `lib/structured-data.ts` |
| 353-498 | Hero section (featured + side cards) | Extract: `sections/hero-section.tsx` |
| 500-536 | Latest transfers feed | Extract: `sections/article-feed-section.tsx` |
| 542-580 | League browser grid | Extract: `sections/league-browser-section.tsx` |
| 582-621 | Completed transfers feed | Reuse: `sections/article-feed-section.tsx` |
| 623-663 | Trending transfers feed | Reuse: `sections/article-feed-section.tsx` |
| 665-688 | Newsletter + sidebar + ads | Compose from existing components |
| 692-925 | `getInitialData()` server function | Extract: `lib/homepage-data.ts` |

**After decomposition, the page file should be ~120-150 lines.**

**Decomposition map for the article page (726 lines):**

| Lines | Current Content | Extract To |
|-------|----------------|------------|
| 1-66 | Imports, types, helpers | Keep types, extract helper |
| 68-170 | `getArticleBySlug()` server function | Extract: `lib/article-data.ts` |
| ~170-350 | generateMetadata with structured data | Keep metadata, extract JSON-LD to `lib/structured-data.ts` |
| ~350-500 | Article header (image, title, meta) | Extract: `sections/article-header-section.tsx` |
| ~500-600 | Article body with inline ads | Extract: `sections/article-body-section.tsx` |
| ~600-726 | Related articles, sidebar | Extract: `sections/related-articles-section.tsx` |

## Data Flow

### Voting/Rating Data Flow (Client-Side Only)

```
User taps "Rate Player" or "Vote on Transfer"
    |
    v
[Interactive Widget] (client component, 'use client')
    |
    v
[useVote() / useRating() hook]
    |-- reads --> localStorage (check if already voted)
    |-- writes --> localStorage (persist vote)
    |-- returns --> { hasVoted, currentVote, castVote }
    |
    v
[Widget re-renders] --> shows results / thank you state
```

**Key design decisions for voting data flow:**

1. **No optimistic UI needed** -- localStorage writes are synchronous, so state updates are instant.
2. **Vote deduplication** -- Check `hasVoted` before rendering the vote form. Show results immediately for returning visitors.
3. **Vote aggregation** -- For displaying "X% voted for Player A," there are two approaches:
   - **Phase 1 (client-only):** Show only the user's own vote with a static display. No aggregated counts.
   - **Phase 2 (if backend added later):** POST votes to an API, fetch aggregated results. The hook interface stays the same; only the storage backend changes.
4. **Rating persistence** -- Ratings are stored as `{ [articleId]: number }`. A 1-10 scale works for player ratings.

### Article Page Data Flow (Existing + New Interactive Features)

```
Server: getArticleBySlug(slug, locale)
    |
    v
[ArticlePage] (server component)
    |-- renders --> ArticleHeaderSection (server)
    |-- renders --> ArticleBodySection (server, with ad slots)
    |-- renders --> PlayerRatingWidget (client, island)
    |-- renders --> TransferVoteWidget (client, island)
    |-- renders --> RelatedArticlesSection (server)
    |-- renders --> Sidebar with EngagementSidebar (client)
    |
    v
Client hydrates only the interactive islands
```

### Ad Placement Data Flow

```
[Page Layout]
    |-- passes --> placement="homepage.POST_HERO"
    |
    v
[AdSlot component] (client)
    |-- reads --> AD_SLOTS config (lib/ads.ts)
    |-- evaluates --> shouldShowAd(placement) logic
    |-- renders --> <ins class="adsbygoogle" ... /> or null
```

### Key Data Flows

1. **Page render:** Server fetches data via direct API call to backend, passes to section components as props, sections compose design system primitives. No prop drilling deeper than 2 levels.
2. **Interactive engagement:** Client components mount as islands within server-rendered pages. They read/write localStorage independently. No interaction with the server data flow.
3. **Ad placement:** Ad slots are rendered as client components within server-rendered section layouts. They self-configure from the centralized AD_SLOTS config.

## Build Order (Dependencies)

The suggested build order reflects actual dependencies between components. Each phase builds on the previous.

### Phase A: Design System Foundation (no dependencies)

Build the composed design system components first. These are consumed by everything else.

1. `design-system/section-header.tsx` -- Extracted pattern: title + accent bar (used 5+ times on homepage)
2. `design-system/article-card.tsx` -- The core card component, replaces all inline card JSX
3. `design-system/article-card-featured.tsx` -- Hero variant with overlay text
4. `design-system/article-card-compact.tsx` -- Sidebar/list variant
5. `design-system/page-layout.tsx` -- Main + sidebar grid wrapper
6. `design-system/content-grid.tsx` -- Responsive grid with ad slot injection points
7. `design-system/transfer-meta.tsx` -- Metadata line (fee, clubs, date)
8. `design-system/league-badge.tsx` -- League logo + name

### Phase B: Ad System Consolidation (depends on A for layout integration)

1. `ads/ad-slot.tsx` -- Single unified component
2. `ads/ad-config.ts` -- Enhanced config with validation, `shouldShowAd()` implementation
3. Migrate all 12 ad component usages to `<AdSlot placement="..." />`
4. Delete old ad components

### Phase C: Section Extraction (depends on A, B)

1. Extract `lib/homepage-data.ts` (data fetching function)
2. Extract `lib/structured-data.ts` (JSON-LD generation)
3. Build `sections/hero-section.tsx` using design system cards
4. Build `sections/article-feed-section.tsx` (generic, reusable for latest/trending/completed)
5. Build `sections/league-browser-section.tsx`
6. Recompose homepage from sections (~120 lines)
7. Extract article page sections similarly
8. Extract league page, search page

### Phase D: Interactive Features (depends on A for UI, independent of B/C)

1. Build `interactive/hooks/use-vote.ts` and `use-rating.ts`
2. Build `interactive/player-rating.tsx` -- star/slider widget
3. Build `interactive/transfer-vote.tsx` -- A vs B comparison widget
4. Build `interactive/vote-results.tsx` -- results bar chart
5. Build `interactive/transfer-ranking.tsx` -- leaderboard
6. Build `interactive/engagement-sidebar.tsx` -- sidebar aggregation
7. Integrate into article page as client islands

### Phase E: Page Recomposition (depends on C, D)

1. Rewrite homepage using sections + interactive widgets
2. Rewrite article page using sections + interactive widgets
3. Update league/search/transfer pages
4. Mobile optimization pass across all new components

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (low traffic) | localStorage voting is fine. force-dynamic on homepage is wasteful but works. |
| 1k-10k daily visitors | Switch homepage from `force-dynamic` to ISR with 60-second revalidation. Dramatically reduces server load. |
| 10k-100k daily visitors | Voting needs a backend -- localStorage-only means no aggregated results to show other users. Add a simple vote counter API. Consider edge caching for article pages. |

### Scaling Priorities

1. **First bottleneck: Homepage rendering.** Currently `force-dynamic` with `revalidate = 0`, meaning every visitor triggers a fresh server render + API call. Switch to ISR (`revalidate = 60`) to serve cached pages. This is the single biggest performance win available.
2. **Second bottleneck: Vote aggregation.** Once interactive features exist, users will want to see "85% voted for Player X." This requires server-side vote storage. Defer until traffic justifies it -- the hook-based architecture makes swapping localStorage for an API call trivial.

## Anti-Patterns

### Anti-Pattern 1: Inline JSX Duplication Across Pages

**What people do:** Copy-paste card JSX from the homepage into the league page, article page, etc., with slight modifications each time.
**Why it's wrong:** The homepage currently has the same card pattern repeated 3 times with minor differences (featured, side cards, grid cards). Changes require updating every instance. Styling drifts.
**Do this instead:** Build `article-card` variants in the design system. Use props for size/layout differences. One component, many configurations.

### Anti-Pattern 2: Data Fetching in Page Components

**What people do:** Write 200+ lines of fetch logic directly in `page.tsx` files (see current homepage lines 692-925).
**Why it's wrong:** Pages become untestable, unreadable, and impossible to reuse data fetching logic across pages.
**Do this instead:** Extract data fetching into `lib/` files. Pages call a single function and pass results to sections.

### Anti-Pattern 3: One Ad Component Per Slot

**What people do:** Create `AdInContent1`, `AdInContent2`, `AdInContent3` as separate component files that differ only in their slot ID.
**Why it's wrong:** 12 nearly-identical files. Adding a new slot means creating a new file. Changing ad behavior requires editing 12 files.
**Do this instead:** Single `AdSlot` component with a `placement` prop that resolves to the correct slot ID from centralized config.

### Anti-Pattern 4: Premature Client Components

**What people do:** Mark entire page sections as `'use client'` because one small interactive element needs client-side state.
**Why it's wrong:** Loses server-rendering benefits for the entire subtree. Increases JavaScript bundle.
**Do this instead:** Keep sections as server components. Embed interactive features as small client component islands (e.g., `<PlayerRatingWidget articleId={id} />` within a server-rendered article body).

### Anti-Pattern 5: Big Bang Component Rewrite

**What people do:** Rewrite a 900-line component from scratch in a new file, trying to get everything right at once.
**Why it's wrong:** High risk of regression. Hard to review. Blocks other work until complete.
**Do this instead:** Use the Extract-Wrap-Replace pattern. Extract one section at a time. Each extraction is a small, reviewable change.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Google AdSense | Client-side `<ins>` tags with dynamic slot IDs | Must load AdSense script once in root layout. Unified `AdSlot` component handles all placements. |
| Plausible Analytics | Script tag in root layout | Track custom events for votes/ratings via `plausible()` function calls in interactive hooks. |
| AWS Backend API | Server-side fetch in `lib/` data functions | No changes needed. Interactive features bypass the API entirely (client-side only). |
| CloudFront/S3 Images | `next/image` with `processImageUrl()` | No changes needed. Design system card components use existing image handling. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Page <-> Section | Props (server data) | Sections receive data as props. No context needed. |
| Section <-> Design System | Props (display data) | Design system components are pure visual. No data fetching. |
| Page <-> Interactive Widgets | Props (entity IDs only) | Widgets receive an `articleId` or `matchupId`. They handle their own state via localStorage. |
| Interactive Hooks <-> localStorage | Direct read/write | Single storage key `td-engagement` with structured JSON. Hooks abstract the storage layer. |
| Ad System <-> Page Layout | `placement` prop string | Sections embed `<AdSlot placement="..." />` at predetermined positions. Ad config determines whether to render. |

## Sources

- Codebase analysis: `src/app/[locale]/page.tsx` (925 lines), `src/app/[locale]/article/[slug]/page.tsx` (726 lines)
- Codebase analysis: `src/components/ads/` (12 components, 1 index barrel)
- Codebase analysis: `src/lib/ads.ts` (ad slot configuration)
- Codebase analysis: `src/lib/typography.ts` (existing design tokens)
- Next.js 15 App Router architecture: server/client component model (HIGH confidence, well-documented pattern)
- localStorage API for anonymous engagement: standard web API (HIGH confidence)
- shadcn/ui composition patterns: component library conventions (HIGH confidence)

---
*Architecture research for: TransfersDaily UX/UI Overhaul*
*Researched: 2026-03-17*
