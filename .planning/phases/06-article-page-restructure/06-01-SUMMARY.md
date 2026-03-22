---
phase: 06-article-page-restructure
plan: 01
subsystem: article-components
tags: [components, article, decomposition, hero, breadcrumb, reading-time]
dependency_graph:
  requires: [01-design-tokens, 04-ad-system]
  provides: [article-sub-components, reading-time-utility]
  affects: [article-page-restructure-plan-02]
tech_stack:
  added: []
  patterns: [server-components, barrel-export, typography-tokens, league-color-map]
key_files:
  created:
    - src/lib/reading-time.ts
    - src/components/article/ArticleBreadcrumb.tsx
    - src/components/article/ArticleMeta.tsx
    - src/components/article/ArticleHero.tsx
    - src/components/article/ArticleBody.tsx
    - src/components/article/index.ts
  modified: []
decisions:
  - "Reading time uses 200wpm with Math.ceil and min 1 minute"
  - "LeagueColorMap pattern duplicated inline (same as ArticleCard) to avoid coupling"
  - "getTranslation helper duplicated in ArticleMeta to keep component self-contained"
  - "All article components are server components (no 'use client')"
metrics:
  duration: 2min
  completed: 2026-03-22
---

# Phase 06 Plan 01: Article Sub-Component Extraction Summary

Extracted 4 article sub-components (ArticleHero, ArticleMeta, ArticleBreadcrumb, ArticleBody) plus reading time utility into `src/components/article/` with barrel export -- building blocks for Plan 02's slim page.tsx composition.

## What Was Done

### Task 1: Reading Time Utility + ArticleBreadcrumb + ArticleMeta (caafe4e)

**Reading time (`src/lib/reading-time.ts`):** Pure function that splits content on whitespace, counts words, divides by 200, rounds up via Math.ceil, returns minimum 1.

**ArticleBreadcrumb:** Server component rendering `<nav aria-label="Breadcrumb">` with Home > League > Article Title path. Title truncated to 50 chars. League segment skipped when not present. Styled with `font-sans text-xs text-muted-foreground`.

**ArticleMeta:** Server component showing date (via getBestDate + formatDisplayDate), Clock icon with reading time, league badge (colored pill), and optional transfer details row (player, clubs, status, fee). Uses same leagueColorMap pattern from ArticleCard.

### Task 2: ArticleHero + ArticleBody + Barrel Export (9e80236)

**ArticleHero:** Server component with two modes:
- With image: full-width `aspect-[21/9]` container, Next.js Image with `fill`, `priority={true}`, `sizes="100vw"`, gradient overlay `bg-gradient-to-t from-black/90 via-black/40 to-transparent`, title + league badge over gradient.
- Without image: `bg-card` container with title only.

**ArticleBody:** Server component parsing content lines into headings (h1/h2/h3) and paragraphs. Interleaves AdSlot after paragraph index 2 and 5. Container uses `max-w-[65ch]` for readability.

**Barrel export (`index.ts`):** Exports ArticleBreadcrumb, ArticleHero, ArticleMeta, ArticleBody.

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **LeagueColorMap duplication** -- duplicated the 5-entry map in ArticleHero and ArticleMeta rather than creating a shared utility, keeping components self-contained and under 150 lines.
2. **getTranslation helper duplication** -- copied the dict traversal helper into ArticleMeta to avoid importing from page.tsx (which will be restructured in Plan 02).
3. **Comment-based docs** -- added JSDoc-style comments noting "Server component" to each file for clarity.

## Verification Results

- 5 files in `src/components/article/` (4 components + index.ts)
- `src/lib/reading-time.ts` exists
- All component files under 150 lines (max: ArticleMeta at 108 lines)
- No `'use client'` directives in any component
- All acceptance criteria grep checks passed

## Self-Check: PASSED

All 6 created files verified on disk. Both commits (caafe4e, 9e80236) verified in git log.
