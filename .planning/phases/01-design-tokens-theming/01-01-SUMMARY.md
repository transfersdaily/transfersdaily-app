---
phase: 01-design-tokens-theming
plan: 01
subsystem: ui
tags: [tailwind, css-variables, next-font, theming, dark-mode, design-tokens]

# Dependency graph
requires: []
provides:
  - Branded red+gold HSL color token system in globals.css (light and dark modes)
  - Newsreader serif + Roboto sans font pipeline via next/font/google
  - Tailwind fontFamily config referencing CSS variables --font-serif and --font-sans
  - Light mode as default theme for new visitors
affects: [02-component-theming, card-system, ads, navigation, article-pages]

# Tech tracking
tech-stack:
  added: [next/font/google Newsreader, next/font/google Roboto]
  patterns: [HSL CSS variable tokens consumed by Tailwind hsl(var(--token)), dual font via CSS variables]

key-files:
  created: []
  modified:
    - src/app/globals.css
    - src/app/layout.tsx
    - src/app/[locale]/layout.tsx
    - tailwind.config.js

key-decisions:
  - "OLED dark background #121212 (not pure black) for better card contrast and reduced eye strain"
  - "Light mode default for new visitors instead of system preference"
  - "Gold accent same in both light and dark modes for brand consistency"
  - "Removed duplicate globals.css import from locale layout to prevent CSS ordering issues"

patterns-established:
  - "Color tokens: HSL triplets in CSS variables, consumed via hsl(var(--token)) in Tailwind config"
  - "Font pipeline: next/font/google with variable prop, referenced in Tailwind fontFamily via var(--font-*)"
  - "Theme default: light mode for new visitors, stored preference in localStorage"

requirements-completed: [DS-03, DS-04]

# Metrics
duration: 3min
completed: 2026-03-17
---

# Phase 1 Plan 01: Design Tokens & Theming Summary

**Branded red (#DC2626) + gold (#D97706) color tokens with Newsreader/Roboto fonts and OLED dark mode replacing shadcn defaults**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-17T14:46:29Z
- **Completed:** 2026-03-17T14:49:38Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Replaced all 18 light-mode and 17 dark-mode CSS color tokens with branded red+gold palette
- Configured Newsreader (serif headings) and Roboto (sans body) via next/font/google with swap display
- Set light mode as default theme, simplified theme-flicker script to honor stored preference only
- Removed duplicate globals.css import from locale layout preventing CSS ordering issues

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace color tokens in globals.css** - `aa95fb5` (feat)
2. **Task 2: Replace Inter with Newsreader+Roboto fonts and fix theme defaults** - `9f06ff5` (feat)

## Files Created/Modified
- `src/app/globals.css` - Light and dark mode HSL color tokens updated to branded red+gold palette
- `src/app/layout.tsx` - Newsreader+Roboto font setup, ThemeProvider defaultTheme="light", simplified theme script
- `src/app/[locale]/layout.tsx` - Removed duplicate globals.css import
- `tailwind.config.js` - Added fontFamily serif/sans referencing CSS variables

## Decisions Made
- OLED dark background uses #121212 (0 0% 7%) instead of pure black for better card contrast and reduced eye strain
- Light mode is the default for new visitors (not system preference) per user decision
- Gold accent color (32 95% 44%) stays the same in both light and dark modes for brand consistency
- Removed duplicate globals.css import from locale layout to prevent CSS ordering issues (Research pitfall 6)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `npx next build` fails at page data collection due to missing SUPABASE_URL environment variable. This is a pre-existing issue (confirmed by testing unchanged code) unrelated to design token changes. Type-checking passes successfully.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Color token foundation complete; all components using semantic Tailwind classes automatically pick up the new brand
- Font pipeline ready; `font-serif` class available for heading components
- Ready for Plan 02 (component theming updates) to apply tokens to specific component patterns

## Self-Check: PASSED

All files verified present. All commits verified in git log.

---
*Phase: 01-design-tokens-theming*
*Completed: 2026-03-17*
