# Phase 1: Design Tokens & Theming - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish unified typography scale, branded color palette, consistent dark/light mode, and responsive spacing system as the design foundation for all public pages. This phase replaces generic shadcn defaults with a premium sports media identity. No page-level redesigns — those are in later phases.

</domain>

<decisions>
## Implementation Decisions

### Color Identity (UI/UX Pro Max: News/Media + Sports Team palettes)
- Keep red as primary brand color — UI/UX Pro Max recommends `#DC2626` (News/Media + Sports Team palettes both use this exact red)
- On Primary: `#FFFFFF` (white text on red)
- Secondary: `#EF4444` (lighter red for hover states, secondary elements)
- Accent/CTA: Gold/amber `#D97706` for highlights, CTAs, breaking news alerts, featured content (from Gift & Wishlist palette pairing red+gold)
- Background light: `#FEF2F2` (warm red-tinted off-white, from News/Media palette)
- Text/Foreground: `#450A0A` (deep dark red-black, from News/Media palette) or `#1E293B` (slate dark)
- Card: `#FFFFFF` with Card Foreground `#450A0A`
- Muted: `#F0EDF1` with Muted Foreground `#64748B`
- Border: `#FECACA` (soft red-tinted border)
- Ring: `#DC2626` (matches primary)
- Destructive: `#DC2626` (same as primary — careful to differentiate via context)
- Minimal palette approach: red + gold + neutrals only. No extended secondary shades.
- Keep individual league colors as category accents (Premier League purple, La Liga red, etc.) — already defined in `theme.ts` LEAGUE_CONFIG
- Transfer status colors (completed green, rumor yellow, confirmed blue, loan purple) stay as-is

### Typography (UI/UX Pro Max: Editorial Grid/Magazine style + News Editorial pairing)
- **Style: "Editorial Grid / Magazine"** — asymmetric grid, pull quotes, drop caps, large imagery, print-inspired typography
- Bold editorial headlines: 28-36px mobile, 48-64px desktop using `clamp(3rem, 10vw, 12rem)` for hero text
- `font-weight: 900`, `letter-spacing: -0.05em` for dramatic impact (from Exaggerated Minimalism style)
- **Newsreader** (serif) for headings + **Roboto** (sans-serif) for body — UI/UX Pro Max "News Editorial" pairing
- Google Fonts import: `Newsreader:wght@400;500;600;700` + `Roboto:wght@300;400;500;700`
- Tailwind config: `fontFamily: { serif: ['Newsreader', 'serif'], sans: ['Roboto', 'sans-serif'] }`
- Use `font-display: swap` to avoid invisible text during load
- Body text: 16-18px with line-height 1.5-1.75 (UI/UX Pro Max §6: `line-height` rule)
- Line length: limit to 65-75 characters per line (UI/UX Pro Max §6: `line-length` rule)
- Minimum 16px body on mobile to avoid iOS auto-zoom (UI/UX Pro Max §5: `readable-font-size`)
- Font scale: consistent type scale (12, 14, 16, 18, 24, 32, 48, 64) per UI/UX Pro Max §6: `font-scale`
- Weight hierarchy: Bold headings (700-900), Regular body (400), Medium labels (500) per UI/UX Pro Max §6: `weight-hierarchy`
- Use `font-display: swap` to avoid invisible text during font load (UI/UX Pro Max §3: `font-loading`)

### Dark Mode (UI/UX Pro Max: Dark Mode OLED style)
- **Style: "Dark Mode (OLED)"** — deep black, high contrast, eye-friendly, WCAG AAA
- Background: `#000000` or `#121212` (Deep Black or Dark Grey)
- Text primary: `#FFFFFF` or `#E0E0E0`
- Text contrast must be 7:1+ (WCAG AAA level per OLED style)
- Red primary and gold accent should remain vivid and striking in dark mode
- Dark mode uses desaturated/lighter tonal variants, not inverted colors (UI/UX Pro Max §6: `color-dark-mode`)
- Foreground/background pairs must meet 4.5:1 AA minimum; aim for 7:1 AAA (UI/UX Pro Max §6: `color-accessible-pairs`)
- Test dark mode contrast independently — don't assume light mode values work (UI/UX Pro Max Pre-Delivery Checklist)
- Light mode is the default for new visitors
- Design light/dark variants together to keep brand consistent (UI/UX Pro Max §4: `dark-mode-pairing`)

### Spacing & Density (UI/UX Pro Max §5: Layout & Responsive)
- Spacious editorial layout on desktop — generous whitespace, content breathes, premium feel ("massive whitespace" per Exaggerated Minimalism)
- Use 4pt/8dp incremental spacing system (UI/UX Pro Max §5: `spacing-scale`)
- Tighten spacing 30-40% on mobile — more articles visible per scroll while maintaining readability
- Container max width stays at 1400px (already configured)
- Mobile-first responsive approach with systematic breakpoints: 375 / 768 / 1024 / 1440 (UI/UX Pro Max §5: `breakpoint-consistency`)
- No horizontal scroll on mobile (UI/UX Pro Max §5: `horizontal-scroll`)
- Z-index management: define layered scale (0 / 10 / 20 / 40 / 100 / 1000) (UI/UX Pro Max §5: `z-index-management`)
- Prefer `min-h-dvh` over `100vh` on mobile (UI/UX Pro Max §5: `viewport-units`)

### Accessibility (UI/UX Pro Max §1: CRITICAL)
- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text (UI/UX Pro Max §1: `color-contrast`)
- Visible focus rings on interactive elements, 2-4px (UI/UX Pro Max §1: `focus-states`)
- Sequential heading hierarchy h1→h6 with no level skip (UI/UX Pro Max §1: `heading-hierarchy`)
- Don't convey info by color alone — add icon/text (UI/UX Pro Max §1: `color-not-only`)
- Respect `prefers-reduced-motion` — reduce/disable animations when requested (UI/UX Pro Max §1: `reduced-motion`)
- Color is not the only indicator for transfer status, league, etc.

### Animation Tokens (UI/UX Pro Max §7: Animation)
- Duration: 150-300ms for micro-interactions, max 400ms for complex transitions (UI/UX Pro Max §7: `duration-timing`)
- Use transform/opacity only — avoid animating width/height/top/left (UI/UX Pro Max §7: `transform-performance`)
- Easing: ease-out for entering, ease-in for exiting; no linear for UI (UI/UX Pro Max §7: `easing`)
- Exit animations shorter than enter (~60-70% of enter duration) (UI/UX Pro Max §7: `exit-faster-than-enter`)
- Define transition tokens globally so all animations share same rhythm (UI/UX Pro Max §7: `motion-consistency`)

### Touch & Interaction (UI/UX Pro Max §2: CRITICAL)
- Minimum 44x44px touch targets (already have `touch-target` utility) (UI/UX Pro Max §2: `touch-target-size`)
- Minimum 8px gap between touch targets (UI/UX Pro Max §2: `touch-spacing`)
- Use click/tap for primary interactions — don't rely on hover alone (UI/UX Pro Max §2: `hover-vs-tap`)
- cursor-pointer on all clickable elements (UI/UX Pro Max §2: `cursor-pointer`)

### Claude's Discretion
- Exact gold/amber hue between `#D97706` and `#F59E0B` that pairs best with `#DC2626` red
- Warm vs cool neutral gray undertones
- Border radius values for cards and interactive elements
- Whether dark mode background should be pure `#000000` or `#121212`
- Exact spacing scale values at each breakpoint

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System Files
- `src/lib/theme.ts` — Current theme utilities: transfer/league variants, card variants, shadows, spacing, layout. Must be updated/extended, not replaced.
- `src/lib/typography.ts` — Current typography scale. Must be updated with bold editorial sizes while preserving the structure.
- `src/app/globals.css` — CSS custom properties (HSL variables) for colors. Primary location for color token definitions.
- `tailwind.config.js` — Tailwind theme extension with color/spacing tokens via CSS variables. Must be updated to reference new tokens.

### UI/UX Pro Max Design System
- `design-system/transfersdaily/MASTER.md` — Persisted design system: style (Exaggerated Minimalism), colors (News/Media), typography (News Editorial), effects, anti-patterns, pre-delivery checklist

### Research
- `.planning/research/STACK.md` — Recommended libraries and patterns for the design system
- `.planning/research/ARCHITECTURE.md` — Component decomposition strategy and design system architecture

### Codebase Context
- `.planning/codebase/CONVENTIONS.md` — Code style, naming patterns, import organization
- `.planning/codebase/STACK.md` — Current tech stack (shadcn/ui, Tailwind, Radix UI)

### UI/UX Pro Max Rules Applied
- §1 Accessibility (CRITICAL): `color-contrast`, `focus-states`, `heading-hierarchy`, `color-not-only`, `reduced-motion`
- §2 Touch & Interaction (CRITICAL): `touch-target-size`, `touch-spacing`, `hover-vs-tap`, `cursor-pointer`
- §3 Performance (HIGH): `font-loading`, `font-preload`, `lazy-loading`, `content-jumping`
- §4 Style Selection (HIGH): Editorial Grid/Magazine + Exaggerated Minimalism, `dark-mode-pairing`, `elevation-consistent`
- §5 Layout & Responsive (HIGH): `mobile-first`, `breakpoint-consistency`, `spacing-scale`, `z-index-management`, `viewport-units`
- §6 Typography & Color (MEDIUM): `line-height`, `line-length`, `font-scale`, `weight-hierarchy`, `color-semantic`, `color-dark-mode`, `color-accessible-pairs`
- §7 Animation (MEDIUM): `duration-timing`, `transform-performance`, `easing`, `exit-faster-than-enter`, `motion-consistency`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/theme.ts`: Already has `transferStatusVariants`, `leagueVariants`, `cardVariants`, `textVariants`, `hoverVariants`, `modernShadows`, `animations`, `spacing`, `layout`, `borders`, `focus` — comprehensive design token foundation
- `src/lib/typography.ts`: Complete typography system with `heading`, `body`, `nav`, `button`, `badge`, `article`, `card`, `logo` scales plus responsive helpers
- `src/app/globals.css`: HSL CSS variable system for light/dark mode, custom scrollbar styles, mobile utility classes (`touch-target`, `mobile-grid`, `mobile-container`)
- `tailwind.config.js`: Extended color tokens for `transfer`, `league`, `chart`, `sidebar`, `success`, `warning`

### Established Patterns
- CSS variables (HSL format) in globals.css → referenced in tailwind.config.js → consumed by components
- Class-based dark mode (`darkMode: ["class"]`) via next-themes
- `cn()` utility from `clsx` + `tailwind-merge` for conditional class merging
- Typography consumed via exported objects: `typography.heading.h1`, `typography.body.large`, etc.

### Integration Points
- Every component that uses `text-primary`, `bg-background`, `text-muted-foreground` etc. will automatically pick up new color tokens
- `theme.ts` is imported across admin and public components — changes propagate site-wide
- `typography.ts` helper functions (`getHeadingClass`, `getBodyClass`) used throughout
- `globals.css` custom properties are the single source of truth for all color values

</code_context>

<specifics>
## Specific Ideas

- "Premium sports media" aesthetic — The Athletic and ESPN FC are the reference points
- Red + gold palette echoes football trophy/award aesthetics
- League colors should be instantly recognizable to fans
- Bold editorial headlines are the #1 visual upgrade — make the typography feel confident and authoritative
- UI/UX Pro Max recommends **"Exaggerated Minimalism"** style: bold minimalism, oversized typography, high contrast, negative space
- UI/UX Pro Max recommends **"Editorial Grid / Magazine"** layout style: asymmetric grid, pull quotes, drop caps, large imagery
- Key CSS effects from Pro Max: `font-size: clamp(3rem, 10vw, 12rem)`, `font-weight: 900`, `letter-spacing: -0.05em`, massive whitespace
- Color palette validated against UI/UX Pro Max News/Media (`#DC2626` primary) and Sports Team (`#DC2626` + championship gold) palettes
- Anti-patterns to avoid: cluttered layout, slow loading, gray-on-gray text, raw hex in components (use semantic tokens)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-design-tokens-theming*
*Context gathered: 2026-03-17*
