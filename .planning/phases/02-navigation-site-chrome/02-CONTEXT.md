# Phase 2: Navigation & Site Chrome - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesign navbar, footer, and search experience used across every public page. Apply the branded design tokens from Phase 1 (red+gold palette, Newsreader/Roboto fonts, OLED dark mode, spacing scale) to all site chrome. No page content changes — just the surrounding navigation framework.

</domain>

<decisions>
## Implementation Decisions

### Navbar Layout
- **Minimal editorial style** — clean thin bar, logo left, minimal links center, search + theme toggle right (like The Athletic)
- Sticky header with backdrop blur (existing pattern is good — restyle with new tokens)
- Active page state: Claude's Discretion (UI/UX Pro Max §9: `nav-state-active` — must be visually highlighted)
- League navigation: Claude's Discretion (UI/UX Pro Max §9: `nav-hierarchy` — clear primary vs secondary separation)
- Transfer types navigation: keep accessible from navbar
- Skip-to-content link required (UI/UX Pro Max §1: `skip-links`)
- Keyboard navigation must match visual tab order (UI/UX Pro Max §1: `keyboard-nav`)
- Nav height padding compensation on body (UI/UX Pro Max: sticky nav must not overlap content)
- Mobile: Sheet/drawer pattern already exists — restyle to match new design

### Search Experience
- **Command palette (Cmd+K / Ctrl+K)** — overlay with instant results, stays in context (like Verge/Notion)
- Autocomplete suggestions as user types — article titles, league names, player names (debounced)
- No-results state: show suggestions and popular searches (UI/UX Pro Max: "Show 'No results' with suggestions")
- Existing search page stays as fallback (navigate there from command palette for full results)
- Search must be accessible from every page (UI/UX Pro Max §9: `search-accessible`)
- Keyboard shortcut Cmd+K / Ctrl+K to open

### Footer Structure
- **Keep existing 4-column structure** — brand, leagues, transfers, legal + social links
- Restyle with new design tokens (Phase 1 typography, colors, spacing)
- Collapsible mobile sections already work — keep that pattern
- Back-to-top button already exists — restyle

### UI/UX Pro Max Navigation Rules Applied
- §9 `nav-state-active`: Current location visually highlighted in navigation
- §9 `nav-label-icon`: Navigation items should have both icon and text label
- §9 `search-accessible`: Search easily reachable from top bar
- §9 `navigation-consistency`: Navigation placement same across all pages
- §9 `back-behavior`: Preserve navigation history, predictable back button
- §1 `skip-links`: Skip to main content for keyboard users
- §1 `keyboard-nav`: Tab order matches visual order
- §7 `duration-timing`: 150-300ms for hover/focus transitions
- §2 `touch-target-size`: 44x44px minimum for all nav interactive elements
- §2 `cursor-pointer`: cursor-pointer on all clickable nav elements

### Claude's Discretion
- Active state styling (red underline vs bold+color vs other)
- League navigation pattern (dropdown vs tabs vs mega menu)
- Command palette visual design details
- Autocomplete debounce timing and result count
- Exact footer spacing and typography sizes
- Mobile drawer design details

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Navigation Components
- `src/components/navbar.tsx` — Current navbar implementation (sticky, dropdowns, search icon, theme toggle, mobile Sheet)
- `src/components/ClientNavbar.tsx` — Client wrapper with dictionary loading + skeleton
- `src/components/ServerNavbar.tsx` — Server-side navbar variant
- `src/components/Footer.tsx` — Current footer (4-column, social links, collapsible mobile, back-to-top)
- `src/components/MobileBottomNav.tsx` — Mobile bottom nav (Phase 9 refines this)
- `src/components/LanguageSwitcher.tsx` — Language toggle component
- `src/components/ThemeToggle.tsx` — Theme toggle component (if exists)

### Search Components
- `src/components/SearchPageClient.tsx` — Current search page implementation
- `src/components/SearchAndFilter.tsx` — Current search and filter component

### Design System (from Phase 1)
- `src/lib/theme.ts` — Design tokens: spacing, z-index, shadows, animations, variants
- `src/lib/typography.ts` — Typography scale: headings (font-serif), body (font-sans), nav, buttons
- `src/app/globals.css` — CSS custom properties for colors, spacing, animation tokens
- `tailwind.config.js` — Tailwind config with branded fonts, colors, spacing scale

### UI/UX Pro Max Design System
- `design-system/transfersdaily/MASTER.md` — Global design system source of truth
- `design-system/transfersdaily/pages/navigation.md` — Navigation page-specific overrides

### i18n
- `src/lib/i18n.ts` — Locale system (navbar uses getDictionary, t() for translations)
- `src/lib/dictionary-provider.tsx` — Dictionary context provider

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `navbar.tsx`: Complete navbar with leagues array, transferTypes array, getLocalizedPath(), DropdownMenu, Sheet for mobile, ThemeToggle, LanguageSwitcher — all can be preserved and restyled
- `Footer.tsx`: 4-column layout with brand, social icons (FaXTwitter, FaFacebook, etc.), collapsible sections, back-to-top — structure preserved
- `SearchAndFilter.tsx`: Existing search/filter logic — can inform command palette result rendering
- `MobileBottomNav.tsx`: Already exists — don't duplicate, Phase 9 refines

### Established Patterns
- Client/Server navbar split for hydration — preserve this pattern
- Dictionary loading via `useDictionary()` hook and `getDictionary(locale)` — all nav text must use t() translations
- `getLocalizedPath()` helper for locale-prefixed URLs — use in all new links
- Sticky header with `z-50`, `backdrop-blur`, `bg-background/95` — good pattern, restyle
- Lucide icons used throughout (Menu, ChevronDown, Search, User) — continue using Lucide

### Integration Points
- `src/app/[locale]/layout.tsx` — Renders ClientNavbar, wraps with DictionaryProvider
- Navbar z-index must respect new z-index scale from Phase 1 theme.ts
- Typography classes from Phase 1 (`typography.nav.primary`, `typography.logo.navbar`) already used in navbar
- Footer already uses `useDictionary()` — i18n integration in place

</code_context>

<specifics>
## Specific Ideas

- Command palette search (Cmd+K) inspired by Verge/Notion — opens as centered overlay, keyboard navigable, shows instant article/league/player results
- Minimal editorial navbar like The Athletic — thin, clean, logo left, links center, actions right
- "Exaggerated Minimalism" style from UI/UX Pro Max applied: bold type, high contrast, negative space, no clutter
- All existing i18n translations must be preserved — navbar and footer use t() throughout

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-navigation-site-chrome*
*Context gathered: 2026-03-17*
