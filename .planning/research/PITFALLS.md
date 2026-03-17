# Pitfalls Research

**Domain:** Sports media blog UX/UI overhaul with interactive features and ad optimization
**Researched:** 2026-03-17
**Confidence:** HIGH (based on codebase analysis + domain knowledge)

## Critical Pitfalls

### Pitfall 1: Big Bang Redesign Breaks Existing Traffic and SEO

**What goes wrong:**
Redesigning the homepage and article pages simultaneously breaks existing URL structures, meta tags, image paths, or layout in ways that tank organic search traffic. Google re-indexes the site, finds broken structured data or shifted content, and drops rankings. For a sports news site where traffic is time-sensitive (transfer windows), losing even 2 weeks of SEO visibility is devastating.

**Why it happens:**
Teams focus on visual transformation and forget that the existing site has established crawl patterns, link equity, and social sharing metadata. Moving from force-dynamic to ISR, changing component structures, or reorganizing routes silently breaks `generateMetadata`, OpenGraph images, and canonical URLs.

**How to avoid:**
- Treat SEO metadata as a regression test surface: snapshot every public page's meta tags, OG images, canonical URLs, and structured data BEFORE starting the redesign
- Change rendering strategy (force-dynamic to ISR) as a separate, isolated step with traffic monitoring before and after
- Keep all existing URL structures intact; never rename routes during a visual redesign
- Validate `robots.ts` and `sitemap.ts` output after each phase

**Warning signs:**
- No automated checks for meta tag output before/after component changes
- Plausible analytics showing traffic drop after deploying redesigned pages
- Google Search Console showing increased "Page not indexed" errors

**Phase to address:**
Phase 1 (Design System Foundation) -- establish meta tag snapshot tests before touching any page components

---

### Pitfall 2: Component Consolidation That Breaks Working Pages

**What goes wrong:**
The codebase has 115 component files, many with overlapping purposes (Footer/ClientFooter/ServerFooter, Pagination/ui/pagination, navbar.tsx/ClientNavbar/ServerNavbar). Consolidating these into a design system seems straightforward but creates cascading breakage because components have subtle behavioral differences, different data-fetching patterns, or different client/server boundaries that aren't obvious from their names.

**Why it happens:**
Developers see duplicate-looking components and merge them without understanding WHY they were separated. In Next.js 15, Client/Server component boundaries are a critical architectural concern. `ServerNavbar` vs `ClientNavbar` isn't duplication -- it's the RSC boundary. Merging them breaks hydration or removes server-side rendering benefits.

**How to avoid:**
- Audit every component pair before consolidation: document which are Server Components, which are Client Components, and why
- Consolidate visuals (shared styling tokens, shared sub-components) without merging the client/server boundary wrappers
- Create a "component inventory" spreadsheet: name, type (server/client), dependencies, pages that use it, line count
- Consolidate in dependency order: leaf components first, page-level components last

**Warning signs:**
- Hydration mismatch errors appearing in console after consolidation
- Pages that were server-rendered now showing loading spinners
- Bundle size increasing after "consolidation" because server components got pulled client-side

**Phase to address:**
Phase 1 (Design System Foundation) -- inventory first, consolidate incrementally with per-page verification

---

### Pitfall 3: Anonymous Voting System Gamed Within Hours

**What goes wrong:**
Anonymous voting on player ratings and transfer comparisons is trivially exploitable. Football fans are passionate and tribal -- they WILL organize brigades to pump their favorite player's ratings or tank a rival's. Without server-side validation, a single person with browser DevTools or a script can submit thousands of votes. The ratings become meaningless, users lose trust, and the feature becomes a liability rather than a differentiator.

**Why it happens:**
The constraint says "no backend changes" and "all interactive features use client-side state or existing APIs." This pushes vote storage to localStorage or client-side state, where there is zero enforcement. Even adding fingerprinting client-side can be bypassed by clearing storage or using incognito mode.

**How to avoid:**
- Accept that truly anonymous voting without ANY server component is not viable for meaningful results. At minimum, you need a lightweight vote-recording endpoint (even a simple API route that writes to DynamoDB through the existing proxy)
- Implement layered rate limiting: IP-based throttling (via existing API proxy or middleware), browser fingerprint hashing (not as primary defense, but as a signal), and temporal decay (recent votes weighted higher to dilute brigading)
- Design the UX to show "community sentiment" not "definitive ratings" -- framing matters. "72% of fans rated this transfer as good" is more resilient to gaming than "Transfer score: 4.2/5"
- Add anomaly detection: if a player's rating changes by more than 20% in an hour, flag for review
- Consider requiring a lightweight "proof of engagement" -- user must have scrolled through the article or spent 30+ seconds on page before vote counts

**Warning signs:**
- Vote counts per article far exceed page view counts (impossible without manipulation)
- Rating distributions are bimodal (all 1s and 5s) instead of natural bell curves
- Sudden rating spikes correlated with social media posts ("go rate X on TransfersDaily")

**Phase to address:**
Phase dedicated to Interactive Features -- this needs its own focused implementation, not bolted onto the design system phase. Must be addressed BEFORE launch of voting features.

---

### Pitfall 4: Ad Revenue Drops During Redesign Transition

**What goes wrong:**
Redesigning page layouts changes ad viewability, ad density, and content-to-ad ratios. AdSense revenue is extremely sensitive to ad placement -- moving an ad unit from above-the-fold to below-the-fold can cut its revenue by 60-80%. Simultaneously, the codebase has `shouldShowAds()` returning `true` always, duplicate ad components (AdInContent1/2/3, AdSidebar/2), and the AdSense publisher ID hardcoded in the component. A redesign that "cleans up" ads without A/B testing placements can slash revenue.

**Why it happens:**
Developers treat ads as an afterthought -- "we'll figure out ad placement after the design looks good." But ad placement IS part of the design. Google's ad policies require specific content-to-ad ratios, and viewability metrics (how long an ad is visible in viewport) directly determine revenue per impression.

**How to avoid:**
- Document current ad placement positions and their approximate revenue contribution BEFORE redesigning (check AdSense dashboard for per-slot performance)
- Design WITH ad slots, not around them. Every page wireframe should include designated ad positions
- Fix `shouldShowAds()` to use the existing `validateContentQuality()` function -- the validation logic is already written but bypassed
- Replace the numbered ad components (AdInContent1/2/3) with a single configurable `AdSlot` component that takes position as a prop
- Implement ad viewability tracking (Intersection Observer) to compare before/after redesign
- Never remove an ad slot without checking its revenue -- some "ugly" placements are the highest earners

**Warning signs:**
- AdSense reporting shows RPM (revenue per mille) declining after redesign deployment
- Ad viewability scores dropping below 50% (industry threshold for premium inventory)
- AdSense policy warnings about ad density or content quality

**Phase to address:**
Must be addressed in EVERY phase that touches page layouts. Ad slot positions should be defined during Design System phase and protected as first-class layout constraints.

---

### Pitfall 5: Design System Over-Engineering Delays Visible Progress

**What goes wrong:**
Teams spend 6-8 weeks building a comprehensive design system with perfect tokens, variant APIs, documentation, and Storybook stories before changing a single visible page. Meanwhile, stakeholders see no progress, the existing site continues looking generic, and motivation drops. The design system becomes an end in itself rather than a means to redesign the site.

**Why it happens:**
Component consolidation feels like the "right" engineering approach. With 115 components and known sprawl, it is tempting to "fix the foundation first." But a sports media site needs to LOOK premium fast -- the value is in the user-facing transformation, not internal component architecture.

**How to avoid:**
- Timebox design system work to 1-2 weeks maximum for the initial pass. Define tokens (colors, typography, spacing) and build only the components needed for the first redesigned page
- Redesign ONE high-impact page first (homepage or article page) using the new system. This forces the design system to solve real problems rather than hypothetical ones
- Build design system components on-demand as pages need them, not upfront
- Measure progress by "pages redesigned" not "components built"

**Warning signs:**
- More than 2 weeks spent on design system before any page looks different
- Component count increasing (building new abstractions) rather than decreasing (consolidating existing)
- Design tokens defined for scenarios that no page currently needs

**Phase to address:**
Phase 1 -- must be structured as "design system + first page redesign" not "design system then redesign"

---

### Pitfall 6: Mobile Redesign as Desktop Afterthought

**What goes wrong:**
Sports news consumption is overwhelmingly mobile -- 65-75% of traffic on sports sites comes from mobile devices. Designing desktop-first and then "making it responsive" produces a mobile experience that feels like a shrunken desktop site: tiny touch targets, horizontal scrolling, ads that push content below the fold, and voting interactions that require precision tapping.

**Why it happens:**
Development happens on desktop monitors. Screenshots and reviews happen on desktop. The existing codebase already has mobile-specific components (MobileBottomNav, ArticlesTableMobile, MobileActionBar) that suggest mobile was handled reactively. The admin panel has 8+ mobile-specific components, indicating a pattern of building desktop-first then patching mobile.

**How to avoid:**
- Design mobile layouts FIRST for all public pages. Desktop layout is the adaptation, not the other way around
- Set Chrome DevTools to mobile viewport as the default development view
- Interactive features (voting, ratings) must be designed for thumb-zone interaction on a 375px viewport
- Test all ad placements on mobile -- mobile ad formats (sticky bottom, in-feed) perform differently than desktop (sidebar, leaderboard)
- Eliminate the pattern of separate Mobile* components. Build responsive components that adapt, not duplicate components per viewport

**Warning signs:**
- PR reviews showing only desktop screenshots
- Touch targets smaller than 44x44px on interactive elements
- Mobile Lighthouse performance score below 60
- Ad components with separate mobile versions instead of responsive adaptation

**Phase to address:**
EVERY phase -- mobile-first must be a design constraint, not a phase. But explicitly addressed in Design System phase by establishing mobile-first breakpoint tokens.

---

### Pitfall 7: Losing i18n Coverage During Component Rewrites

**What goes wrong:**
The site supports multiple locales (en, es, it visible in the codebase). When redesigning components, developers hardcode English strings in new components, forget to use the translation function, or restructure components in ways that break dictionary key access. The non-English versions of the site silently degrade -- showing English text, translation keys, or empty strings.

**Why it happens:**
i18n is invisible during English-language development. There are no tests for translation coverage (noted in CONCERNS.md). New interactive features (voting prompts, rating labels, leaderboard headers) all need translation keys, but developers building these features think in English first and add i18n as an afterthought.

**How to avoid:**
- Require every new component to accept translated strings as props or use the dictionary hook -- no hardcoded user-facing strings
- Add a lint rule or CI check that flags hardcoded strings in JSX (eslint-plugin-i18n-json or custom ESLint rule)
- Test the site in a non-English locale during every PR review
- For interactive features: define all user-facing strings in dictionaries BEFORE building the component

**Warning signs:**
- New components with hardcoded English strings in JSX
- Dictionary files not updated in PRs that add new UI elements
- Non-English pages showing mixed languages (some translated, some English)

**Phase to address:**
Phase 1 (Design System) -- establish the i18n pattern for new components. Enforce in every subsequent phase.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Numbered ad components (AdInContent1/2/3) | Quick ad placement | Cannot A/B test, cannot programmatically manage ad density, impossible to optimize | Never -- consolidate into single configurable component |
| `force-dynamic` on homepage | Guarantees fresh data | Eliminates caching, forces server render on every request, higher TTFB | Never for a news homepage -- use ISR with 60s revalidation |
| localStorage for vote persistence | No backend needed | Trivially clearable, no cross-device persistence, lost on browser reset | Only as a UI hint ("you voted"), never as the vote store |
| Separate Mobile* components | Fast mobile fix | Doubles maintenance surface, mobile/desktop drift apart over time | Never -- build responsive components instead |
| `shouldShowAds()` returning true always | Ads show everywhere | AdSense policy violations, ads on empty/placeholder pages, potential account suspension | Never -- implement the validation that already exists in the same file |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| AdSense | Pushing multiple `adsbygoogle.push({})` on SPA navigation without cleanup | Track which ad slots have been pushed; clean up on route change; use a ref to prevent double-push (current code already uses ref but doesn't handle SPA navigation cleanup) |
| AdSense | Hardcoding `data-ad-client` in component JSX | Move publisher ID to environment variable; current code has `ca-pub-6269937543968234` directly in AdSense.tsx |
| Plausible Analytics | Not tracking custom events for interactive features | Configure Plausible custom events for votes, ratings, and engagement actions; otherwise you cannot measure feature success |
| CloudFront/S3 images | Aggressive 1-year cache headers on mutable images | Use content-hash URLs or reduce cache duration; implement cache invalidation for updated images |
| Next.js ISR | Expecting ISR pages to show real-time data | ISR with 60s revalidation means data can be up to 60s stale; for transfer news this is acceptable, but voting counts need client-side hydration on top of ISR |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| No request deduplication | Same article data fetched 3+ times per page load | Implement React Query or SWR with shared cache | Immediately visible on article pages with sidebar + recommendations |
| All articles loaded without pagination | Homepage takes 3+ seconds to load as content grows | Server-side pagination with ISR; load first page statically, paginate dynamically | Beyond ~200 articles |
| Client-side voting state in React state/localStorage | State lost on refresh, cannot aggregate across users | Minimum viable vote API endpoint, even if just writing to DynamoDB | Immediately -- votes are meaningless without persistence |
| Multiple AdSense push() calls on navigation | Ads fail to render, console errors multiply, blank ad slots | Singleton ad manager that tracks lifecycle; cleanup on unmount | On any SPA navigation between pages |
| 925-line homepage component | Slow HMR, impossible to lazy-load sections, all-or-nothing render | Decompose into section components (HeroSection, FeedSection, TrendingSection) with individual Suspense boundaries | Already a problem (noted in CONCERNS.md) |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Client-side vote validation only | Votes manipulated via DevTools or scripted requests | Server-side vote recording with rate limiting per IP; client-side validation is UX only |
| No CAPTCHA or proof-of-humanity on voting | Bots can mass-vote to manipulate ratings | Add lightweight challenge (invisible reCAPTCHA or time-on-page threshold) for high-volume voters |
| Exposing AdSense publisher ID in client bundle | Competitor intelligence; not a direct security risk but enables ad fraud patterns | Accept that publisher ID must be client-side for AdSense; focus on monitoring for invalid traffic in AdSense dashboard |
| Image proxy without URL allowlist (existing SSRF) | Internal AWS services accessible through proxy | Implement URL allowlist before adding any user-generated content features that reference images |
| No rate limiting on any endpoint | DDoS via image proxy or future vote endpoints | Add rate limiting middleware to all public API routes; critical before launching voting features |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Ads between every article card on mobile | Users scroll past content to find more content; bounces increase; "this site is all ads" perception | Maximum 1 ad per 3-4 content items on mobile; use in-feed native-style ads that match card design |
| Vote confirmation too subtle | Users tap vote button, nothing visible happens, they tap again, frustrated | Immediate visual feedback (animation, color change, count increment) within 100ms; optimistic UI update |
| Rating system requires too many taps | Users abandon multi-step rating flows on mobile | Single-tap rating (1-5 stars or thumbs up/down); avoid sliders on mobile |
| Leaderboard without context | Raw numbers meaningless -- "Transfer score: 78" means nothing | Always show relative context: "Rated better than 85% of transfers this window" |
| Dark mode that breaks ad appearance | Ads render with white backgrounds on dark pages creating visual jarring | Add ad container styling that softens contrast; use AdSense native ad styling that inherits theme |
| Loading states that shift layout (CLS) | Content jumps around as ads and images load; frustrating on mobile | Reserve explicit height for ad slots and images via aspect-ratio containers; skeleton states must match final dimensions |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Design system tokens defined:** Often missing dark mode variants -- verify every color token has a dark mode equivalent tested on actual pages
- [ ] **Article page redesign:** Often missing ad slot height reservations -- verify no Cumulative Layout Shift when ads load on slow connections
- [ ] **Voting feature "working":** Often missing persistence -- verify votes survive page refresh, incognito mode, and cross-device
- [ ] **Mobile layout "responsive":** Often missing touch-target sizing -- verify all interactive elements are minimum 44x44px with adequate spacing
- [ ] **Component consolidation "complete":** Often missing i18n for new components -- verify every user-facing string uses dictionary lookup, test in non-English locale
- [ ] **Homepage "redesigned":** Often missing ISR configuration -- verify page is not still force-dynamic; check TTFB with and without cache
- [ ] **Ad optimization "improved":** Often missing viewability measurement -- verify you can actually MEASURE viewability before claiming improvement
- [ ] **Rating display "showing data":** Often missing empty states -- verify what users see when zero votes exist (not "NaN" or "0/5")

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| SEO regression from redesign | MEDIUM | Revert to previous meta tag structure; submit updated sitemap to Google; monitor Search Console for 2 weeks; re-deploy with fixed metadata |
| Vote manipulation discovered | LOW | Reset vote data for affected entities; implement server-side validation; re-launch with rate limiting; communicate "ratings reset" to users |
| AdSense policy violation | HIGH | Immediately fix content validation; remove ads from non-compliant pages; appeal in AdSense dashboard; may take 2-4 weeks for reinstatement |
| Component consolidation broke pages | MEDIUM | Git revert the consolidation commit; re-approach incrementally (one component pair at a time); add visual regression tests before next attempt |
| i18n regression in non-English locales | LOW | Run translation coverage script; add missing keys to dictionaries; deploy fix; add CI check to prevent recurrence |
| Mobile performance degraded | LOW-MEDIUM | Run Lighthouse CI on mobile; identify largest regressions; optimize images and defer non-critical JS; usually fixable within a sprint |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Big bang redesign breaks SEO | Phase 1 (Foundation) | Meta tag snapshot tests passing; Plausible traffic stable after each deployment |
| Component consolidation breakage | Phase 1 (Foundation) | Component inventory complete; each consolidation verified on all consuming pages |
| Anonymous voting abuse | Interactive Features phase | Server-side vote recording implemented; anomaly detection in place before public launch |
| Ad revenue drops | Every layout phase | AdSense RPM compared before/after each phase; viewability metrics tracked |
| Design system over-engineering | Phase 1 (Foundation) | At least 1 page visibly redesigned within first 2 weeks |
| Mobile as afterthought | Every phase | Mobile screenshots required in every PR; Lighthouse mobile score tracked |
| i18n regression | Every phase | Non-English locale tested per PR; no hardcoded strings in new components |
| force-dynamic performance | Phase 1 or Homepage phase | Homepage uses ISR; TTFB under 500ms on cached requests |
| shouldShowAds bypass | Ad optimization phase | `shouldShowAds()` uses `validateContentQuality()`; ads hidden on empty/placeholder pages |
| SSRF via image proxy | Phase 1 (Foundation) | URL allowlist implemented before any new user-facing image features |

## Sources

- Codebase analysis: 115 component files audited, ad components inspected, homepage and content-validation examined
- `.planning/codebase/CONCERNS.md`: tech debt, security issues, performance bottlenecks documented 2026-03-17
- `.planning/PROJECT.md`: project constraints and requirements
- AdSense policy knowledge: content quality requirements, ad density limits, viewability thresholds (HIGH confidence -- well-established policies)
- Next.js RSC patterns: client/server component boundary pitfalls (HIGH confidence -- core framework behavior)
- Sports media UX patterns: mobile-first consumption, engagement feature design (MEDIUM confidence -- industry pattern knowledge)

---
*Pitfalls research for: TransfersDaily UX/UI overhaul*
*Researched: 2026-03-17*
