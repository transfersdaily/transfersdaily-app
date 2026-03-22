# Roadmap: TransfersDaily UX/UI Overhaul

## Overview

This roadmap transforms TransfersDaily from a generic blog template into a premium sports media experience. The journey starts with foundational design tokens and theming, then progressively rebuilds the site chrome, card system, and ad infrastructure before tackling the two major page redesigns (homepage and article). After the core pages are rebuilt, engagement features and animations layer polish on top, with a dedicated mobile optimization pass to close it out. Every phase builds on a stable foundation from the previous one.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Design Tokens & Theming** - Establish typography, color system, dark/light mode, and responsive spacing as the design foundation
- [ ] **Phase 2: Navigation & Site Chrome** - Redesign navbar, footer, and search experience used across every page
- [ ] **Phase 3: Card System & Component Consolidation** - Build reusable card component system replacing scattered one-off components
- [ ] **Phase 4: Ad System Overhaul** - Consolidate 12 ad components into one, add CLS safety, lazy loading, and real validation
- [ ] **Phase 5: Homepage Redesign** - Rebuild homepage with hero section, category feeds, trending widget, and ISR performance
- [ ] **Phase 6: Article Page Restructure** - Decompose article page and implement hero images, reading time, and breadcrumbs
- [ ] **Phase 7: Article Engagement Features** - Add social sharing, related articles, skeleton loading, and reading progress bar
- [ ] **Phase 8: Animation System** - Implement micro-animation system with framer-motion across all public pages
- [ ] **Phase 9: Mobile Experience Optimization** - Touch targets, swipeable carousels, collapsing header, and bottom navigation

## Phase Details

### Phase 1: Design Tokens & Theming
**Goal**: Every public page draws from a unified typography scale, branded color palette, consistent dark/light mode, and responsive spacing system
**Depends on**: Nothing (first phase)
**Requirements**: DS-02, DS-03, DS-04, DS-05
**Success Criteria** (what must be TRUE):
  1. Headlines, body text, captions, and metadata render with distinct, intentional sizes and weights across all public pages
  2. The site uses a branded color palette that is visually distinct from default shadcn/ui gray tones
  3. Toggling between dark and light mode produces a polished, consistent appearance on every public page with no broken or unstyled elements
  4. Spacing, container widths, and grid layouts respond predictably across mobile, tablet, and desktop breakpoints
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Branded color palette + Newsreader/Roboto fonts + dark mode tokens
- [ ] 01-02-PLAN.md — Editorial typography scale + spacing/animation/z-index tokens

### Phase 2: Navigation & Site Chrome
**Goal**: Visitors navigate the site through a modern, clean navbar with intuitive search and a well-organized footer
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. The public navbar has a modern sports media look with clear hierarchy, branding, and league/category links
  2. The footer is organized with distinct sections (about, leagues, legal) and consistent styling with the rest of the site
  3. Search provides immediate visual feedback (loading state, results preview, empty state) and is accessible from every page
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md — Restyle navbar and footer with Phase 1 design tokens, active state, skip-to-content, accessibility
- [ ] 02-02-PLAN.md — Command palette search (Cmd+K) with instant autocomplete and navbar integration

### Phase 3: Card System & Component Consolidation
**Goal**: A single, composable card component system renders articles, leagues, and transfers consistently across the entire site
**Depends on**: Phase 1
**Requirements**: DS-01
**Success Criteria** (what must be TRUE):
  1. Article cards, league cards, and transfer cards all render using variants of a shared card component system
  2. Scattered one-off card components in the codebase are replaced by the new system with no visual regressions
  3. Cards display consistently in lists, grids, and featured positions across homepage, category pages, and search results
**Plans**: 2 plans

Plans:
- [ ] 03-01-PLAN.md — Build ArticleCard + ArticleCardSkeleton with CVA variants (hero, standard, compact, mini) and wire into TransferGrid
- [ ] 03-02-PLAN.md — Migrate all consumers (homepage hero/league sections, sidebar, latest/league/search pages) to ArticleCard

### Phase 4: Ad System Overhaul
**Goal**: A single configurable AdSlot component handles all ad placements across the site with no layout shift and intelligent display logic
**Depends on**: Phase 1
**Requirements**: DS-07, AD-01, AD-02, AD-03
**Success Criteria** (what must be TRUE):
  1. All 12 duplicate ad components (AdInContent1/2/3, AdSidebar, AdBanner, etc.) are replaced by a single AdSlot component with placement configuration
  2. Ad containers reserve their height before loading, producing zero cumulative layout shift when ads render
  3. Ad slots below the fold lazy-load and do not block initial page render or hurt Core Web Vitals
  4. shouldShowAds() returns a real validation result based on content quality rather than always returning true
**Plans**: 2 plans

Plans:
- [ ] 04-01-PLAN.md — Build AdSlot component with CLS reservation, lazy loading, and shouldShowAds() validation
- [ ] 04-02-PLAN.md — Migrate all consumers to AdSlot and delete 12 old ad component files

### Phase 5: Homepage Redesign
**Goal**: The homepage presents transfer news with strong visual hierarchy, category-based feeds, trending content, and fast server-rendered performance
**Depends on**: Phase 2, Phase 3, Phase 4
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06
**Success Criteria** (what must be TRUE):
  1. The homepage features a visually prominent hero section highlighting the latest or most important transfer story
  2. Transfer feeds are organized by category (confirmed, rumors, completed) so readers can scan the type of news they care about
  3. A trending/popular sidebar or widget surfaces high-engagement articles
  4. The homepage renders via ISR with revalidation instead of force-dynamic, producing faster page loads
  5. The homepage page file is decomposed from 925+ lines into composed section components under 200 lines total
**Plans**: 2 plans

Plans:
- [ ] 05-01-PLAN.md — Decompose homepage into section components (HeroSection, LatestSection, LeagueSection) and switch to ISR
- [ ] 05-02-PLAN.md — Add TrendingArticles sidebar widget and verify mobile layout

### Phase 6: Article Page Restructure
**Goal**: The article reading experience feels premium with hero imagery, clear metadata, and a well-structured, maintainable codebase
**Depends on**: Phase 2, Phase 3, Phase 4
**Requirements**: ART-01, ART-02, ART-04, ART-08
**Success Criteria** (what must be TRUE):
  1. Article pages open with a hero image and gradient overlay that creates visual impact
  2. Reading time is displayed prominently near the article title so readers know the commitment before scrolling
  3. Breadcrumb navigation shows the path (Home > League > Article) and allows quick back-navigation
  4. The article page file is decomposed from 726+ lines into clean sub-components (header, body, sidebar, related) with the main file under 200 lines
**Plans**: 2 plans

Plans:
- [ ] 06-01-PLAN.md — Extract ArticleHero, ArticleMeta, ArticleBreadcrumb, ArticleBody components with hero gradient, reading time, and breadcrumbs
- [ ] 06-02-PLAN.md — Recompose page.tsx as slim composer and migrate TransferCard to ArticleCard

### Phase 7: Article Engagement Features
**Goal**: Readers engage longer with articles through sharing tools, related content, smooth loading, and visible reading progress
**Depends on**: Phase 6
**Requirements**: ART-03, ART-05, ART-06, ART-07
**Success Criteria** (what must be TRUE):
  1. Readers can share an article via copy link, X/Twitter, or WhatsApp with one tap from a visible sharing UI
  2. A related articles section at the bottom of each article displays relevant content using the card system, encouraging continued reading
  3. Article content and images show skeleton loading states instead of blank space while data loads
  4. A sticky progress bar at the top of the viewport shows how far the reader has scrolled through the article
**Plans**: 2 plans

Plans:
- [ ] 07-01-PLAN.md — ShareButtons and ReadingProgressBar client components wired into article page
- [ ] 07-02-PLAN.md — Article skeleton loading state and related articles league filtering

### Phase 8: Animation System
**Goal**: Public pages feel polished and responsive with subtle micro-animations that enhance the experience without slowing it down
**Depends on**: Phase 5, Phase 7
**Requirements**: DS-06
**Success Criteria** (what must be TRUE):
  1. Page transitions between routes are smooth rather than hard-cutting
  2. Cards reveal with subtle entrance animations when scrolled into view
  3. Interactive elements (buttons, links, cards) have polished hover and focus states with motion feedback
  4. Users with reduced-motion preferences see no animations (respects prefers-reduced-motion)
**Plans**: 2 plans

Plans:
- [ ] 08-01-PLAN.md — Install framer-motion and create MotionCard + PageTransition animation primitives
- [ ] 08-02-PLAN.md — Wire animations into all card grids and locale layout with visual verification

### Phase 9: Mobile Experience Optimization
**Goal**: The 65-75% of visitors on mobile devices have a fast, touch-friendly, native-feeling browsing experience
**Depends on**: Phase 5, Phase 7
**Requirements**: MOB-01, MOB-02, MOB-03, MOB-04, MOB-05
**Success Criteria** (what must be TRUE):
  1. All interactive elements (buttons, links, cards, nav items) meet 48px minimum tap target size throughout public pages
  2. Article and transfer card collections are browsable via horizontal swipe carousels on mobile
  3. The header collapses when scrolling down and reappears when scrolling up, maximizing content area
  4. A bottom navigation bar provides quick access to key sections (Home, Leagues, Search, Latest) on mobile
  5. All public page layouts are responsive-first and render correctly from 320px to 1440px+ without horizontal scrolling
**Plans**: TBD

Plans:
- [ ] 09-01: TBD
- [ ] 09-02: TBD
- [ ] 09-03: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 > 2 > 3 > 4 > 5 > 6 > 7 > 8 > 9
Note: Phases 3 and 4 depend only on Phase 1 (not Phase 2) and could run in parallel. Phases 5 and 6 can run in parallel. Phases 8 and 9 can run in parallel.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design Tokens & Theming | 0/2 | Planning complete | - |
| 2. Navigation & Site Chrome | 2/2 | Complete | 2026-03-18 |
| 3. Card System & Component Consolidation | 2/2 | Complete | 2026-03-22 |
| 4. Ad System Overhaul | 1/2 | In progress | - |
| 5. Homepage Redesign | 0/2 | Planning complete | - |
| 6. Article Page Restructure | 2/2 | Complete | 2026-03-22 |
| 7. Article Engagement Features | 0/2 | Planning complete | - |
| 8. Animation System | 0/2 | Planning complete | - |
| 9. Mobile Experience Optimization | 0/? | Not started | - |

---
*Roadmap created: 2026-03-17*
*Last updated: 2026-03-22*
