# Phase 8: Animation System - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement micro-animation system with framer-motion across all public pages. Page transitions, card reveal animations, hover/focus motion feedback. Must respect prefers-reduced-motion.

</domain>

<decisions>
## Implementation Decisions

### Page Transitions (DS-06)
- **D-01:** Smooth fade transitions between route changes using framer-motion `AnimatePresence`.
- **D-02:** Duration: 200ms fade-in, 150ms fade-out (exit faster than enter per UI/UX Pro Max §7).
- **D-03:** Easing: ease-out for entering, ease-in for exiting.

### Card Reveal Animations
- **D-04:** Cards animate in with `fade-in-up` (opacity 0→1, translateY 8px→0) when scrolled into view.
- **D-05:** Stagger: 50ms delay between cards in a grid for sequential reveal.
- **D-06:** Use IntersectionObserver to trigger — animate once, don't re-animate on scroll back.
- **D-07:** Duration: 300ms per card.

### Hover & Focus Motion
- **D-08:** Cards: existing translateY(-2px) + scale(1.03) image zoom is sufficient — already in ArticleCard.
- **D-09:** Buttons: subtle scale(0.98) on press, scale(1) on release (100ms).
- **D-10:** Links: color transition already exists (200ms) — no additional motion needed.

### Reduced Motion
- **D-11:** All animations wrapped in `prefers-reduced-motion` check — disabled when user prefers reduced motion.
- **D-12:** Use `motion-safe:` Tailwind prefix for CSS animations.
- **D-13:** framer-motion: use `useReducedMotion()` hook to conditionally skip animations.

### Implementation Approach
- **D-14:** Install `framer-motion` as dependency.
- **D-15:** Create a `MotionCard` wrapper component that adds reveal animation to any card.
- **D-16:** Create a `PageTransition` wrapper for route-level fade transitions.
- **D-17:** Keep animations purely visual — no layout-affecting transforms (only opacity, translateY, scale).

### Claude's Discretion
- Exact framer-motion variant definitions
- Whether to use a global AnimatePresence in layout or per-page
- IntersectionObserver threshold for card reveals
- Whether MotionCard wraps ArticleCard or is a separate HOC

</decisions>

<canonical_refs>
## Canonical References

### Components to Animate
- `src/components/ArticleCard.tsx` — Card component (add reveal animation)
- `src/components/sections/HeroSection.tsx` — Hero section (add entrance animation)
- `src/components/sections/LatestSection.tsx` — Latest grid (add staggered reveal)
- `src/components/sections/LeagueSection.tsx` — League sections (add staggered reveal)

### Design System
- `src/app/globals.css` — Animation tokens (--duration-fast, --duration-normal, --duration-slow)
- `tailwind.config.js` — Keyframes and animation definitions
- `src/lib/typography.ts` — No changes needed

### UI/UX Pro Max Rules
- §7 `duration-timing`: 150-300ms micro-interactions, max 400ms complex
- §7 `transform-performance`: Only transform/opacity, no width/height
- §7 `easing`: ease-out entering, ease-in exiting
- §7 `exit-faster-than-enter`: Exit ~60-70% of enter duration
- §7 `stagger-sequence`: 30-50ms per item
- §7 `motion-consistency`: Unified duration/easing tokens
- §1 `reduced-motion`: Respect prefers-reduced-motion

</canonical_refs>

<code_context>
## Existing Code Insights

### Existing Animation Infrastructure
- `globals.css` has animation tokens: `--duration-fast: 150ms`, `--duration-normal: 200ms`, `--duration-slow: 300ms`
- Tailwind keyframes: `fade-in`, `fade-in-up`, `slide-in-right` already defined
- `motion-safe:` prefix already used in navbar transitions
- ArticleCard already has `transition-all duration-200 ease-out` hover effects

### Integration Points
- framer-motion needs to be added to package.json
- Page transitions wrap in layout or per-page
- Card reveals wrap ArticleCard instances in grid contexts

</code_context>

<specifics>
## Specific Ideas

- Animations should feel like polish, not decoration — subtle and fast
- The Athletic uses very minimal animation — just smooth fades and slight reveals
- No bouncy/spring animations — keep it editorial and clean

</specifics>

<deferred>
## Deferred Ideas

None — all animations within Phase 8 scope

</deferred>

---

*Phase: 08-animation-system*
*Context gathered: 2026-03-22*
