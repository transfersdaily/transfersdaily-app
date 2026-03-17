# Phase 1: Design Tokens & Theming - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish unified typography scale, branded color palette, consistent dark/light mode, and responsive spacing system as the design foundation for all public pages. This phase replaces generic shadcn defaults with a premium sports media identity. No page-level redesigns — those are in later phases.

</domain>

<decisions>
## Implementation Decisions

### Color Identity
- Keep red as primary brand color (current `hsl(0, 84%, 60%)`) — bold, energetic, matches football passion
- Add gold/amber as accent color for highlights, CTAs, breaking news alerts, and featured content
- Minimal palette approach: red + gold + neutrals only (like The Athletic). No extended secondary shades.
- Keep individual league colors as category accents (Premier League purple, La Liga red, etc.) — already defined in `theme.ts` LEAGUE_CONFIG
- Transfer status colors (completed green, rumor yellow, confirmed blue, loan purple) stay as-is

### Typography Feel
- Bold editorial headlines: 28-36px mobile, 48-64px desktop (upgrade from current 18px/24px)
- System fonts (Inter/system-ui) — fast loading, clean, no custom web fonts
- Article titles should feel dramatic and impactful, like ESPN or The Athletic headlines

### Body Text
- Claude's Discretion: optimize for comfortable long-form reading based on sports media best practices

### Dark Mode Style
- Deep & dramatic: near-black backgrounds, high contrast text, vivid accent colors pop (like ESPN dark mode)
- Red primary and gold accent should remain vivid and striking in dark mode
- Light mode is the default for new visitors
- System preference detection available but light is the initial default

### Spacing & Density
- Spacious editorial layout on desktop — generous whitespace, content breathes, premium feel
- Tighten spacing 30-40% on mobile — more articles visible per scroll while maintaining readability
- Container max width stays at 1400px (already configured)
- Mobile-first responsive approach: start tight, expand spacing at breakpoints

### Claude's Discretion
- Exact body text size for optimal reading (likely 16-18px with 1.6-1.75 line height)
- Specific gold/amber hue that pairs well with the existing red
- Neutral gray palette (warm vs cool undertones)
- Border radius values for cards and interactive elements
- Specific dark mode background shade (near-black vs charcoal)
- Animation/transition timing curves for color/theme changes

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System Files
- `src/lib/theme.ts` — Current theme utilities: transfer/league variants, card variants, shadows, spacing, layout. Must be updated/extended, not replaced.
- `src/lib/typography.ts` — Current typography scale. Must be updated with bold editorial sizes while preserving the structure.
- `src/app/globals.css` — CSS custom properties (HSL variables) for colors. Primary location for color token definitions.
- `tailwind.config.js` — Tailwind theme extension with color/spacing tokens via CSS variables. Must be updated to reference new tokens.

### Research
- `.planning/research/STACK.md` — Recommended libraries and patterns for the design system
- `.planning/research/ARCHITECTURE.md` — Component decomposition strategy and design system architecture

### Codebase Context
- `.planning/codebase/CONVENTIONS.md` — Code style, naming patterns, import organization
- `.planning/codebase/STACK.md` — Current tech stack (shadcn/ui, Tailwind, Radix UI)

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

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-design-tokens-theming*
*Context gathered: 2026-03-17*
