# Phase 9: Mobile Experience Optimization - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Optimize mobile experience: 48px touch targets, swipeable carousels, collapsing sticky header, bottom navigation bar, and responsive-first layouts from 320px to 1440px+.

</domain>

<decisions>
## Implementation Decisions

### Touch Targets (MOB-01)
- **D-01:** Audit all interactive elements for 48px minimum tap target.
- **D-02:** Use `min-h-[48px] min-w-[48px]` or padding to ensure touch targets.
- **D-03:** Minimum 8px gap between adjacent touch targets.
- **D-04:** Focus on: navbar links, card tap areas, buttons, pagination, sidebar links.

### Swipeable Carousels (MOB-02)
- **D-05:** Article card collections on mobile use horizontal swipe carousel.
- **D-06:** Apply to: homepage latest grid, league section articles on mobile.
- **D-07:** Show partial next card as affordance (peek effect).
- **D-08:** Use CSS scroll-snap for native smooth scrolling (no heavy JS library).
- **D-09:** No dots/indicators — the peek effect is sufficient affordance.

### Collapsing Header (MOB-03)
- **D-10:** Navbar hides on scroll down, reappears on scroll up.
- **D-11:** Transition: translateY with 200ms ease-out.
- **D-12:** Only on mobile (< 768px). Desktop navbar stays fixed.
- **D-13:** Uses scroll direction detection via scroll event listener with threshold (10px minimum scroll to trigger).

### Bottom Navigation (MOB-04)
- **D-14:** Fixed bottom nav bar on mobile with 4-5 items: Home, Leagues, Search, Latest.
- **D-15:** Icons + labels (per UI/UX Pro Max §9: nav-label-icon).
- **D-16:** Active state highlighted with primary color.
- **D-17:** Bottom nav replaces the mobile hamburger menu for primary navigation.
- **D-18:** Hidden on desktop (lg: breakpoint and above).
- **D-19:** Existing `MobileBottomNav.tsx` component can be restyled/enhanced.

### Responsive Layouts (MOB-05)
- **D-20:** All public pages work from 320px to 1440px+ without horizontal scrolling.
- **D-21:** Test breakpoints: 320px (small phone), 375px (iPhone), 768px (tablet), 1024px (laptop), 1440px (desktop).
- **D-22:** Content priority on mobile: core content first, sidebar below.

### Claude's Discretion
- Exact carousel implementation (CSS scroll-snap vs embla-carousel vs custom)
- Scroll direction detection algorithm details
- Bottom nav icon choices (Lucide icons)
- Which pages get carousels vs which stay as stacked cards on mobile
- Whether to keep hamburger menu as secondary nav alongside bottom nav

</decisions>

<canonical_refs>
## Canonical References

### Navigation
- `src/components/navbar.tsx` — Current navbar (add collapsing behavior)
- `src/components/MobileBottomNav.tsx` — Existing bottom nav (restyle/enhance)

### Pages to Optimize
- `src/app/[locale]/page.tsx` — Homepage (carousels for latest/league sections)
- `src/components/sections/LatestSection.tsx` — Latest grid (carousel on mobile)
- `src/components/sections/LeagueSection.tsx` — League sections (carousel on mobile)
- `src/components/LatestPageClient.tsx` — Latest page
- `src/components/LeaguePageClient.tsx` — League page

### Components
- `src/components/ArticleCard.tsx` — Cards in carousels
- `src/components/ViewAllButton.tsx` — Touch target audit

### UI/UX Pro Max Rules
- §2 `touch-target-size`: 48px minimum (Material Design)
- §2 `touch-spacing`: 8px gap between targets
- §9 `bottom-nav-limit`: Max 5 items with labels
- §9 `nav-label-icon`: Both icon and text label
- §9 `nav-state-active`: Current location highlighted
- §5 `mobile-first`: Design mobile-first, scale up
- §5 `horizontal-scroll`: No horizontal scroll on mobile
- §2 `gesture-conflicts`: Avoid horizontal swipe on main content (carousels are explicit sections)

</canonical_refs>

<code_context>
## Existing Code Insights

### Existing Mobile Infrastructure
- Responsive grid (`lg:grid-cols-10`) already hides sidebar on mobile
- `touch-target` utility class exists in globals.css
- `MobileBottomNav.tsx` exists but may need restyling
- Navbar already has Sheet/drawer for mobile menu

### Integration Points
- Collapsing header modifies navbar behavior on mobile only
- Bottom nav renders in layout, hidden on desktop
- Carousels replace grid layouts on mobile breakpoint only
- Touch target audit affects many components across the site

</code_context>

<specifics>
## Specific Ideas

- Mobile should feel native — smooth scrolling, responsive touch, no jank
- Bottom nav like ESPN/BBC Sport apps — clean, labeled icons, active state
- Carousels should use CSS scroll-snap for best performance (no JS library overhead)
- Collapsing header like most modern news apps — hide on scroll down, show on scroll up

</specifics>

<deferred>
## Deferred Ideas

None — all mobile optimizations within Phase 9 scope

</deferred>

---

*Phase: 09-mobile-experience-optimization*
*Context gathered: 2026-03-22*
