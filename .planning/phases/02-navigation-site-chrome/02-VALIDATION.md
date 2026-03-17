---
phase: 2
slug: navigation-site-chrome
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Build check + grep-based verification (no test framework) |
| **Config file** | none |
| **Quick run command** | `grep -c "skip-link\|CommandDialog\|cmdk\|nav-state-active" src/components/navbar.tsx src/components/CommandSearch.tsx 2>/dev/null` |
| **Full suite command** | `npx next build 2>&1 | tail -5` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick grep to verify key patterns present
- **After every plan wave:** Run `npx next build` to confirm no compilation errors
- **Before `/gsd:verify-work`:** Full build + manual visual check of navbar/footer/search
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | NAV-01 | grep | `grep "font-serif\|Newsreader\|editorial" src/components/navbar.tsx` | N/A | pending |
| 02-01-02 | 01 | 1 | NAV-02 | grep | `grep "font-serif\|editorial" src/components/Footer.tsx` | N/A | pending |
| 02-02-01 | 02 | 2 | NAV-03 | grep | `grep "CommandDialog\|cmdk\|Cmd+K" src/components/CommandSearch.tsx` | N/A | pending |

*Status: pending*

---

## Wave 0 Requirements

Existing infrastructure covers requirements. `cmdk` package install is part of Plan execution, not Wave 0.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Navbar looks modern sports media | NAV-01 | Visual/subjective quality | View navbar on desktop+mobile, compare with The Athletic reference |
| Footer organized with distinct sections | NAV-02 | Visual layout check | View footer, confirm 4 sections visible and styled |
| Search shows instant results | NAV-03 | Interactive behavior | Open Cmd+K, type query, confirm results appear with debounce |
| Active nav state visible | NAV-01 | Visual highlight check | Navigate to different pages, confirm active link highlighted |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
