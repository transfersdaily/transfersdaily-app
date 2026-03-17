# Phase 2: Navigation & Site Chrome - Research

**Researched:** 2026-03-17
**Domain:** Next.js navigation components, command palette search, accessible site chrome
**Confidence:** HIGH

## Summary

Phase 2 redesigns the site chrome (navbar, footer, command palette search) applying Phase 1 design tokens to all navigation elements. The existing codebase has a well-structured navbar (`navbar.tsx`, 263 lines) with sticky positioning, dropdown menus via Radix UI, mobile Sheet drawer, i18n integration, and a 4-column footer with collapsible mobile sections. All structures are sound and need restyling, not rewriting.

The main new capability is a command palette search (Cmd+K / Ctrl+K) that provides instant autocomplete results. The project already has `transfersApi.search()` and `searchApi` endpoints, plus Radix Dialog primitive. The recommended approach is to install `cmdk` (the standard React command palette library used by shadcn/ui) and build the palette on top of the existing search API with debounced queries.

**Primary recommendation:** Restyle existing navbar/footer with Phase 1 tokens and editorial minimalism. Add cmdk-based command palette as a new component. Keep all existing i18n, auth, and routing patterns intact.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Navbar: Minimal editorial style (The Athletic), sticky with backdrop blur, logo left, links center, search + theme toggle right
- Search: Command palette (Cmd+K / Ctrl+K) overlay with instant autocomplete results (articles, leagues, players), debounced
- No-results state: show suggestions and popular searches
- Existing search page stays as fallback (navigate from palette for full results)
- Footer: Keep existing 4-column structure, restyle with Phase 1 design tokens
- Mobile drawer: Keep Sheet pattern, restyle
- Skip-to-content link required
- Keyboard navigation must match visual tab order
- Nav height padding compensation on body
- 44x44px minimum touch targets for all nav interactive elements
- cursor-pointer on all clickable nav elements
- 150-300ms transitions for hover/focus states
- Navigation items should have both icon and text label
- Active page state visually highlighted
- All nav text uses t() translations via useDictionary()
- All links use getLocalizedPath() for locale-prefixed URLs

### Claude's Discretion
- Active state styling (red underline vs bold+color vs other)
- League navigation pattern (dropdown vs tabs vs mega menu)
- Command palette visual design details
- Autocomplete debounce timing and result count
- Exact footer spacing and typography sizes
- Mobile drawer design details

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | Redesigned public navbar with modern, clean look | Restyle existing `navbar.tsx` with Phase 1 tokens, editorial minimalism (The Athletic style), active state highlighting, skip-to-content link, icon+text labels |
| NAV-02 | Redesigned footer with organized layout | Restyle existing `Footer.tsx` with Phase 1 typography/colors/spacing tokens. Structure stays 4-column. Apply Newsreader headings, Roboto body, branded colors |
| NAV-03 | Improved search experience with better visual feedback | New command palette component (cmdk) with Cmd+K trigger, instant autocomplete via existing `transfersApi.search()`, keyboard navigation, no-results with suggestions |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| cmdk | 1.0.4 | Command palette primitive | De facto standard for React command palettes; used by shadcn/ui Command component; headless, composable, keyboard-first |
| @radix-ui/react-dialog | 1.1.14 | Modal overlay for command palette | Already installed; cmdk pairs with Dialog for overlay behavior |
| lucide-react | 0.525.0 | Icons for nav items | Already installed and used throughout navbar/footer |
| next-themes | 0.4.6 | Theme toggle | Already installed and integrated |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-dropdown-menu | 2.1.15 | League/transfer dropdowns | Already used in navbar for league and transfer type menus |
| @radix-ui/react-sheet (via shadcn) | - | Mobile drawer | Already used for mobile nav menu |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| cmdk | Custom Dialog + input | cmdk handles keyboard navigation, fuzzy matching, grouping for free; custom would be 300+ lines of tricky a11y code |
| Radix dropdowns | Headless UI | Already using Radix throughout; switching would create inconsistency |

**Installation:**
```bash
npm install cmdk@^1.0.4
```

Then generate the shadcn Command component:
```bash
npx shadcn@latest add command
```

This creates `src/components/ui/command.tsx` wrapping cmdk with project styling.

## Architecture Patterns

### Recommended Project Structure
```
src/components/
  navbar.tsx              # Restyled navbar (existing, modify)
  ClientNavbar.tsx        # Client wrapper (existing, minor updates)
  ServerNavbar.tsx        # Server wrapper (existing, keep)
  Footer.tsx              # Restyled footer (existing, modify)
  CommandSearch.tsx       # NEW: Command palette search component
  ThemeToggle.tsx         # Existing, keep
  LanguageSwitcher.tsx    # Existing, keep
  MobileBottomNav.tsx     # Existing, do NOT modify (Phase 9)
```

### Pattern 1: Command Palette with Existing Search API
**What:** A `CommandSearch` component using cmdk + Radix Dialog that calls `transfersApi.search()` with debounced input, showing grouped results (articles, leagues, players).
**When to use:** Triggered by Cmd+K / Ctrl+K keyboard shortcut or clicking the search icon in the navbar.
**Example:**
```typescript
// CommandSearch.tsx - Key structure
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useRouter } from 'next/navigation';
import { useDictionary } from '@/lib/dictionary-provider';
import { transfersApi } from '@/lib/api';
import { Search, Newspaper, Trophy, User } from 'lucide-react';

export function CommandSearch({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ articles: [], leagues: [], players: [] });
  const router = useRouter();
  const { t } = useDictionary();

  // Cmd+K / Ctrl+K listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) { setResults({ articles: [], leagues: [], players: [] }); return; }
    const timer = setTimeout(async () => {
      const data = await transfersApi.search(query, { language: locale });
      // Group results by type
      setResults(groupResults(data));
    }, 250); // 250ms debounce
    return () => clearTimeout(timer);
  }, [query, locale]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t('search.placeholder', 'Search transfers, leagues, players...')} value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>{t('search.noResults', 'No results found.')}</CommandEmpty>
        {/* Grouped results */}
      </CommandList>
    </CommandDialog>
  );
}
```

### Pattern 2: Active State via usePathname
**What:** Highlight current nav item using Next.js `usePathname()` to match against link hrefs.
**When to use:** All primary nav links need active state indication.
**Example:**
```typescript
import { usePathname } from 'next/navigation';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={cn(
        typography.nav.primary,
        'px-3 py-2 min-h-[44px] flex items-center transition-colors duration-fast',
        isActive
          ? 'text-primary border-b-2 border-primary font-semibold'
          : 'text-foreground hover:text-primary'
      )}
    >
      {children}
    </Link>
  );
}
```

### Pattern 3: Skip-to-Content Link
**What:** Visually hidden link that becomes visible on focus, jumping to `#main-content`.
**When to use:** First focusable element in the DOM, before the navbar.
**Example:**
```typescript
// In layout.tsx or navbar.tsx, rendered BEFORE the header
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[1000] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:font-medium"
>
  {t('accessibility.skipToContent', 'Skip to main content')}
</a>

// In layout.tsx, on the main content area
<main id="main-content" tabIndex={-1}>
  {children}
</main>
```

### Pattern 4: Navbar Height Compensation
**What:** Ensure sticky navbar does not overlap page content by adding padding-top equal to nav height.
**When to use:** The layout wrapper or body element needs offset for the sticky header.
**Example:**
```typescript
// The navbar is h-16 (64px). In globals.css or layout:
// Option A: CSS variable approach
:root { --navbar-height: 4rem; }
main { padding-top: var(--navbar-height); }

// Option B: Tailwind on layout wrapper
<main className="pt-16"> {/* matches h-16 navbar */}
```

### Anti-Patterns to Avoid
- **Don't duplicate navigation data:** Leagues and transferTypes arrays exist in `navbar.tsx` -- extract to a shared constant if needed by command palette, but do not define in multiple places
- **Don't break the Client/Server navbar split:** The existing `ServerNavbar -> Navbar` pattern enables server-side dictionary loading. Keep it; add CommandSearch inside the client Navbar component
- **Don't use z-50 for navbar:** Phase 1 established a z-index scale (`zIndex.sticky = z-20`). The navbar currently uses `z-50` which conflicts -- update to use the design token scale. Command palette overlay should use `zIndex.modal = z-[100]`
- **Don't forget locale prefixing:** Every new link must use `getLocalizedPath()`. The command palette search results must also link through localized paths
- **Don't use scale transforms on hover for nav items:** MASTER.md forbids layout-shifting hovers. Use color/opacity/border transitions instead

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Command palette keyboard nav | Custom arrow-key handling, focus trapping | cmdk library | Handles focus management, keyboard navigation, fuzzy matching, grouping, screen reader announcements |
| Dropdown menus | Custom dropdown with click-outside detection | Radix DropdownMenu (already used) | Already integrated, handles accessibility, focus trapping, portaling |
| Modal overlay for search | Custom overlay with backdrop | Radix Dialog (via cmdk CommandDialog) | Handles body scroll lock, focus trap, escape dismiss, aria attributes |
| Debounce logic | Custom debounce utility | setTimeout with cleanup in useEffect | Simple enough pattern; no library needed for a single debounce |
| Theme toggle | Custom localStorage + class toggling | next-themes (already used) | Already handles SSR, system preference, localStorage persistence |

**Key insight:** The existing codebase already has all UI primitives (Dialog, DropdownMenu, Sheet, Button) from shadcn/Radix. The only new dependency needed is `cmdk` for the command palette. Everything else is restyling.

## Common Pitfalls

### Pitfall 1: Hydration Mismatch on Active State
**What goes wrong:** Using `usePathname()` in a server-rendered component causes mismatch because pathname is only known client-side.
**Why it happens:** The navbar renders server-side via `ServerNavbar` but active state requires client-side pathname.
**How to avoid:** The navbar is already `'use client'` so `usePathname()` works. Ensure the active state class is added in the client component, not in `ServerNavbar.tsx`.
**Warning signs:** React hydration warnings in console about class name mismatches.

### Pitfall 2: Command Palette Focus Trap Breaking Tab Order
**What goes wrong:** When command palette closes, focus returns to wrong element or gets lost.
**Why it happens:** cmdk + Radix Dialog handles this automatically IF used correctly. Breaking the pattern (e.g., manual focus management) causes issues.
**How to avoid:** Use `CommandDialog` from shadcn/ui which wraps both cmdk and Radix Dialog. Do not add custom focus management on top.
**Warning signs:** After closing palette, pressing Tab doesn't go where expected.

### Pitfall 3: Search API Over-Calling
**What goes wrong:** Every keystroke fires a search API call, causing rate limiting or poor performance.
**Why it happens:** Not debouncing input or debounce too short.
**How to avoid:** Debounce at 250ms minimum. Don't trigger search for queries shorter than 2 characters. Cancel pending requests when a new one fires (AbortController).
**Warning signs:** Network tab showing rapid-fire search requests, slow response times.

### Pitfall 4: Footer Mobile Links Missing Locale Prefix
**What goes wrong:** Footer mobile collapsible sections have hardcoded paths without locale prefix (lines 200-233 of `Footer.tsx`).
**Why it happens:** The mobile section currently uses plain paths like `"/latest"` instead of `getLocalizedPath("/latest")`.
**How to avoid:** During footer restyle, ensure ALL links in both desktop and mobile sections use `getLocalizedPath()`.
**Warning signs:** Clicking footer links on non-English locale goes to English version.

### Pitfall 5: Z-Index Conflicts
**What goes wrong:** Command palette appears behind other elements, or navbar z-index is inconsistent.
**Why it happens:** Navbar uses `z-50` but Phase 1 theme established `zIndex.sticky = z-20`, `zIndex.modal = z-[100]`.
**How to avoid:** Update navbar from `z-50` to `z-20`. Use `z-[100]` for the command palette overlay. Dropdown menus use `z-10` (already handled by Radix portaling).
**Warning signs:** Visual stacking issues, elements peeking through overlays.

### Pitfall 6: Missing Reduced Motion Support
**What goes wrong:** Transitions/animations on nav elements ignore user preference for reduced motion.
**Why it happens:** Adding CSS transitions without `prefers-reduced-motion` media query.
**How to avoid:** Use the existing `motion.respectMotion` utility from theme.ts (`motion-safe:transition-all motion-reduce:transition-none`) or Tailwind's `motion-safe:` / `motion-reduce:` prefixes.
**Warning signs:** MASTER.md checklist failure on `prefers-reduced-motion` check.

## Code Examples

### Restyled Navbar Header Element
```typescript
// Updated header with design tokens
<header className="sticky top-0 z-20 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-16 items-center justify-between">
    {/* Skip to content - first focusable element */}
    {/* Logo with typography.logo.navbar */}
    {/* Center nav links with active state */}
    {/* Right actions: search trigger, language, theme, user */}
  </div>
</header>
```

### Command Palette Trigger in Navbar
```typescript
// Search button that triggers command palette
<Button
  variant="ghost"
  size="icon"
  className="text-foreground hover:text-primary min-h-[44px] min-w-[44px] cursor-pointer transition-colors duration-fast"
  onClick={() => setSearchOpen(true)}
>
  <Search className="h-4 w-4" />
  <span className="sr-only">{t('common.search', 'Search')}</span>
  <kbd className="hidden sm:inline-flex ml-1 text-xs text-muted-foreground">
    {/* Show Cmd+K hint on desktop */}
    <span className="text-xs">⌘K</span>
  </kbd>
</Button>
```

### Footer Heading with Design Tokens
```typescript
// Footer section heading using Phase 1 typography
<h4 className={cn(typography.body.small, 'font-semibold text-primary uppercase tracking-wider')}>
  {t('footer.leagues', 'Leagues')}
</h4>
```

### Active Nav Link with Icon + Text
```typescript
// Per UI/UX Pro Max nav-label-icon rule
<NavLink href={getLocalizedPath('/latest')} icon={<Newspaper className="h-4 w-4" />}>
  {t('navigation.latest', 'Latest')}
</NavLink>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Search page only | Command palette + search page fallback | 2024+ | Standard UX pattern (Notion, Vercel, The Verge) |
| z-50 hardcoded | Design token z-index scale | Phase 1 | Prevents stacking conflicts |
| Generic shadcn colors | Branded red+gold palette | Phase 1 | All nav elements must use branded tokens |
| System font fallbacks | Newsreader serif + Roboto sans | Phase 1 | Nav uses typography.nav.primary (Roboto) |
| cmdk 0.x | cmdk 1.0 | 2024 | New API with better composability; shadcn Command component uses 1.0 |

**Deprecated/outdated:**
- The navbar currently uses `z-50` -- must migrate to `z-20` from the Phase 1 z-index scale
- Footer mobile links use hardcoded paths without locale prefix -- must fix during restyle

## Open Questions

1. **Search API Result Grouping**
   - What we know: `transfersApi.search()` returns Transfer objects. League/player data may come from `adminApi` endpoints.
   - What's unclear: Whether the search endpoint returns diverse result types (articles vs players vs leagues) or only transfers.
   - Recommendation: Build command palette with transfer results first. If the API only returns transfers, group by league or status. If distinct types are needed, add simple client-side category matching for leagues (match query against known league names array).

2. **Popular Searches for No-Results State**
   - What we know: `searchApi.getMostSearched()` exists and returns trending terms for the sidebar.
   - What's unclear: Whether this endpoint is fast enough for inline display in the command palette.
   - Recommendation: Cache popular searches on mount (single call when palette opens). Display cached list in empty/no-results state.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed |
| Config file | None |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAV-01 | Navbar renders with correct styling, active state, skip-to-content | manual-only | Visual inspection in browser at multiple breakpoints | N/A |
| NAV-02 | Footer renders with design tokens, 4-column layout, collapsible mobile | manual-only | Visual inspection in browser at mobile + desktop | N/A |
| NAV-03 | Command palette opens on Cmd+K, shows results, keyboard navigable | manual-only | Manual test: press Cmd+K, type query, arrow keys, Enter to navigate | N/A |

**Justification for manual-only:** No test framework is installed. These are primarily visual/interactive UI components. Phase scope is restyling + one new component. Adding a test framework would expand scope beyond phase boundary.

### Sampling Rate
- **Per task commit:** Manual browser check at 375px, 768px, 1440px
- **Per wave merge:** Full manual walkthrough of navbar, footer, command palette in both light/dark mode
- **Phase gate:** All nav elements visible, accessible, keyboard navigable, i18n working on non-English locale

### Wave 0 Gaps
- No test framework installed (out of scope per REQUIREMENTS.md: "Full test suite - Address during later milestone")
- Manual verification checklist should be defined in each plan

## Sources

### Primary (HIGH confidence)
- Existing codebase: `navbar.tsx`, `Footer.tsx`, `ClientNavbar.tsx`, `ServerNavbar.tsx` -- read directly
- Existing design tokens: `theme.ts`, `typography.ts`, `globals.css`, `tailwind.config.js` -- read directly
- Existing search API: `api.ts` (transfersApi.search, searchApi) -- read directly
- CONTEXT.md user decisions -- read directly

### Secondary (MEDIUM confidence)
- cmdk library (pacocoursey/cmdk) -- well-established React command palette library used by shadcn/ui; standard choice for this pattern
- shadcn/ui Command component -- built on cmdk + Radix Dialog, matches existing project patterns

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed except cmdk; cmdk is the de facto standard for command palettes in React/Next.js
- Architecture: HIGH - restyling existing components with known design tokens; patterns verified against actual codebase
- Pitfalls: HIGH - identified from reading actual code (hardcoded paths, z-index conflicts, hydration concerns)

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable domain, existing codebase, no rapidly moving dependencies)
