# TransfersDaily UX/UI Overhaul

## What This Is

A public-facing UX/UI overhaul of TransfersDaily, a football transfer news blog built on Next.js 15 + React 19 + shadcn/ui. The goal is to evolve the existing codebase from a generic blog template into a premium sports media experience with interactive community features (player ratings, transfer voting), optimized ad placement, and a consolidated, reusable component system. The site serves football fans who want fast, reliable transfer news with an engaging, modern reading experience.

## Core Value

Readers come for fast, trustworthy transfer news and stay for the interactive community features — rating players and voting on transfers — all wrapped in a premium editorial design that maximizes engagement and ad revenue.

## Requirements

### Validated

- Transfer article publishing with multi-step wizard workflow — existing
- Multi-locale support (i18n) with automatic locale detection — existing
- Admin dashboard with article management, analytics, user management — existing
- AWS Cognito authentication for admin — existing
- Image upload and processing via S3/CloudFront — existing
- Search functionality — existing
- League and transfer category pages — existing
- Dark mode support via next-themes — existing
- Plausible analytics integration — existing
- AdSense integration (basic) — existing

### Active

- [ ] Redesign public-facing blog with premium sports media aesthetic (The Athletic / ESPN FC level)
- [ ] Consolidate scattered components into a reusable, consistent design system
- [ ] Redesign article reading experience — engaging typography, better layout, visual impact
- [ ] Improve mobile UX across all public pages — responsive-first, touch-friendly
- [ ] Add interactive player performance rating system (anonymous voting)
- [ ] Add transfer comparison/voting feature ("Who was the better transfer?")
- [ ] Add transfer ranking/leaderboard system
- [ ] Optimize ad placement strategy for maximum revenue without hurting UX
- [ ] Redesign homepage with modern layout (hero, feeds, trending, engagement widgets)
- [ ] Redesign article cards for visual distinction and scannability
- [ ] Improve navigation — clear, fast, mobile-friendly
- [ ] Add loading skeletons and smooth transitions throughout public pages

### Out of Scope

- Admin dashboard redesign — focus is on public-facing pages only
- Backend API changes — work within existing proxy layer
- Authentication system changes — keep current Cognito setup
- New backend features requiring infra changes — all interactive features use client-side state or existing APIs
- Full test suite — address during later phases if needed
- SEO overhaul — maintain existing SEO, don't regress, but not primary focus

## Context

TransfersDaily is a live football transfer news blog with an existing codebase of ~50+ components, API proxy routes, and admin tools. The current public-facing UI looks like a generic blog template — nothing memorable, poor mobile experience, and weak article pages. The component architecture has sprawled with one-off components and inconsistent styling.

The site already uses shadcn/ui + Radix UI + Tailwind CSS, which provides a solid foundation for the redesign. The user plans to install the "ui-ux-pro-max" system to guide design decisions.

Key codebase concerns relevant to this work:
- Large monolithic components (900+ lines) need decomposition
- No request deduplication (consider SWR/React Query during refactor)
- Homepage forces dynamic rendering (could use ISR)
- Ad validation (`shouldShowAds()`) always returns true — needs real logic
- Component files mix rendering, data fetching, and state management

The interactive features (player ratings, transfer voting) are inspired by football YouTuber content — fans rate player performance during matches and rank transfers. This differentiates TransfersDaily from pure news sites.

## Constraints

- **Tech stack**: Must stay on Next.js 15 + React 19 + shadcn/ui + Tailwind CSS
- **Existing code**: Evolve what exists, don't start from scratch — keep the bones, improve the skin
- **Anonymous voting**: Interactive features must work without user accounts (lower friction)
- **Ad revenue**: Ad placement is a primary concern — design must accommodate ads without degrading UX
- **Backend**: No backend changes — all new features must work with existing API proxy layer or client-side state
- **Internationalization**: Must preserve multi-locale support throughout redesign

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Evolve existing codebase (not rewrite) | Preserve working features, reduce risk | -- Pending |
| Anonymous voting for interactive features | Lower friction = more participation, maximizes engagement | -- Pending |
| Premium sports media aesthetic | Positions site alongside The Athletic, ESPN FC — builds trust | -- Pending |
| Public-facing focus only | Biggest user impact, admin works well enough | -- Pending |
| Design system consolidation | Reduce component sprawl, ensure consistency, speed up future development | -- Pending |

---
*Last updated: 2026-03-17 after initialization*
