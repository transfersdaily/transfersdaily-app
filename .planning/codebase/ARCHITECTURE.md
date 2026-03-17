# Architecture

**Analysis Date:** 2026-03-17

## Pattern Overview

**Overall:** Next.js 15 full-stack application with multi-tenant support, API proxy pattern, and publishing workflow

**Key Characteristics:**
- Frontend and backend coexist in single Next.js application
- Middleware-based locale routing and request interception
- AWS Cognito for authentication, AWS backend API communication
- Client-side and server-side rendering (hybrid approach)
- Admin section with protected routes and role-based access
- Publication pipeline with multi-step wizard workflow

## Layers

**Presentation Layer (Pages & Components):**
- Purpose: Render user interface and handle client interactions
- Location: `src/app/` (pages) and `src/components/` (reusable components)
- Contains: Next.js App Router pages, React components, UI layouts
- Depends on: Hooks, lib utilities, UI components
- Used by: Browser clients

**API Proxy Layer (Route Handlers):**
- Purpose: Forward client requests to backend, manage authentication, handle CORS
- Location: `src/app/api/` (Next.js route handlers)
- Contains: GET, POST, PUT, DELETE route handlers for proxying
- Depends on: `API_CONFIG`, auth tokens, `fetch` API
- Used by: Client-side JavaScript, admin pages

**Business Logic Layer (Hooks & Services):**
- Purpose: Encapsulate data fetching, state management, domain logic
- Location: `src/hooks/` and `src/lib/*.ts` (utility/service files)
- Contains: Custom React hooks, API client functions, utilities
- Depends on: `API_CONFIG`, authentication context
- Used by: Components, pages

**Authentication Layer:**
- Purpose: Handle user identity, token management, session state
- Location: `src/lib/auth.tsx` (AuthProvider context), `src/middleware.ts`
- Contains: Cognito integration, JWT handling, token refresh logic
- Depends on: AWS Cognito endpoints, browser localStorage
- Used by: Admin layout, protected components

**Configuration Layer:**
- Purpose: Centralize environment-based settings and API endpoints
- Location: `src/lib/config.ts`
- Contains: API URLs, Cognito config, storage keys, feature flags
- Depends on: Environment variables
- Used by: All API communication

## Data Flow

**Public Article Access:**

1. User navigates to `/[locale]/article/[slug]`
2. Page router handler fetches article via `fetchArticleBySlug()`
3. `src/app/[locale]/article/[slug]/page.tsx` calls `adminApi.getArticleBySlug()`
4. Request goes through `src/app/api/article/[slug]/route.ts` proxy
5. Proxy validates auth header, forwards to `API_CONFIG.baseUrl` (AWS backend)
6. Response returns article content with images, tags, metadata
7. Component renders server-side, hydrates on client

**Admin Publishing Workflow:**

1. User navigates to `/admin/articles/publish/[articleId]/[step]`
2. Layout checks auth in `src/app/admin/layout.tsx`
3. Publishing wizard (`src/app/admin/articles/publish/[articleId]/[step]/page.tsx`) loads
4. Step components (ContentEditingStep, SocialMediaStep, etc.) manage state
5. Each step saves progress via API routes:
   - `PUT /api/admin/articles/[id]` for content updates
   - `POST /api/admin/articles/[id]/publish` for publishing
6. Wizard progresses through: edit → preview → social → confirm
7. Success page shows published article state

**Image Processing:**

1. Admin uploads image via `/api/admin/media/upload`
2. Route handler processes upload, validates, stores
3. Image URL returned to component
4. Components use `processImageUrl()` from `src/lib/image-utils.ts`
5. Client renders image with caching headers

**Translation Workflow:**

1. Admin initiates translation via `/api/admin/start-translation`
2. Route handler forwards to backend translation service
3. BulkTranslationDialog tracks translation status
4. Polling via `/api/admin/translation-status/[id]`
5. Updates UI when translations complete

**Locale/i18n Flow:**

1. Middleware in `src/middleware.ts` intercepts non-API requests
2. Checks pathname for valid locale prefix
3. If missing, redirects to `/{defaultLocale}{pathname}`
4. Server-side `getDictionary(locale)` loads translation strings
5. DictionaryProvider passes to child components
6. Components access translations via context or hook

**State Management:**

- AuthProvider (context): User identity, tokens
- DictionaryProvider (context): i18n strings
- Local React state: Form inputs, UI toggles, pagination
- Browser localStorage: Auth tokens, user preferences, locale
- URL query params: Search filters, pagination state

## Key Abstractions

**adminApi (Service):**
- Purpose: Centralized admin API client with auth header management
- Examples: `src/lib/api.ts` exports `adminApi` object
- Pattern: Method-based API (getArticles, updateArticle, publishArticle, etc.)
- Handles: Token refresh, error recovery, retry logic

**AuthContext (Authentication):**
- Purpose: Provide user identity and auth operations throughout app
- Examples: `src/lib/auth.tsx` exports `AuthProvider` and `useAuth` hook
- Pattern: React Context for global auth state
- Manages: Login/logout, token storage, session validation

**API Proxy Routes (Next.js Handler Pattern):**
- Purpose: Forward client requests to backend with auth header injection
- Examples: `src/app/api/admin/articles/[id]/route.ts`
- Pattern: Each route handler implements GET/POST/PUT/DELETE
- Handles: Authorization validation, error translation, response formatting

**Custom Hooks (Composition):**
- Purpose: Encapsulate feature-specific logic and API calls
- Examples: `useArticles`, `useTheme`, `useTranslation`, `useToast`
- Pattern: React hooks with internal state and side effects
- Manage: Data fetching, error handling, component-level state

**Publishing Steps (Wizard Components):**
- Purpose: Break complex publishing workflow into discrete steps
- Examples: ContentEditingStep, SocialMediaStep, ConfirmationStep
- Pattern: Controlled components receiving state + handlers
- Manage: Step-specific UI and validation

## Entry Points

**Root Page:**
- Location: `src/app/page.tsx`
- Triggers: `/` request
- Responsibilities: Redirects to default locale

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: All requests
- Responsibilities: Sets up global providers (Theme, Auth, Analytics), metadata, CSS

**Locale Layout:**
- Location: `src/app/[locale]/layout.tsx`
- Triggers: All `/{locale}/*` requests
- Responsibilities: Loads i18n dictionary, wraps with DictionaryProvider, renders navbar

**Admin Layout:**
- Location: `src/app/admin/layout.tsx`
- Triggers: All `/admin/*` requests
- Responsibilities: Auth guard, renders sidebar, enforces login

**Middleware:**
- Location: `src/middleware.ts`
- Triggers: Before all requests (except API, assets, internals)
- Responsibilities: Locale detection/redirection, cookie management

**API Routes:**
- Location: `src/app/api/**/*.ts`
- Examples: `/api/admin/articles/[id]`, `/api/article/[slug]`
- Responsibilities: Proxy requests to backend, manage auth headers, transform responses

## Error Handling

**Strategy:** Multi-layered error handling with recovery fallbacks

**Patterns:**

1. **API Proxy Errors** (`src/app/api/` routes):
   - Check auth header presence, return 401 if missing
   - Try-catch on fetch to backend
   - Return structured error response: `{ success: false, error: "...", details: "..." }`
   - Development mode returns mock success to prevent UI breaks

2. **Component Errors** (`src/components/ErrorBoundary.tsx`):
   - React Error Boundary catches render errors
   - Displays fallback UI without crashing
   - Prevents blank pages

3. **Auth Errors** (`src/lib/auth.tsx`):
   - Cognito request failures clear stored tokens
   - Invalid tokens trigger re-login flow
   - Stores user null on auth failure

4. **Fetch Errors** (`src/lib/api.ts`):
   - Network errors throw exceptions with descriptive messages
   - 401 Unauthorized triggers token refresh
   - 403 Forbidden stops retry and redirects to login
   - 5xx errors include retry logic

## Cross-Cutting Concerns

**Logging:**

- Console-based logging (development-friendly)
- Debug prefixes: `🔄` (proxy), `🔐` (auth), `📡` (API), `❌` (error), `✅` (success)
- Examples: `src/app/api/admin/articles/[id]/route.ts`

**Validation:**

- Content validation: `src/lib/content-validation.ts`
- Inline form validation in components (required fields, format checks)
- Backend validation response handling

**Authentication:**

- Token-based (JWT from Cognito)
- Stored in localStorage with keys from `STORAGE_KEYS`
- Middleware strips locale/auth routes from token check
- Admin routes protected by `src/app/admin/layout.tsx`

**Caching:**

- Images optimized via `processImageUrl()` in `src/lib/image-utils.ts`
- Next.js automatic static optimization for pages
- Revalidation via API route responses

**Rate Limiting:**

- Handled by backend (not visible in frontend)
- Frontend provides user-friendly error messages

---

*Architecture analysis: 2026-03-17*
