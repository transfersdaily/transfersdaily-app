# Coding Conventions

**Analysis Date:** 2026-03-17

## Naming Patterns

**Files:**
- **TypeScript/React Components:** PascalCase for components (e.g., `AdminPageLayout.tsx`, `MobileAnalytics.tsx`)
- **Utilities/Hooks:** camelCase for utilities and hooks (e.g., `date-utils.ts`, `content-validation.ts`, `useArticles.ts`, `use-mobile.tsx`)
- **API routes:** lowercase kebab-case following Next.js convention (e.g., `route.ts` in app directory with dynamic segments like `[id]`)
- **Type/Interface files:** Mixed - utilities often combine types and functions in same file (e.g., `api.ts` contains Transfer, League, Article interfaces plus API functions)

**Functions:**
- **camelCase for all function declarations:** `isValidDate()`, `formatDisplayDate()`, `validateContentQuality()`, `refreshAccessToken()`
- **React hooks follow `use` prefix pattern:** `useIsMobile()`, `useArticles()`, `useTheme()`, `useTranslation()`
- **Handler functions use `handle` prefix:** `handleSelectAll()`, `handleDeleteArticle()`, `handleSort()`, `handleSearch()`, `handlePageChange()`
- **API/service functions organized in objects:** `transfersApi`, `articlesApi`, `adminApi`, `contactApi` - each exporting methods like `getArticles()`, `deleteArticle()`, `updateArticleStatus()`

**Variables:**
- **camelCase for all variables:** `isMobile`, `currentPage`, `searchTerm`, `categoryFilter`, `statusFilter`
- **Boolean flags use `is` or `has` prefix:** `isMobile`, `isLoading`, `isPublishedArticle`, `isValid`
- **Descriptive names over abbreviations:** `itemsPerPage` not `ipp`, `selectedArticles` not `selected`
- **Constants use UPPER_SNAKE_CASE:** `MOBILE_BREAKPOINT`, `CONTENT_REQUIREMENTS`, `MIN_WORDS`, `STORAGE_KEYS`

**Types:**
- **Interfaces use PascalCase with descriptive names:** `Transfer`, `Article`, `League`, `ContentValidationResult`, `UseArticlesParams`, `AdminPageLayoutProps`
- **Union types for status fields:** `'confirmed' | 'rumor' | 'completed' | 'loan'`, `'draft' | 'published' | 'scheduled'`
- **Optional fields use `?` syntax:** `imageUrl?: string`, `author?: string`, `subtitle?: string`

## Code Style

**Formatting:**
- **Indentation:** 2 spaces (observed in all TypeScript/TSX files)
- **Semicolons:** Required at end of statements
- **Quotes:** Double quotes for strings (observed consistently: `"use client"`, `"x-amz-json-1.1"`)
- **Arrow functions:** Preferred over function keyword for callbacks
- **Import statements:** Organized with `@/` alias at top of files

**Linting:**
- **Framework:** ESLint with Next.js configuration (`eslint.config.mjs`)
- **Config location:** `/c/Users/tarkm/Desktop/PROJECTS/transfersdaily/transfersdaily-app/eslint.config.mjs`
- **Rules active:**
  - `@typescript-eslint/no-unused-vars: warn` - Warns on unused variables
  - `@typescript-eslint/no-explicit-any: warn` - Discourages `any` types but allows with warning
  - `react/no-unescaped-entities: warn` - Warns on unescaped entities in JSX
  - `@next/next/no-img-element: warn` - Prefers Next.js Image component
  - `react-hooks/exhaustive-deps: warn` - Checks effect dependency arrays
  - `@typescript-eslint/no-empty-object-type: warn` - Discourages empty object types

**Strict TypeScript:**
- **tsconfig.json setting:** `"strict": true` - All strict type checking enabled
- **No implicit any:** Variables must have explicit types
- **ESM modules:** `"module": "esnext"` with `"moduleResolution": "bundler"`

## Import Organization

**Order:**
1. **React/Next.js imports:** `import { useState, useEffect } from 'react'`, `import { NextRequest, NextResponse } from 'next/server'`
2. **External library imports:** `import { API_CONFIG, STORAGE_KEYS } from './config'`
3. **Relative imports with path alias:** `import { useIsMobile } from '@/lib/mobile-utils'`, `import { adminApi } from '@/lib/api'`
4. **Type-only imports:** `import type { ... } from '...'` if used

**Path Aliases:**
- **Configuration location:** `tsconfig.json`
- **Alias in use:** `@/*` maps to `./src/*`
- **Example usage:** `@/components`, `@/lib`, `@/hooks`, `@/app`

## Error Handling

**Patterns:**
- **Try-catch blocks for async operations:** Used extensively in API calls and hooks
- **Console logging for debugging:** Uses emoji prefixes for readability:
  - `console.log('🔄 Attempting to refresh...')` - Processing
  - `console.error('❌ Failed to...')` - Errors
  - `console.log('✅ Tokens refreshed...')` - Success
  - `console.log('💥 Error in...')` - Critical errors
- **Error propagation:** Errors caught, logged, and either returned as null/empty data or displayed via UI (e.g., in hooks, returns empty arrays on error)
- **NextResponse error responses:** Status codes with JSON body: `NextResponse.json({ success: false, error: '...' }, { status: 401 })`

## Logging

**Framework:** `console` object (built-in, no external logging library)

**Patterns:**
- **Development logging:** Extensive console.log/console.error calls with emoji prefixes
- **Log locations:**
  - API proxy routes: `/c/Users/tarkm/Desktop/PROJECTS/transfersdaily/transfersdaily-app/src/app/api/admin/articles/[id]/route.ts` logs request/response
  - Hooks: `useArticles.ts` logs generated stats, API responses, sample data
  - Auth: `api.ts` logs token refresh attempts with 🔄 emoji
- **Emoji conventions:**
  - 🔄 = processing/refresh operations
  - ✅ = success
  - ❌ = errors
  - 💥 = critical failures
  - 📡 = network operations

## Comments

**When to Comment:**
- **Function purpose:** JSDoc-style comments for utility functions
- **Complex logic:** Inline comments explaining "why" not "what"
- **Configuration intent:** Comments above config values explaining their purpose

**JSDoc/TSDoc:**
- **Usage:** Applied to utility functions describing what they do
- **Examples from codebase:**
  - `/** * Checks if a date string is valid and not from the Unix epoch */`
  - `/** * Validates if content meets AdSense quality requirements */`
  - `/** * Gets the best available date from multiple date fields with special handling for published articles */`
- **Parameter documentation:** Described in JSDoc when complex logic involved

## Function Design

**Size:**
- **Target:** Functions typically 30-80 lines for hooks, 5-20 lines for utilities
- **Example:** `useArticles` hook is ~240 lines, split into logical sections (state, effects, handlers, API calls)
- **Pattern:** Large hooks acceptable when they manage related state/logic (filtering, sorting, pagination)

**Parameters:**
- **Destructured objects preferred:** `{ status, initialSortBy = 'created_at' }` in `useArticles`
- **Optional parameters:** Use `?` in interfaces, provide defaults: `locale: string = 'en'`, `isPublishedArticle: boolean = true`
- **Type safety:** All parameters typed explicitly (no `any`)

**Return Values:**
- **Objects for multiple returns:** Hooks return single object with state and handlers: `{ articles, isLoading, handleSort, ...}`
- **Consistent structure:** Related values grouped (state section, handlers section, actions section)
- **Null/undefined for missing data:** `return null` for failed decodes, `return undefined` for invalid dates, `return []` for empty arrays

## Module Design

**Exports:**
- **Named exports preferred:** `export const API_CONFIG = {}`, `export function validateContentQuality() {}`
- **Mixed export patterns:**
  - Utilities export named functions: `export function isValidDate()`
  - Configs export const objects: `export const STORAGE_KEYS = {}`
  - Hooks export single function: `export function useArticles()`
  - API modules export multiple named objects: `export const transfersApi = {}`, `export const adminApi = {}`

**Barrel Files:**
- **Not used:** Each utility imported directly by path
- **Organization:** Flat structure in `lib/` (no subdirectories)

**API Module Pattern:**
- **Location:** `src/lib/api.ts` (47KB - main API integration file)
- **Structure:**
  ```typescript
  export const transfersApi = {
    getLatest: async () => { ... },
    getByLeague: async (league: string) => { ... }
  }

  export const adminApi = {
    getArticles: async (params) => { ... },
    deleteArticle: async (id: string) => { ... }
  }
  ```
- **Auth header forwarding:** API calls forward `Authorization` header for protected endpoints
- **Error handling:** Try-catch with detailed logging, returns structured responses

**Component Props Pattern:**
- **Interface naming:** `ComponentNameProps` (e.g., `AdminPageLayoutProps`)
- **Optional UI props:** `className?: string` for styling flexibility
- **Defaults in parameters:** `className = ""`, `breadcrumbs?: Array<...>`

---

*Convention analysis: 2026-03-17*
