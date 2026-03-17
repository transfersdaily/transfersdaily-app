---
phase: 01-design-tokens-theming
plan: 02
subsystem: ui
tags: [typography, spacing, animation, tailwind, css-variables, editorial-design]

# Dependency graph
requires:
  - phase: 01-design-tokens-theming/01
    provides: "Branded color palette, font-serif/font-sans Tailwind fontFamily, CSS custom properties"
provides:
  - "Editorial typography scale with serif headings (Newsreader) and sans body (Roboto)"
  - "Hero heading with clamp() fluid sizing (28-64px)"
  - "12-step spacing scale as CSS variables consumed by Tailwind (4px-96px)"
  - "Animation tokens: duration (150-400ms), easing (cubic-bezier), keyframe animations"
  - "Z-index management scale (0/10/20/40/100/1000)"
  - "xs:375px mobile breakpoint"
  - "Editorial layout helpers (sectionDesktop, articleWidth, heroSpacing)"
affects: [02-navigation-site-chrome, 03-card-system-redesign, 04-ad-placement, 05-homepage-redesign, 06-article-restructure, 08-animation-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [css-custom-properties-for-spacing, clamp-fluid-typography, 4pt-grid-spacing, semantic-z-index-scale, motion-token-system]

key-files:
  created: []
  modified:
    - src/lib/typography.ts
    - src/lib/theme.ts
    - tailwind.config.js
    - src/app/globals.css

key-decisions:
  - "All headings use font-serif (Newsreader) for editorial brand feel"
  - "Hero text uses clamp(1.75rem,5vw,4rem) for fluid responsive sizing without breakpoints"
  - "4pt/8dp grid spacing scale as CSS variables for consistent rhythm"
  - "Animation durations 150/200/300/400ms with reduced motion support via motion-safe/motion-reduce"

patterns-established:
  - "Typography: font-serif for headings/titles, font-sans for body/nav/buttons"
  - "Spacing: CSS custom properties (--space-N) consumed by Tailwind spacing config"
  - "Animation: CSS custom properties (--duration-*, --easing-*) for consistent timing"
  - "Z-index: semantic scale (base/dropdown/sticky/overlay/modal/toast) instead of arbitrary values"
  - "Editorial layout: max-w-prose for article width, generous py-16/py-20 section spacing"

requirements-completed: [DS-02, DS-05]

# Metrics
duration: 4min
completed: 2026-03-17
---

# Phase 1 Plan 2: Typography & Spacing Tokens Summary

**Editorial serif/sans typography scale with 12-step spacing grid, animation timing tokens, and z-index management system**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-17T14:52:30Z
- **Completed:** 2026-03-17T14:56:55Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Rewrote typography.ts with Newsreader serif headings and Roboto sans body text creating editorial hierarchy
- Added hero heading with clamp() fluid sizing (28-64px) and font-weight 900
- Defined 12-step spacing scale (4px-96px) as CSS custom properties consumed by Tailwind
- Added animation tokens (duration, easing, keyframes) with reduced motion support
- Established z-index management scale and xs:375px breakpoint

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite typography.ts with editorial serif/sans scale and add CSS utility classes** - `874a04a` (feat)
2. **Task 2: Add spacing scale, z-index, animation tokens to theme.ts and tailwind.config.js** - `8b1dac6` (feat)

## Files Created/Modified
- `src/lib/typography.ts` - Editorial typography scale with font-serif headings, font-sans body, hero clamp() sizing
- `src/lib/theme.ts` - Added spacingScale, zIndex, motion, editorial layout helper exports
- `tailwind.config.js` - Custom spacing scale, zIndex, xs breakpoint, animation keyframes, transition tokens
- `src/app/globals.css` - Spacing CSS variables, animation token variables, editorial typography utilities

## Decisions Made
- All headings use font-serif (Newsreader) for editorial brand consistency, including card titles and logo
- Hero text uses clamp() for fluid sizing without media queries, font-black (900) weight for maximum impact
- Article body uses max-w-prose (~65ch) for optimal reading line length
- Spacing scale follows 4pt/8dp material grid: 4px increments for small, 8px increments for large
- Animation durations aligned to common performance thresholds: fast (150ms), normal (200ms), slow (300ms), complex (400ms)
- Z-index scale uses semantic names (dropdown, sticky, overlay, modal, toast) mapped to predictable numeric values

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing build error in `/api/admin/image-mappings` route (unrelated to our changes). Verified error exists on clean main branch. No action taken as it is out of scope.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Complete design token foundation ready for all subsequent phases
- Typography scale, spacing grid, animation tokens, and z-index system available for navigation (Phase 2), cards (Phase 3), and all other component work
- All existing exports preserved - no breaking changes to current codebase

---
*Phase: 01-design-tokens-theming*
*Completed: 2026-03-17*
