# Deferred Items - Phase 01

## Pre-existing Issues

1. **Build type error in `src/app/[locale]/layout.tsx`** — `LayoutConfig<"/[locale]">` type constraint mismatch. The locale type `string` is not assignable to the union type `"en" | "es" | "it" | "fr" | "de"`. Pre-existing, unrelated to dashboard foundation work.
