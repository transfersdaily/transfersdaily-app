---
phase: 1
slug: design-tokens-theming
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual visual verification + grep-based token checks (no test framework configured) |
| **Config file** | none — design token phase uses CSS/config file validation |
| **Quick run command** | `grep -c "DC2626\|D97706\|Newsreader\|Roboto" src/app/globals.css src/lib/theme.ts src/lib/typography.ts tailwind.config.js` |
| **Full suite command** | `npx next build 2>&1 | tail -5` |
| **Estimated runtime** | ~30 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run quick grep command to verify token values present
- **After every plan wave:** Run `npx next build` to confirm no compilation errors
- **Before `/gsd:verify-work`:** Full build must succeed + manual dark/light toggle check
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | DS-03 | grep | `grep "#DC2626\|--primary" src/app/globals.css` | N/A | pending |
| 01-01-02 | 01 | 1 | DS-03 | grep | `grep "D97706\|--accent\|--cta" src/app/globals.css` | N/A | pending |
| 01-02-01 | 02 | 1 | DS-02 | grep | `grep "Newsreader\|Roboto" src/lib/typography.ts` | N/A | pending |
| 01-02-02 | 02 | 1 | DS-02 | grep | `grep "clamp\|font-weight.*900\|letter-spacing" src/lib/typography.ts` | N/A | pending |
| 01-03-01 | 03 | 2 | DS-04 | grep | `grep "#000000\|#121212\|dark" src/app/globals.css` | N/A | pending |
| 01-04-01 | 04 | 2 | DS-05 | grep | `grep "spacing-scale\|4px\|8px\|dvh" tailwind.config.js` | N/A | pending |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements. No test framework needed for token validation — grep and build checks are sufficient.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark/light toggle visual consistency | DS-04 | Visual check — no automated way to verify appearance | Toggle theme in browser, check every public page for broken/unstyled elements |
| Typography hierarchy feels editorial | DS-02 | Subjective visual quality | View homepage and article page, confirm headlines feel dramatic and bold |
| Brand color distinctiveness | DS-03 | Subjective brand identity | Compare with default shadcn/ui — must be visibly distinct |
| Responsive spacing across breakpoints | DS-05 | Multi-viewport visual check | Resize browser through 375/768/1024/1440px, confirm consistent spacing |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
