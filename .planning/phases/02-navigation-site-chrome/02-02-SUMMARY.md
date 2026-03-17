---
phase: 02-navigation-site-chrome
plan: 02
subsystem: ui
tags: [cmdk, command-palette, search, adsense, typography, navigation]

# Dependency graph
requires:
  - phase: 02-navigation-site-chrome/01
    provides: Restyled navbar and footer with design tokens, typography system
  - phase: 01-design-system-tokens
    provides: Typography system, theme tokens, spacing
provides:
  - Command palette search (Cmd+K / Ctrl+K) with instant autocomplete
  - Sans-serif logo and footer branding (font-sans for non-article headings)
  - Collapsed ad containers when no ad is loaded
  - Uppercase section headings for premium sports media aesthetic
affects: [03-card-system-redesign, 04-ad-overhaul, 06-article-restructure]

# Tech tracking
tech-stack:
  added: [cmdk@1.0.4, shadcn-command]
  patterns: [command-palette-search, ad-collapse-on-empty, uppercase-section-labels]

key-files:
  created:
    - src/components/CommandSearch.tsx
    - src/components/ui/command.tsx
  modified:
    - src/components/navbar.tsx
    - src/components/Footer.tsx
    - src/components/ads/AdSense.tsx
    - src/lib/typography.ts
    - src/app/[locale]/page.tsx

key-decisions:
  - "Sans-serif (font-sans) for logo and footer labels; serif (Newsreader) reserved for article content headings only"
  - "Active nav state uses bold + primary color (no underline/border-bottom)"
  - "Ad containers collapse via MutationObserver detecting AdSense data-ad-status attribute"
  - "Homepage section headings use uppercase tracking-wider for premium sports media feel"

patterns-established:
  - "Command palette pattern: CommandSearch component with Cmd+K/Ctrl+K shortcut, debounced API search, popular terms fallback"
  - "Ad collapse pattern: AdSense strips minHeight and uses maxHeight:0 until ad fill confirmed"
  - "Section heading pattern: uppercase tracking-wider for premium labels"

requirements-completed: [NAV-03]

# Metrics
duration: 5min
completed: 2026-03-18
---

# Phase 2 Plan 2: Command Palette Search Summary

**Cmd+K command palette with instant autocomplete via cmdk, plus UI polish fixes: sans-serif branding, no nav underlines, collapsed empty ads, uppercase section headings**

## Performance

- **Duration:** 5 min (checkpoint feedback fixes); original tasks ~4 min earlier
- **Started:** 2026-03-17T22:27:19Z
- **Completed:** 2026-03-17T22:31:53Z
- **Tasks:** 3 planned + 4 feedback fixes
- **Files modified:** 7

## Accomplishments
- Command palette search with Cmd+K/Ctrl+K, 250ms debounced autocomplete, popular searches fallback
- Navbar integrates CommandSearch via state toggle with keyboard hint
- Fixed logo and footer fonts from serif to sans-serif for brand consistency
- Removed nav underline active state in favor of bold + primary color
- Ad containers now collapse when no ad is served (no empty space gaps)
- Homepage section headings use ALL CAPS with letter-spacing for premium feel

## Task Commits

Each task was committed atomically:

1. **Task 1: Install cmdk and create CommandSearch** - `6126784` (feat)
2. **Task 2: Wire CommandSearch into navbar** - `e32f935` (feat)
3. **Fix: Remove invalid language param from trackSearch** - `18d2bf1` (fix)
4. **Fix: Sans-serif font for logo and footer headings** - `4263607` (fix)
5. **Fix: Remove nav underline active state** - `5676998` (fix)
6. **Fix: Collapse ad containers when no ad loaded** - `2d14303` (fix)
7. **Fix: Uppercase section headings with letter-spacing** - `54d1141` (fix)

## Files Created/Modified
- `src/components/CommandSearch.tsx` - Command palette with Cmd+K trigger, debounced search, popular terms
- `src/components/ui/command.tsx` - shadcn Command component wrapping cmdk
- `src/components/navbar.tsx` - CommandSearch integration, search trigger button, active state fix
- `src/components/Footer.tsx` - Sans-serif font for all section headings and labels
- `src/lib/typography.ts` - Logo font changed from font-serif to font-sans
- `src/components/ads/AdSense.tsx` - MutationObserver ad detection, collapse when empty
- `src/app/[locale]/page.tsx` - Uppercase tracking-wider on all section headings

## Decisions Made
- Sans-serif for logo/footer: Newsreader serif looked "bad" on branding per user feedback; reserved for article content only
- No nav underlines: User found border-bottom-2 ugly; bold + primary color is subtler and cleaner
- Ad collapse via MutationObserver: Checks data-ad-status and offsetHeight after 2s timeout; strips minHeight from style prop
- Uppercase section headings: User requested premium sports media aesthetic with ALL CAPS + tracking-wider

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed invalid trackSearch parameter**
- **Found during:** Task 2 (navbar wiring)
- **Issue:** searchApi.trackSearch was called with language parameter not in its API signature
- **Fix:** Removed the invalid `{ language: locale }` parameter
- **Files modified:** src/components/CommandSearch.tsx
- **Committed in:** 18d2bf1

### Checkpoint Feedback Fixes (4 fixes)

**2. Logo and footer font (user feedback)**
- **Issue:** Serif font (Newsreader) on logo and footer headings looked AI-generated
- **Fix:** Changed typography.logo.navbar to font-sans; replaced all footer heading classes with font-sans
- **Files modified:** src/lib/typography.ts, src/components/Footer.tsx
- **Committed in:** 4263607

**3. Nav underline removal (user feedback)**
- **Issue:** border-b-2 active state on nav links looked bad
- **Fix:** Replaced with font-bold (no border)
- **Files modified:** src/components/navbar.tsx
- **Committed in:** 5676998

**4. Ad empty space collapse (user feedback)**
- **Issue:** Ad containers reserved 250px minHeight even when no ad loaded
- **Fix:** AdSense component now detects ad fill via MutationObserver, collapses with maxHeight:0 when empty
- **Files modified:** src/components/ads/AdSense.tsx
- **Committed in:** 2d14303

**5. Section headings uppercase (user feedback)**
- **Issue:** Homepage section headings lacked premium sports media feel
- **Fix:** Added uppercase tracking-wider to all 5 section headings
- **Files modified:** src/app/[locale]/page.tsx
- **Committed in:** 54d1141

---

**Total deviations:** 1 auto-fixed (1 bug), 4 user-feedback fixes
**Impact on plan:** All fixes improve UI polish per user review. No scope creep.

## Issues Encountered
- Build fails due to pre-existing missing Supabase env vars (not related to our changes); TypeScript compilation passes cleanly
- No emojis found in the public-facing UI components (navbar, footer, homepage, CommandSearch); user's emoji concern may refer to other pages outside this plan's scope

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Navigation and site chrome complete (navbar, footer, command palette search)
- Typography system clarified: serif for article content headings, sans for everything else
- Ad containers now collapse cleanly, ready for Phase 4 ad overhaul
- Phase 3 (card system redesign) can proceed with stable navigation shell

---
*Phase: 02-navigation-site-chrome*
*Completed: 2026-03-18*
