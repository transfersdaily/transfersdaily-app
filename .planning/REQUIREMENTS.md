# Requirements: TransfersDaily UX/UI Overhaul

**Defined:** 2026-03-17
**Core Value:** Readers experience fast, trustworthy transfer news wrapped in a premium editorial design that maximizes engagement and ad revenue.

## v1 Requirements

Requirements for initial release. Focus: make the website look better — visual redesign, component consolidation, mobile UX, ad optimization.

### Design System

- [ ] **DS-01**: Consolidated reusable card component system (article cards, league cards, transfer cards) replacing scattered one-off components
- [x] **DS-02**: Premium editorial typography scale with proper hierarchy (headlines, body, captions, metadata)
- [x] **DS-03**: Branded color system distinct from generic shadcn defaults, reflecting sports media identity
- [x] **DS-04**: Consistent dark/light mode theming across all public pages
- [x] **DS-05**: Responsive design tokens (spacing scale, breakpoints, container widths, grid system)
- [ ] **DS-06**: Micro-animation system using framer-motion (page transitions, hover states, card reveals, loading)
- [ ] **DS-07**: Consolidated single AdSlot component replacing 12 duplicate ad components (AdInContent1/2/3, AdSidebar, AdBanner, etc.)

### Article Experience

- [ ] **ART-01**: Hero image with gradient overlay on article detail pages
- [ ] **ART-02**: Reading time estimate displayed prominently on article pages
- [ ] **ART-03**: Social sharing buttons (copy link, X/Twitter, WhatsApp)
- [ ] **ART-04**: Breadcrumb navigation on article pages
- [ ] **ART-05**: Related articles section at bottom of article pages using new card system
- [ ] **ART-06**: Skeleton loading states for article content and images
- [ ] **ART-07**: Sticky reading progress bar showing scroll position while reading articles
- [ ] **ART-08**: Decompose article page from 726+ lines into clean, maintainable sub-components

### Homepage

- [ ] **HOME-01**: Redesigned hero/featured article section with strong visual impact
- [ ] **HOME-02**: Category-based transfer feeds (confirmed transfers, rumors, completed deals)
- [ ] **HOME-03**: Trending/popular articles sidebar widget
- [ ] **HOME-04**: Mobile-optimized homepage layout with responsive grid
- [ ] **HOME-05**: Decompose homepage from 925+ lines into clean, maintainable sub-components
- [ ] **HOME-06**: Switch from force-dynamic to ISR with revalidation for performance

### Mobile UX

- [ ] **MOB-01**: Touch-friendly navigation with 48px+ tap targets throughout public pages
- [ ] **MOB-02**: Swipeable content carousels for browsing articles and transfers
- [ ] **MOB-03**: Collapsing sticky header that hides on scroll down, shows on scroll up
- [ ] **MOB-04**: Refined mobile bottom navigation bar
- [ ] **MOB-05**: Mobile-first responsive layouts across all public pages

### Navigation & Chrome

- [x] **NAV-01**: Redesigned public navbar with modern, clean look
- [x] **NAV-02**: Redesigned footer with organized layout
- [ ] **NAV-03**: Improved search experience with better visual feedback

### Ad Optimization

- [ ] **AD-01**: CLS-safe ad containers with reserved heights to prevent layout shift
- [ ] **AD-02**: Lazy-loaded ad slots that don't block initial page render
- [ ] **AD-03**: Real shouldShowAds() validation logic (replace always-true bypass)

## v2 Requirements

Deferred to next milestone. Interactive engagement features inspired by football YouTuber content.

### Interactive Engagement

- **ENG-01**: Player tier list ranking — drag-and-drop tiers (Crucial Player / Keep / Undecided / Loan / Sell) for squad reviews
- **ENG-02**: Interactive squad formation viewer — team lineup display with player positions and transfer indicators (in/out arrows)
- **ENG-03**: Player of the Matchweek voting — poll-style fan voting with player photos and results visualization
- **ENG-04**: Anonymous player performance ratings (1-10 scale) on articles
- **ENG-05**: Transfer comparison voting ("Who was the better transfer?")
- **ENG-06**: Community vote result visualization (requires lightweight API endpoint)
- **ENG-07**: Transfer window countdown timer
- **ENG-08**: Hot transfers leaderboard
- **ENG-09**: Daily engagement polls on homepage

## Out of Scope

| Feature | Reason |
|---------|--------|
| Admin dashboard redesign | Works well enough, public-facing is priority |
| Backend API changes | Work within existing proxy layer; v2 may need lightweight vote API |
| Authentication system changes | Keep current Cognito setup |
| User accounts for voting | Anonymous-first for maximum engagement (v2 feature) |
| Full test suite | Address during later milestone |
| SEO overhaul | Maintain existing SEO, don't regress, but not primary focus |
| Real-time chat/comments | High complexity, low initial value |
| Video content support | Storage/bandwidth costs, defer |
| Mobile native app | Web-first, responsive approach |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DS-01 | Phase 3 | Pending |
| DS-02 | Phase 1 | Complete |
| DS-03 | Phase 1 | Complete |
| DS-04 | Phase 1 | Complete |
| DS-05 | Phase 1 | Complete |
| DS-06 | Phase 8 | Pending |
| DS-07 | Phase 4 | Pending |
| ART-01 | Phase 6 | Pending |
| ART-02 | Phase 6 | Pending |
| ART-03 | Phase 7 | Pending |
| ART-04 | Phase 6 | Pending |
| ART-05 | Phase 7 | Pending |
| ART-06 | Phase 7 | Pending |
| ART-07 | Phase 7 | Pending |
| ART-08 | Phase 6 | Pending |
| HOME-01 | Phase 5 | Pending |
| HOME-02 | Phase 5 | Pending |
| HOME-03 | Phase 5 | Pending |
| HOME-04 | Phase 5 | Pending |
| HOME-05 | Phase 5 | Pending |
| HOME-06 | Phase 5 | Pending |
| MOB-01 | Phase 9 | Pending |
| MOB-02 | Phase 9 | Pending |
| MOB-03 | Phase 9 | Pending |
| MOB-04 | Phase 9 | Pending |
| MOB-05 | Phase 9 | Pending |
| NAV-01 | Phase 2 | Complete |
| NAV-02 | Phase 2 | Complete |
| NAV-03 | Phase 2 | Pending |
| AD-01 | Phase 4 | Pending |
| AD-02 | Phase 4 | Pending |
| AD-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 32 total
- Mapped to phases: 32
- Unmapped: 0

---
*Requirements defined: 2026-03-17*
*Last updated: 2026-03-17 after roadmap phase mapping*
