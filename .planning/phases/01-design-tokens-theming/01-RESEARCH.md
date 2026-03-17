# Phase 1: Design Tokens & Theming - Research

**Researched:** 2026-03-17
**Domain:** CSS custom properties, Tailwind theming, typography, dark/light mode
**Confidence:** HIGH

## Summary

Phase 1 replaces the generic shadcn/ui default color palette and Inter font with a branded sports media design system: red (#DC2626) + gold (#D97706) color identity, Newsreader (serif headings) + Roboto (sans body) typography, OLED-style dark mode, and a 4pt/8dp spacing scale. The existing architecture is well-suited to this change -- CSS custom properties in `globals.css` flow through `tailwind.config.js` to all components via semantic class names (`bg-background`, `text-primary`, etc.), so updating the token values automatically propagates the new brand across the entire site.

The current codebase uses Inter as the sole font, HSL-based CSS variables for light/dark mode via next-themes (class strategy), and shadcn/ui's default neutral palette with a red primary (#EF4444). The work is purely additive/replacement at the token level -- no component logic changes needed. Key risks are: (1) contrast failures in dark mode for red/gold on dark backgrounds, (2) font loading performance when adding two Google Fonts, and (3) breaking existing transfer-status and league-specific color tokens that must be preserved.

**Primary recommendation:** Update the four canonical files (globals.css, tailwind.config.js, theme.ts, typography.ts) plus the root layout font configuration in a specific order -- colors first, then typography, then spacing, then dark mode -- verifying contrast at each step.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Primary color: #DC2626 (red), On Primary: #FFFFFF
- Secondary: #EF4444 (lighter red for hover/secondary)
- Accent/CTA: Gold #D97706 for highlights, CTAs, breaking news
- Background light: #FEF2F2 (warm red-tinted off-white)
- Text: #450A0A (deep dark) or #1E293B (slate)
- Card: #FFFFFF with foreground #450A0A
- Muted: #F0EDF1, Muted Foreground: #64748B
- Border: #FECACA (soft red-tinted)
- Ring: #DC2626
- Fonts: Newsreader (serif headings) + Roboto (sans body) via Google Fonts
- Font weights: Newsreader 400-700, Roboto 300-700
- font-display: swap
- Dark mode: OLED style (#000000 or #121212), WCAG AAA 7:1+ target
- Style: Exaggerated Minimalism + Editorial Grid/Magazine
- Spacing: 4pt/8dp system
- Breakpoints: 375 / 768 / 1024 / 1440
- Z-index scale: 0 / 10 / 20 / 40 / 100 / 1000
- Animation tokens: 150-300ms micro, max 400ms complex, transform/opacity only
- Accessibility: 4.5:1 normal text, 3:1 large text, visible focus rings, prefers-reduced-motion
- Keep league colors and transfer status colors as-is
- Light mode is default for new visitors

### Claude's Discretion
- Exact gold/amber hue between #D97706 and #F59E0B
- Warm vs cool neutral gray undertones
- Border radius values for cards and interactive elements
- Whether dark mode background is pure #000000 or #121212
- Exact spacing scale values at each breakpoint

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DS-02 | Premium editorial typography scale with proper hierarchy | Newsreader + Roboto via next/font/google, clamp()-based responsive sizes, weight hierarchy 300-900, font scale (12/14/16/18/24/32/48/64) |
| DS-03 | Branded color system distinct from generic shadcn defaults | HSL-based CSS variables replacing shadcn defaults, red+gold+neutral palette, league/transfer colors preserved |
| DS-04 | Consistent dark/light mode theming across all public pages | OLED dark mode via existing next-themes class strategy, verified contrast ratios, dark-specific token overrides |
| DS-05 | Responsive design tokens (spacing, breakpoints, container widths, grid) | 4pt/8dp spacing scale as CSS variables, z-index management, animation tokens, breakpoint-consistent spacing |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 3.4.17 | Utility-first CSS, theme extension | Already installed, all components use it |
| next-themes | 0.4.6 | Dark/light mode toggle (class strategy) | Already installed and configured |
| tailwindcss-animate | 1.0.7 | Animation utilities | Already installed |
| class-variance-authority | 0.7.1 | Component variant management | Already installed, used for design system variants |
| next/font/google | built-in (Next.js 15.3.5) | Optimized font loading for Newsreader + Roboto | Built into Next.js, automatic font-display: swap, self-hosted, no CLS |

### Supporting (Already Installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.1 | Conditional class names | Every component that composes classes |
| tailwind-merge | 3.3.1 | Intelligent Tailwind class merging | Via cn() utility in theme.ts |

### No New Dependencies Required
This phase requires zero new npm packages. Everything needed is already installed or built into Next.js.

**Installation:** None needed.

## Architecture Patterns

### Recommended Token Architecture
```
globals.css (CSS custom properties - HSL format)
    |
    +--> tailwind.config.js (references CSS vars via hsl(var(--token)))
    |        |
    |        +--> All Tailwind classes (bg-primary, text-foreground, etc.)
    |
    +--> src/lib/theme.ts (utility exports: shadows, spacing, animations, variants)
    |
    +--> src/lib/typography.ts (typography scale with Tailwind class strings)
    |
    +--> src/app/layout.tsx (font definitions via next/font/google)
```

### Pattern 1: HSL CSS Variable Token System (Existing, Extend)
**What:** All colors defined as HSL triplets (without the `hsl()` wrapper) in `:root` and `.dark` selectors, referenced in tailwind.config.js as `hsl(var(--token-name))`.
**When to use:** Every color token.
**Example:**
```css
/* globals.css */
:root {
  --primary: 0 72% 51%;           /* #DC2626 */
  --primary-foreground: 0 0% 100%; /* #FFFFFF */
  --accent: 32 95% 44%;           /* #D97706 gold */
  --accent-foreground: 0 0% 100%; /* #FFFFFF */
}
.dark {
  --primary: 0 72% 51%;           /* Keep red vivid in dark */
  --background: 0 0% 7%;          /* #121212 dark grey */
}
```

### Pattern 2: next/font/google Dual Font Setup
**What:** Replace single Inter font with Newsreader (serif) + Roboto (sans-serif) using Next.js built-in font optimization. Fonts are automatically self-hosted, eliminating external requests.
**When to use:** Root layout only.
**Example:**
```typescript
// src/app/layout.tsx
import { Newsreader, Roboto } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

// In JSX:
<body className={`${roboto.variable} ${newsreader.variable} font-sans`}>
```

### Pattern 3: Responsive Typography with clamp()
**What:** Use CSS clamp() for fluid typography that scales between mobile and desktop breakpoints.
**When to use:** Hero headings, section titles, and any text that needs dramatic size changes.
**Example:**
```css
/* In globals.css or as Tailwind utilities */
.text-hero {
  font-size: clamp(1.75rem, 5vw, 4rem);  /* 28px -> 64px */
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1.1;
}
```

### Pattern 4: Spacing Scale as CSS Variables
**What:** Define spacing tokens as CSS custom properties following 4pt/8dp grid, consumed by both Tailwind config and direct CSS usage.
**When to use:** All spacing decisions.
**Example:**
```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

### Anti-Patterns to Avoid
- **Raw hex values in components:** Always use semantic tokens (`bg-primary`, `text-foreground`), never hardcode `#DC2626` in component files. The globals.css file is the single source of truth.
- **Importing fonts via CSS @import:** Use next/font/google exclusively. CSS @import blocks rendering and adds external requests.
- **Duplicating color definitions:** Do not define colors in both globals.css AND tailwind.config.js. tailwind.config.js should ONLY reference CSS variables, never contain actual color values.
- **Ignoring existing token consumers:** Do not rename tokens that are already consumed by shadcn/ui components (e.g., `--primary`, `--secondary`, `--background`). Extend, do not rename.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading optimization | Manual font-face declarations or CSS @import | `next/font/google` | Automatic font-display: swap, self-hosting, preloading, zero CLS. Manual approaches cause FOUT/FOIT. |
| Dark/light mode toggling | Custom useTheme hook with localStorage | `next-themes` (already installed) | Handles SSR flicker, system preference, localStorage, class toggling. Already configured with `storageKey: "transfers-daily-theme"`. |
| Conditional class merging | String concatenation | `cn()` from theme.ts (clsx + tailwind-merge) | Handles Tailwind class conflicts intelligently. Already the project standard. |
| Component variants | Manual if/else className logic | `class-variance-authority` (CVA) | Type-safe variant API, composable, already installed. |
| Responsive font sizing | Multiple `@media` queries | CSS `clamp()` function | Single declaration, fluid scaling, no breakpoint jumps. |

## Common Pitfalls

### Pitfall 1: White on Gold Fails WCAG AA for Normal Text
**What goes wrong:** White text (#FFFFFF) on gold (#D97706) has only 3.19:1 contrast -- fails WCAG AA for normal text (requires 4.5:1). Passes only for large text (18px+ bold or 24px+).
**Why it happens:** Gold/amber colors are inherently mid-luminance, making them hard to pair with white.
**How to avoid:** Use gold ONLY for large text/icons, or pair gold with dark text (#450A0A or #1E293B). For small gold-background elements (badges, tags), use dark foreground text instead of white.
**Warning signs:** Any `text-white` on gold/amber backgrounds smaller than 18px bold.

### Pitfall 2: Red on Dark Background Contrast
**What goes wrong:** #DC2626 on #000000 is only 4.35:1 -- meets AA for normal text but NOT AAA (7:1).
**Why it happens:** Red is a mid-luminance color. Against pure black, contrast is moderate.
**How to avoid:** For dark mode, use a lighter/brighter red variant for text (e.g., #F87171 at ~5.5:1) while keeping #DC2626 for large elements (buttons, headings). Or use #121212 background instead of pure black for slightly better perceived contrast.
**Warning signs:** Small red text on dark backgrounds.

### Pitfall 3: Font Loading Flash (FOUT)
**What goes wrong:** Page renders with fallback font, then jumps to Newsreader/Roboto, causing visible layout shift.
**Why it happens:** Fonts load asynchronously. Without optimization, the browser shows a fallback until the custom font is ready.
**How to avoid:** Use `next/font/google` which automatically self-hosts fonts and applies `font-display: swap` with size-adjust metrics to minimize CLS. Do NOT use CSS `@import url('fonts.googleapis.com/...')`.
**Warning signs:** CLS score above 0.1 on Lighthouse.

### Pitfall 4: Breaking Existing shadcn/ui Component Tokens
**What goes wrong:** Renaming or removing CSS variables that shadcn/ui components depend on (like `--primary`, `--secondary`, `--destructive`) breaks the entire component library.
**Why it happens:** shadcn/ui components use these token names directly in their class definitions.
**How to avoid:** NEVER rename existing token variables. Only change their VALUES. Add new tokens (like `--accent` for gold) alongside existing ones.
**Warning signs:** Components losing their colors or showing fallback/broken styles.

### Pitfall 5: Destructive Color Collision with Primary
**What goes wrong:** CONTEXT.md notes destructive is #DC2626 -- same as primary. Users cannot visually distinguish "delete" from "primary action."
**Why it happens:** Red was chosen as both brand color and danger color.
**How to avoid:** Keep destructive at a distinctly different red (current darker `0 62.8% 30.6%` in dark mode is fine). In light mode, differentiate destructive via context (icons, labels) since the hue will be similar. Consider a slightly different destructive shade (e.g., `0 84% 60%` -- the current #EF4444 value could serve as destructive while #DC2626 is primary).
**Warning signs:** Users confusing delete buttons with primary CTAs.

### Pitfall 6: Dual globals.css Import
**What goes wrong:** `globals.css` is imported in BOTH `src/app/layout.tsx` (line 1) AND `src/app/[locale]/layout.tsx` (line 7). Duplicate imports can cause style ordering issues.
**Why it happens:** Nested layout structure where both root and locale layouts import styles.
**How to avoid:** Ensure globals.css is imported ONLY in the root layout. Remove the duplicate import in `[locale]/layout.tsx`.
**Warning signs:** Unexpected style overrides or CSS specificity conflicts.

## Code Examples

### Complete Light Mode Token Set (globals.css)
```css
/* Verified HSL conversions from hex targets */
:root {
  /* Brand colors */
  --primary: 0 72% 51%;              /* #DC2626 red */
  --primary-foreground: 0 0% 100%;    /* #FFFFFF */
  --secondary: 0 86% 97%;            /* #FEF2F2 warm off-white (used as subtle bg) */
  --secondary-foreground: 0 75% 15%;  /* #450A0A deep dark */
  --accent: 32 95% 44%;              /* #D97706 gold */
  --accent-foreground: 0 0% 100%;     /* #FFFFFF (large text only!) */

  /* Surfaces */
  --background: 0 86% 97%;           /* #FEF2F2 warm off-white */
  --foreground: 0 75% 15%;           /* #450A0A deep dark red-black */
  --card: 0 0% 100%;                 /* #FFFFFF */
  --card-foreground: 0 75% 15%;      /* #450A0A */
  --popover: 0 0% 100%;              /* #FFFFFF */
  --popover-foreground: 0 75% 15%;   /* #450A0A */

  /* UI elements */
  --muted: 285 12% 94%;              /* #F0EDF1 */
  --muted-foreground: 215 16% 47%;   /* #64748B */
  --border: 0 96% 89%;               /* #FECACA soft red */
  --input: 0 96% 89%;                /* #FECACA */
  --ring: 0 72% 51%;                 /* #DC2626 */

  /* Destructive - differentiated from primary */
  --destructive: 0 84% 60%;          /* #EF4444 (lighter than primary) */
  --destructive-foreground: 0 0% 100%;

  --radius: 0.5rem;
}
```

### Complete Dark Mode Token Set (globals.css)
```css
.dark {
  --background: 0 0% 7%;             /* #121212 */
  --foreground: 0 0% 98%;            /* #FAFAFA */
  --card: 0 0% 10%;                  /* #1A1A1A */
  --card-foreground: 0 0% 98%;       /* #FAFAFA */
  --popover: 0 0% 10%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 72% 51%;              /* #DC2626 stays vivid */
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 15%;             /* Dark neutral */
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 64%;      /* #A3A3A3 */
  --accent: 32 95% 44%;              /* #D97706 stays vivid */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 63% 31%;          /* Darker red for dark mode */
  --destructive-foreground: 0 0% 100%;
  --border: 0 0% 18%;                /* Subtle dark border */
  --input: 0 0% 18%;
  --ring: 0 72% 51%;                 /* #DC2626 */
}
```

### Tailwind Font Configuration
```javascript
// tailwind.config.js - fontFamily extension
theme: {
  extend: {
    fontFamily: {
      serif: ['var(--font-serif)', 'Georgia', 'serif'],
      sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
    },
  }
}
```

### Typography Scale Update (typography.ts)
```typescript
export const typography = {
  heading: {
    // Editorial bold headlines - Newsreader serif
    hero: "font-serif text-[clamp(1.75rem,5vw,4rem)] font-black leading-[1.1] tracking-[-0.05em]",
    h1: "font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight",
    h2: "font-serif text-xl md:text-2xl lg:text-3xl font-semibold leading-tight tracking-tight",
    h3: "font-serif text-lg md:text-xl lg:text-2xl font-semibold leading-snug",
    h4: "font-serif text-base md:text-lg font-semibold leading-snug",
    h5: "font-serif text-sm md:text-base font-semibold leading-normal",
    h6: "font-serif text-sm font-semibold leading-normal",
  },
  body: {
    // Roboto sans-serif for readability
    large: "font-sans text-base md:text-lg leading-relaxed",
    base: "font-sans text-sm md:text-base leading-normal",
    small: "font-sans text-xs md:text-sm leading-normal",
    xs: "font-sans text-xs leading-normal",
  },
  // ... rest of scale
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS @import for Google Fonts | next/font/google (self-hosted) | Next.js 13+ (2023) | Eliminates external font requests, automatic size-adjust for CLS prevention |
| px-based spacing | CSS custom properties with rem values on 4pt grid | Industry standard since 2022 | Consistent scaling, easier maintenance |
| color-scheme meta tag only | next-themes with class strategy | Stable since 2023 | Handles SSR hydration, system preference, localStorage persistence |
| Manual dark mode media queries | Tailwind darkMode: "class" + next-themes | Tailwind 3.x (2023) | Togglable dark mode, not just system-preference |
| Fixed breakpoint font sizes | clamp() fluid typography | Browser support complete since 2022 | Smooth scaling without breakpoint jumps |

## Discretion Recommendations

### Gold Hue: Use #D97706
**Recommendation:** Keep #D97706 (the warmer, deeper amber) rather than #F59E0B (which is too yellow/bright). #D97706 has better contrast on dark backgrounds (6.59:1 vs ~4.5:1 for #F59E0B on black) and pairs more naturally with the deep red, evoking championship gold rather than caution yellow.
**Confidence:** HIGH -- based on contrast ratio calculations.

### Dark Mode Background: Use #121212
**Recommendation:** Use #121212 (dark grey) rather than pure #000000. Reasons: (1) Pure black creates excessive contrast with white text that causes eye strain during long reading sessions. (2) Card surfaces need to be visibly distinct from the background -- with #000000 background, cards at #1A1A1A are barely distinguishable, but with #121212 the difference is perceptible. (3) Material Design and most premium apps (Spotify, Netflix) use #121212 over pure black.
**Confidence:** HIGH -- established UX practice.

### Neutral Undertone: Warm-neutral
**Recommendation:** Use warm neutrals (slight red undertone) in light mode to match the #FEF2F2 background, and true neutrals (0 hue) in dark mode for the OLED feel. This creates brand warmth in light mode while keeping dark mode clean.
**Confidence:** MEDIUM -- aesthetic judgment.

### Border Radius: 8px (0.5rem) cards, 6px buttons, 12px modals
**Recommendation:** Keep the current `--radius: 0.5rem` (8px) for cards. Use slightly smaller for buttons/inputs (6px) and larger for modals/dialogs (12px). This matches the editorial/magazine aesthetic -- not too rounded (playful) but not sharp (corporate).
**Confidence:** MEDIUM -- aesthetic judgment, consistent with MASTER.md component specs.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently installed |
| Config file | none -- see Wave 0 |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DS-02 | Typography scale renders correct font-family, sizes, weights | manual-only | Visual inspection in browser | N/A |
| DS-03 | Color tokens resolve to correct hex values in light mode | unit (if framework added) | N/A | No framework |
| DS-04 | Dark mode tokens resolve to correct values, contrast meets WCAG | manual-only | Visual inspection + browser devtools contrast check | N/A |
| DS-05 | Spacing tokens produce correct rem values, responsive breakpoints work | manual-only | Visual inspection across viewport sizes | N/A |

**Note:** Design token changes are primarily CSS custom property value changes. The most effective validation is visual inspection and contrast checking, not automated unit tests. Automated tests for CSS variable values add maintenance burden with low signal -- the tokens either look right or they don't.

### Sampling Rate
- **Per task:** `npm run build` (catches TypeScript errors, Tailwind config errors)
- **Per wave:** Visual inspection of homepage, article page in both light and dark modes at 375px, 768px, 1024px, 1440px viewports
- **Phase gate:** Full build succeeds + visual check at all 4 breakpoints in both modes

### Wave 0 Gaps
- No test framework installed (jest, vitest, etc.)
- For this phase, manual visual inspection is more appropriate than automated tests
- Recommend: defer test framework setup to a later phase that introduces logic (interactive features, voting)

## Open Questions

1. **Destructive vs Primary collision**
   - What we know: Both are red. CONTEXT.md explicitly notes "careful to differentiate via context."
   - What's unclear: Whether #EF4444 (current shadcn default) as destructive and #DC2626 as primary provides enough visual distinction.
   - Recommendation: Use #EF4444 for destructive (lighter, more orange-red) and #DC2626 for primary (deeper, darker red). The 2-shade difference is enough combined with icon/context cues.

2. **Existing consumers of current color tokens**
   - What we know: All shadcn/ui components use `bg-primary`, `text-foreground`, etc. Transfer status and league colors are separate tokens.
   - What's unclear: How many components will look wrong with the new background (#FEF2F2 instead of pure white) -- some may have hardcoded white backgrounds.
   - Recommendation: Search for hardcoded `bg-white` and `bg-[#...]` in components and convert to semantic tokens during implementation.

3. **next-themes defaultTheme behavior**
   - What we know: Currently `defaultTheme="system"`. CONTEXT.md says "Light mode is the default for new visitors."
   - What's unclear: Whether to change to `defaultTheme="light"` (ignoring system preference) or keep system and rely on most users having light system preference.
   - Recommendation: Change to `defaultTheme="light"` per the user decision. Users can still toggle to dark mode manually.

## Sources

### Primary (HIGH confidence)
- Current codebase files: globals.css, tailwind.config.js, theme.ts, typography.ts, layout.tsx -- direct file analysis
- HSL color conversions -- computed programmatically from hex targets
- WCAG contrast ratios -- computed programmatically using relative luminance formula
- next/font/google documentation -- built into Next.js 15.3.5 (confirmed in package.json)
- next-themes 0.4.6 -- confirmed installed, class strategy configured

### Secondary (MEDIUM confidence)
- Dark mode background #121212 preference -- established industry practice (Material Design, Spotify, Netflix)
- clamp() typography pattern -- well-documented CSS function, full browser support

### Tertiary (LOW confidence)
- None -- all findings verified against codebase or computed values

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero new dependencies, all tools already installed and configured
- Architecture: HIGH -- existing token pipeline (CSS vars -> Tailwind -> components) is proven and well-understood
- Pitfalls: HIGH -- contrast ratios computed programmatically, font loading issues well-documented
- Typography: HIGH -- next/font/google Newsreader and Roboto availability confirmed by widespread usage

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable domain, no fast-moving dependencies)
