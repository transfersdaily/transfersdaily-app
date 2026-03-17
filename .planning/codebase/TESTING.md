# Testing Patterns

**Analysis Date:** 2026-03-17

## Test Framework

**Runner:**
- **Status:** Not detected - No Jest, Vitest, or similar test framework configured
- **package.json scripts:** Only contains `dev`, `build`, `start`, `lint` - no test command
- **Config files:** No `jest.config.js`, `vitest.config.ts`, or similar test configuration files present

**Assertion Library:**
- **Status:** Not applicable - No test infrastructure in place

**Run Commands:**
```bash
npm run lint              # ESLint only - linting, not testing
npm run dev              # Local development
npm run build            # Production build
npm run start            # Production start
```

## Test File Organization

**Location:**
- **Status:** Not found - No `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files exist in the codebase

**Naming:**
- **Convention not established** - No test files to reference

**Structure:**
- **Test directory:** Not applicable

## Test Structure

**Suite Organization:**
- **Status:** Not applicable - No test suites configured

**Patterns:**
- **No setup/teardown patterns** observed
- **No assertion patterns** established
- **Manual testing:** Code relies on console logging for development-time debugging

## Mocking

**Framework:**
- **Status:** Not detected - No mocking library configured

**Patterns:**
```typescript
// No mocking patterns established
// Development uses real API calls during local development
// See api.ts for API module structure that would need mocking in tests
```

**What to Mock:**
- **Candidates for mocking (if testing were implemented):**
  - `fetch` calls for external APIs (AWS Cognito, backend API)
  - `localStorage` and `sessionStorage` operations
  - `useRouter` and `useSearchParams` from Next.js
  - Window/media query operations in `useIsMobile`

**What NOT to Mock:**
- **Utility functions:** Pure functions like `isValidDate()`, `formatDisplayDate()`, `validateContentQuality()` would use direct imports
- **Configuration:** API_CONFIG, AUTH_CONFIG constants
- **UI components:** Component unit tests would render actual components

## Fixtures and Factories

**Test Data:**
- **Status:** Not established - No fixtures or factories present

**Potential locations if implemented:**
- Suggested: `src/__tests__/fixtures/` for shared test data
- Example needed: Mock articles, transfers, user data structures

## Coverage

**Requirements:**
- **Status:** Not enforced - No coverage configuration or requirements defined

**View Coverage:**
```bash
# Not applicable - no test runner configured
```

## Test Types

**Unit Tests:**
- **Current status:** Not implemented
- **Recommended scope:** Pure utility functions in `src/lib/`:
  - Date utilities: `date-utils.ts` functions like `isValidDate()`, `formatDisplayDate()`, `formatTimeAgo()`
  - Validation: `content-validation.ts` functions like `validateContentQuality()`, `getContentQualityScore()`
  - Image utilities: `image-utils.ts` URL processing functions
  - Config functions: `config.ts` `getApiUrl()` helper

**Integration Tests:**
- **Current status:** Not implemented
- **Recommended scope:**
  - API module patterns in `src/lib/api.ts` (transfersApi, articlesApi, adminApi, etc.)
  - Hook behavior: `useArticles`, `useTheme`, `useTranslation` state management and API integration
  - Auth flow: Token refresh and Cognito integration from `api.ts`

**E2E Tests:**
- **Framework:** Not used
- **Recommendation:** Could implement with Playwright or Cypress for:
  - Admin workflows (article creation, publishing flow)
  - User authentication flows
  - Search and filtering interactions

## Common Patterns

**Async Testing:**
- **Current approach:** Not applicable
- **Future recommendation:** For hooks like `useArticles` with `async loadArticles()`:
  ```typescript
  // Pattern that would be needed:
  // Use waitFor from @testing-library/react
  // Mock fetch and test async state updates
  ```

**Error Testing:**
- **Current approach:** Not applicable
- **Future recommendation:** For error-handling code in `api.ts`:
  ```typescript
  // Pattern that would be needed:
  // Mock fetch to return error responses
  // Test console.error logging
  // Verify null returns on JWT decode failure
  ```

## Quality Observation

**Current Testing Reality:**
- **Console logging used for debugging:** Extensive emoji-prefixed console.log/error calls in:
  - `src/lib/api.ts` - API debugging (🔄 ✅ ❌ 💥 emojis)
  - `src/hooks/useArticles.ts` - State and API response logging
  - API routes: `src/app/api/admin/articles/[id]/route.ts` - Request/response logging

**Manual Testing Evidence:**
- Developers rely on console output in browser/server during development
- ESLint is only automated quality gate (`npm run lint`)
- No automated test suite means changes verified through manual testing and visual inspection

**Fragile Areas (Higher Testing Priority if Implemented):**
1. **API proxy routes** (`src/app/api/*/route.ts`) - Complex request forwarding with auth headers
2. **State management in hooks** (`src/hooks/useArticles.ts`) - 240+ line hook with multiple filters and sorting
3. **Authentication flow** (`src/lib/api.ts`) - JWT token refresh logic with Cognito
4. **Date handling** (`src/lib/date-utils.ts`) - Multiple date validation edge cases and fallbacks

## Recommendations for Test Implementation

**Priority 1 (High Value):**
- Unit tests for `src/lib/date-utils.ts` - Date edge cases, epoch handling, locale-specific formatting
- Unit tests for `src/lib/content-validation.ts` - Word count, character count, validation logic
- Integration tests for hook state management in `src/hooks/useArticles.ts`

**Priority 2 (Medium Value):**
- Tests for API proxy error handling and auth header forwarding
- Tests for config helper functions (`getApiUrl` routing logic)
- Tests for image URL processing in `src/lib/image-utils.ts`

**Priority 3 (Nice to Have):**
- E2E tests for admin workflows
- Component snapshot tests for layout components
- Analytics tracking verification tests

---

*Testing analysis: 2026-03-17*
