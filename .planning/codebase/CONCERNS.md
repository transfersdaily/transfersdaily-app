# Codebase Concerns

**Analysis Date:** 2026-03-17

## Tech Debt

**Verbose Console Logging in Production Code:**
- Issue: Sensitive information logged to console including authorization headers, request bodies, and internal API status codes
- Files: `src/app/api/admin/newsletter/send/route.ts`, `src/app/api/admin/media/upload/route.ts`, `src/app/api/bulk-translate/route.ts`, `src/app/admin/articles/edit/[id]/page.tsx`
- Impact: Console logs remain visible in browser DevTools and server logs; emoji prefixes (📧, 🚀, ❌) clutter logs
- Fix approach: Replace all `console.log()` calls with structured logging using a logger utility; use `console.error()` only for actual errors; strip production logs from client output

**Hardcoded Configuration in Code:**
- Issue: Cognito credentials hardcoded as fallback values in `src/lib/config.ts` (userPoolId, userPoolClientId)
- Files: `src/lib/config.ts` lines 121-123
- Impact: Credentials visible in source code; if repo is leaked, these IDs become security liability
- Fix approach: Remove hardcoded fallbacks; require all configuration via environment variables; fail fast at startup if required vars missing

**No Test Coverage:**
- Issue: No test files found in codebase (0 `.test.*` or `.spec.*` files)
- Files: `src/` (entire directory lacks tests)
- Impact: Cannot safely refactor; regressions undetected; API contract changes break silently
- Fix approach: Start with critical path testing (API routes, auth flows); add Jest or Vitest with minimum 60% coverage requirement

**Image Proxy SSRF Vulnerability:**
- Issue: `/api/image-proxy` accepts arbitrary URLs via query parameter with no whitelist validation
- Files: `src/app/api/image-proxy/route.ts`
- Impact: Can be used for Server-Side Request Forgery attacks; internal AWS service endpoints accessible through proxy
- Fix approach: Implement URL allowlist (only CloudFront domains); validate protocol; reject private IP ranges

**CORS Wildcard (*) in Image Proxy:**
- Issue: `Access-Control-Allow-Origin: '*'` and `Access-Control-Allow-Headers: '*'` set on all responses
- Files: `src/app/api/image-proxy/route.ts` lines 32, 34, 50
- Impact: Allows any origin to access this endpoint; combined with SSRF issue above, increases attack surface
- Fix approach: Set specific origin; require Origin header validation

**Insufficient Input Validation:**
- Issue: File upload endpoint accepts files larger than 5MB with weak validation; no file type verification beyond MIME check
- Files: `src/app/api/admin/media/upload/route.ts` lines 39-44
- Impact: Users could bypass checks; MIME type easily spoofed via headers
- Fix approach: Add real file magic number validation; verify file content matches claimed type; use streaming validation for size checks

**Missing Null Safety in Error Handling:**
- Issue: Error handling catches broadly and may mask actual issues; `.message` accessed without typeof checks
- Files: `src/app/api/admin/newsletter/send/route.ts` line 54, `src/app/api/admin/media/upload/route.ts` line 87
- Impact: Errors become "Unknown error" strings when thrown object lacks `.message` property; hides root cause
- Fix approach: Create typed error class; always check error type in catch blocks

**Content Validation Bypassed:**
- Issue: `shouldShowAds()` in `src/lib/content-validation.ts` line 76 always returns `true` regardless of content
- Files: `src/lib/content-validation.ts` lines 74-77
- Impact: Ads shown on low-quality, stub, or empty content violating AdSense policies; validation framework unused
- Fix approach: Implement actual validation logic; check word count and placeholder patterns before enabling ads

## Known Bugs

**API Configuration Fallback Ambiguity:**
- Symptoms: Development fallback URL is `http://localhost:3000/api` but actual backend might be deployed elsewhere
- Files: `src/lib/config.ts` lines 16-18
- Trigger: `NEXT_PUBLIC_API_URL` not set during build; developer runs `npm run build` without env vars
- Workaround: Always set `NEXT_PUBLIC_API_URL` before build step

**Authorization Header Case Sensitivity:**
- Symptoms: Some routes check `authorization` (lowercase), others check `Authorization` (capitalized)
- Files: `src/app/api/admin/media/upload/route.ts` line 47 (checks both), `src/app/api/admin/newsletter/send/route.ts` line 14 (checks capitalized only), `src/app/api/bulk-translate/route.ts` line 50 (checks capitalized only)
- Trigger: Proxy servers or CDN normalize header case inconsistently
- Workaround: All routes should normalize header names to lowercase using `request.headers.get()` safely

**Translation Error Handling Missing:**
- Symptoms: Bulk translation can fail silently if article fetch fails mid-loop
- Files: `src/app/api/bulk-translate/route.ts` lines 61-84
- Trigger: Backend returns 5xx for one article; loop continues and operation partially fails without user notification
- Workaround: None; requires backend fix or validation before translation starts

**Middleware Locale Cookie Not Validated on Read:**
- Symptoms: Cookie value could contain invalid locale but middleware doesn't sanitize it after reading
- Files: `src/middleware.ts` lines 35-37
- Trigger: Malicious actor sets locale cookie to invalid value; cookie is set but validation only happens on assignment
- Workaround: Middleware already re-validates but could fail silently if isValidLocale() has bugs

## Security Considerations

**Authentication Token Storage in localStorage:**
- Risk: XSS attack can steal all tokens (accessToken, idToken, refreshToken) from localStorage
- Files: `src/lib/api.ts` lines 44-57 (JWT decode function), `src/lib/config.ts` lines 137-140 (storage keys)
- Current mitigation: None; tokens stored in plain localStorage accessible to any JavaScript
- Recommendations: Use httpOnly cookies for tokens (requires backend support); implement CSRF protection; add Content Security Policy headers

**JWT Decoding Without Signature Verification:**
- Risk: Tokens decoded client-side without verifying signature; malicious actor could forge tokens
- Files: `src/lib/api.ts` lines 45-57 (`decodeJWT` function)
- Current mitigation: Backend should verify signatures; client-side decode only for reading claims
- Recommendations: Add comment explaining this is for display only; never trust client-side decoded token for auth decisions; always validate on backend

**API_BASE_URL Remote Pattern Accepts All Domains:**
- Risk: Image proxy accepts remote patterns with `hostname: '**'` allowing any external URL
- Files: `next.config.ts` lines 10-15
- Current mitigation: None; intentionally permissive
- Recommendations: Whitelist specific domains (CloudFront, AWS domains); add CSP image-src directive

**Unencrypted Data in Motion for Admin Endpoints:**
- Risk: Admin endpoints expect Authorization headers but no enforcement of HTTPS in development
- Files: `src/middleware.ts` line 52 (secure flag set conditionally)
- Current mitigation: `secure` cookie flag set only in production
- Recommendations: Force HTTPS in production environment; add HSTS headers; audit staging environment security

**Missing Rate Limiting:**
- Risk: No rate limiting on public endpoints; `/api/image-proxy` could be used for DOS attacks
- Files: `src/app/api/image-proxy/route.ts`, `src/app/api/bulk-translate/route.ts`
- Current mitigation: None
- Recommendations: Add rate limiting middleware; implement API key requirements for bulk operations; add request size limits

## Performance Bottlenecks

**Large Component Files (900+ lines):**
- Problem: Multiple components exceed 900 lines with mixed concerns (rendering, data fetching, state management)
- Files: `src/components/publishing/steps/ContentEditingStep.tsx` (953 lines), `src/app/[locale]/page.tsx` (925 lines), `src/app/admin/articles/edit/[id]/page.tsx` (906 lines)
- Cause: Components handle too many responsibilities; no decomposition into smaller, reusable pieces
- Improvement path: Extract form handling into custom hooks; separate data fetching logic; create reusable editor subcomponents

**Image Proxy Caching Header Too Aggressive:**
- Problem: Cache-Control set to 1 year but images may change on server
- Files: `src/app/api/image-proxy/route.ts` line 35
- Cause: Assumes images immutable but CloudFront could update images
- Improvement path: Add ETag validation; use shorter cache duration; implement cache invalidation strategy

**No Request Deduplication in Data Fetching:**
- Problem: Multiple components might fetch same article simultaneously with no caching
- Files: `src/app/admin/articles/edit/[id]/page.tsx` (fetches article multiple times on component lifecycle)
- Cause: Each useEffect fetches independently; no shared cache layer
- Improvement path: Implement React Query or SWR for automatic deduplication and caching; add stale-while-revalidate

**Dynamic Rendering Forced on Homepage:**
- Problem: `export const dynamic = 'force-dynamic'` prevents all caching and static generation
- Files: `src/app/[locale]/page.tsx` line 28
- Cause: Likely overcautious; could use incremental static regeneration (ISR) instead
- Improvement path: Use ISR with revalidate time (e.g., `revalidate = 60`); only use dynamic for truly real-time content

**No Image Optimization on Data URLs:**
- Problem: Transparent PNG embedded as data URL in JavaScript instead of served separately
- Files: `src/lib/image-utils.ts` line 6
- Cause: Increases bundle size; prevents caching; re-encodes on every page load
- Improvement path: Move to public folder; reference via URL; only use data URLs for critical above-fold images

## Fragile Areas

**API Route Error Responses Inconsistent:**
- Files: `src/app/api/admin/**/route.ts` (various admin routes)
- Why fragile: Error response structure varies (sometimes `{ success: false, error: '...' }`, sometimes `{ message: '...' }`); no standardized error envelope
- Safe modification: Create shared error response middleware; test all error paths
- Test coverage: No integration tests for error scenarios

**Configuration Loading with Silent Fallbacks:**
- Files: `src/lib/config.ts`
- Why fragile: Multiple layers of fallbacks (env var → hardcoded value → development default) make it unclear which config is active; build time config differs from runtime
- Safe modification: Add startup validation; log which config values are being used; fail loudly if required values missing
- Test coverage: Config tested only through integration; no unit tests

**Translation System with No Fallback Language Handling:**
- Files: `src/lib/i18n.ts` lines 20-28
- Why fragile: Falls back to default locale if import fails, but doesn't warn user they're seeing different language than requested
- Safe modification: Add UI indicator when fallback active; cache preferred language preference; track fallback usage
- Test coverage: No tests for missing dictionaries

**Bulk Translation with Partial Success:**
- Files: `src/app/api/bulk-translate/route.ts` lines 59-84
- Why fragile: Loop continues even if individual article fetches fail; returns error if NO articles valid, but silently skips invalid ones
- Safe modification: Implement transaction semantics (all-or-nothing); validate all articles before starting bulk operation
- Test coverage: No tests for mixed success/failure scenarios

**Admin Layout Without Proper Role-Based Access Control:**
- Files: `src/app/admin/layout.tsx`
- Why fragile: Middleware skips admin routes entirely; no server-side auth check; client-side redirect only
- Safe modification: Add server-side middleware authentication check; implement role-based middleware; reject requests before rendering
- Test coverage: No tests for auth enforcement

## Scaling Limits

**No Database Connection Pooling Visible:**
- Current capacity: API_CONFIG references backend but no connection pool configuration visible
- Limit: Backend will hit database connection limits as traffic scales
- Scaling path: Backend should implement connection pooling; frontend should implement request batching; add async queue for bulk operations

**localStorage Unlimited Token Storage:**
- Current capacity: localStorage can store ~5-10MB on most browsers
- Limit: No issue in practice but if token size grows, could hit limits
- Scaling path: Implement token rotation; compress tokens; move to sessionStorage for temporary auth

**No Pagination Visible in Article Listings:**
- Current capacity: Depends on API but likely loads all articles into memory
- Limit: Will degrade as content library grows beyond 1000s of articles
- Scaling path: Implement server-side pagination; add infinite scroll with viewport-based loading; cache paginated results

## Dependencies at Risk

**@uiw/react-md-editor (v4.0.7):**
- Risk: Dynamically imported to avoid SSR issues (indicates compatibility concerns); only 1 package uses this
- Impact: Markdown editor could fail in SSR context; alternative editors (Slate, Draft.js) more stable
- Migration plan: Replace with simpler markdown solution or evaluate next-mdx-remote

**next-plausible (v3.12.4):**
- Risk: Wrapper around analytics service; minor package; few dependents
- Impact: Analytics failures won't break app but reduce visibility into user behavior
- Migration plan: Could switch to built-in Next.js analytics or direct Plausible integration

**Class-variance-authority (v0.7.1):**
- Risk: Used for component variant logic; small but specialized package
- Impact: If unmaintained, could fork or replace with native TypeScript utilities
- Migration plan: Internal implementation of variant logic is straightforward if needed

**AWS SDK Lambda Client (v3.864.0):**
- Risk: Large AWS SDK for single Lambda invocation; tight coupling to AWS infrastructure
- Impact: Difficult to test; not used in visible code paths (only referenced in config)
- Migration plan: Remove unused AWS SDK; implement HTTP client for Lambda direct invocation if needed

## Missing Critical Features

**No Error Boundary Implementation:**
- Problem: No React Error Boundaries found; fatal client-side errors crash entire page
- Blocks: Users lose all work if component crashes; no error recovery UI
- Implementation: Add error-boundary package or custom ErrorBoundary component; log errors to monitoring service

**No Loading Skeleton States for Some Routes:**
- Problem: Some data-heavy pages like admin dashboards show nothing while loading
- Blocks: User thinks page is broken; no progress indication for slow networks
- Implementation: Add Skeleton components to all async sections; implement Suspense boundaries

**No Retry Logic for Failed API Calls:**
- Problem: Failed API calls immediately show error; no automatic retry
- Blocks: Transient network failures appear as permanent errors
- Implementation: Add retry middleware to fetch wrapper; implement exponential backoff

**No Offline Support:**
- Problem: App becomes unusable without network; no service worker or offline data
- Blocks: Users on poor connections can't browse cached articles
- Implementation: Add service worker; cache critical pages and articles; show offline indicator

## Test Coverage Gaps

**No Tests for API Routes:**
- What's not tested: All `/api/**` routes (newsletter send, media upload, translation endpoints, article management)
- Files: `src/app/api/**/*.ts`
- Risk: Breaking changes to backend integration undetected; error handling untested; security fixes could regress
- Priority: HIGH - API contract changes will break the app

**No Tests for Authentication Flow:**
- What's not tested: JWT decode, token refresh, Cognito integration, session management
- Files: `src/lib/api.ts`, auth hooks
- Risk: Auth bugs could lock users out or expose security holes
- Priority: HIGH - Authentication bypass possible without tests

**No Tests for Content Validation:**
- What's not tested: AdSense compliance validation; content quality checks; placeholder detection
- Files: `src/lib/content-validation.ts`
- Risk: Invalid content published; ads shown on low-quality pages; AdSense account suspended
- Priority: MEDIUM - Monetization at risk

**No Tests for Localization:**
- What's not tested: Dictionary loading, locale switching, fallback behavior, nested translation access
- Files: `src/lib/i18n.ts`
- Risk: Missing translations in production; users see key strings instead of translated text
- Priority: MEDIUM - Poor user experience in non-English locales

**No Tests for Image Handling:**
- What's not tested: Image URL processing, fallback logic, optimization, proxy validation
- Files: `src/lib/image-utils.ts`
- Risk: Images don't load; SSRF vulnerability in proxy not caught; broken image handling breaks layout
- Priority: MEDIUM - Visual presentation affected

**No Tests for Admin Dashboard Components:**
- What's not tested: Article editor, form submissions, dropdown population, bulk operations
- Files: `src/app/admin/**`, `src/components/admin/**`
- Risk: Admin workflow broken; data corruption possible; bulk operations fail silently
- Priority: HIGH - Blocks content publishing

**No End-to-End Tests:**
- What's not tested: Complete user journeys (browse article → read → share), admin workflows (create → translate → publish)
- Files: Entire app
- Risk: Critical business flows could be broken and go undetected until users report
- Priority: CRITICAL - Business impact highest

---

*Concerns audit: 2026-03-17*
