# Phase 3: Card System & Component Consolidation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-22
**Phase:** 03-card-system-component-consolidation
**Areas discussed:** Card variants & sizes, Visual styling & anatomy, Component API & reuse, Skeleton & loading states

---

## Card Variants & Sizes

| Option | Description | Selected |
|--------|-------------|----------|
| 4 variants | Hero, Standard, Compact, Mini — covers all current use cases | ✓ |
| 3 variants | Hero, Standard, Compact — merge sidebar mini into compact | |
| 2 variants | Standard + Compact only, hero stays as one-off | |

**User's choice:** 4 variants (Recommended)
**Notes:** User selected the full variant set with ASCII preview mockups showing all four layouts.

---

## Visual Styling & Anatomy

| Option | Description | Selected |
|--------|-------------|----------|
| 16:9 (aspect-video) | Wide cinematic, works with sports imagery | ✓ |
| 4:3 | Taller, more portrait-friendly | |
| 3:2 | Classic photo ratio, balanced | |

**User's choice:** 16:9 (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Text badge with league color | Colored pill with league name | ✓ |
| Text only, no color | Plain muted text badge | |
| Color accent bar | Thin colored border on card | |

**User's choice:** Text badge with league color (Recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle lift + image zoom | translateY(-2px) + scale(1.03), toned down from current | ✓ |
| Border highlight | Border changes to primary on hover | |
| Background shift only | Card bg lightens/darkens slightly | |

**User's choice:** Subtle lift + image zoom (Recommended)
**Notes:** User asked if decisions were informed by UI/UX Pro Max skill. Confirmed yes — style rules, animation timing, accessibility constraints all from Pro Max database. User then requested using the skill directly for remaining decisions.

---

## Component API & reuse + Skeleton & loading states

These areas were resolved via UI/UX Pro Max skill invocation rather than individual Q&A.

The skill searched for:
- `news media card editorial dark sports` → Editorial Grid/Magazine + OLED Dark styles
- `card hover skeleton loading animation elevation` → UX rules for hover, skeletons, loading

Results synthesized into a comprehensive design spec (single component with variant prop, matching skeletons per variant, lazy loading below fold, CLS-safe dimensions).

**User's choice:** Approved the full synthesized spec as-is.

---

## Claude's Discretion

- Exact Tailwind class composition per variant
- Internal component structure
- Image fallback design
- Skeleton line widths and counts
- TransferGrid wrapper decision

## Deferred Ideas

None
