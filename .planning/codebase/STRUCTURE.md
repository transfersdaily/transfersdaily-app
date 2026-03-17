# Codebase Structure

**Analysis Date:** 2026-03-17

## Directory Layout

```
transfersdaily-app/
├── src/                                 # Source code root
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                 # Root layout with global providers
│   │   ├── page.tsx                   # Root page (redirects to locale)
│   │   ├── middleware.ts              # Request middleware (locale routing)
│   │   ├── [locale]/                  # Locale-specific pages
│   │   │   ├── layout.tsx             # Locale wrapper with i18n
│   │   │   ├── page.tsx               # Home page
│   │   │   ├── article/[slug]/        # Article detail page
│   │   │   ├── league/[slug]/         # League detail page
│   │   │   ├── transfers/             # Transfer category pages (confirmed/rumors/completed)
│   │   │   ├── search/                # Search results page
│   │   │   ├── latest/                # Latest articles feed
│   │   │   ├── contact/               # Contact form page
│   │   │   ├── about/                 # About page
│   │   │   ├── privacy/               # Privacy policy
│   │   │   └── terms/                 # Terms of service
│   │   ├── admin/                     # Admin section (protected)
│   │   │   ├── layout.tsx             # Admin layout with auth guard
│   │   │   ├── page.tsx               # Admin dashboard
│   │   │   ├── articles/              # Article management
│   │   │   │   ├── drafts/            # Draft articles list
│   │   │   │   ├── published/         # Published articles list
│   │   │   │   ├── edit/[id]/         # Article editor
│   │   │   │   └── publish/[articleId]/ # Publishing wizard
│   │   │   ├── analytics/             # Stats and metrics dashboard
│   │   │   ├── clubs/                 # Club management
│   │   │   ├── leagues/               # League management
│   │   │   ├── players/               # Player management
│   │   │   ├── users/                 # User management
│   │   │   ├── newsletter/            # Newsletter management
│   │   │   ├── messages/              # Message inbox
│   │   │   ├── settings/              # Admin settings
│   │   │   └── profile/               # Admin profile
│   │   ├── api/                       # API route handlers (proxies)
│   │   │   ├── admin/                 # Admin API endpoints
│   │   │   │   ├── articles/[id]/     # Article CRUD
│   │   │   │   ├── leagues/[id]/      # League endpoints
│   │   │   │   ├── media/upload/      # Image upload
│   │   │   │   ├── newsletter/send/   # Newsletter dispatch
│   │   │   │   ├── start-translation/ # Translation initiation
│   │   │   │   └── translation-status/# Translation status polling
│   │   │   ├── article/[slug]/        # Public article retrieval
│   │   │   ├── image-proxy/           # Image proxy handler
│   │   │   ├── bulk-translate/        # Bulk translation API
│   │   │   └── start-translation/     # Public translation start
│   │   ├── login/                     # Login page
│   │   └── debug-image/               # Image debugging utility
│   ├── components/                    # Reusable React components
│   │   ├── ui/                        # Radix UI primitives + styling
│   │   │   ├── button.tsx             # Button component
│   │   │   ├── card.tsx               # Card component
│   │   │   ├── dialog.tsx             # Modal/dialog component
│   │   │   ├── sidebar.tsx            # Sidebar component
│   │   │   └── ...                    # Other UI primitives
│   │   ├── admin/                     # Admin-specific components
│   │   │   ├── AdminSidebar.tsx       # Admin navigation sidebar
│   │   │   ├── AdminNavbar.tsx        # Admin top navbar
│   │   │   ├── ArticlesTable.tsx      # Articles list table
│   │   │   ├── UsersManagement.tsx    # User management interface
│   │   │   ├── Mobile*.tsx            # Mobile-optimized admin components
│   │   │   └── ...                    # Other admin components
│   │   ├── ads/                       # Advertisement components
│   │   │   ├── AdSense.tsx            # Google AdSense wrapper
│   │   │   ├── AdBanner.tsx           # Banner ad slots
│   │   │   ├── AdInContent*.tsx       # In-content ads (1, 2, 3)
│   │   │   └── ...                    # Other ad variations
│   │   ├── publishing/                # Publishing workflow components
│   │   │   └── steps/                 # Publishing wizard steps
│   │   │       ├── ContentEditingStep.tsx
│   │   │       ├── ContentPreviewStep.tsx
│   │   │       ├── SocialMediaStep.tsx
│   │   │       └── ConfirmationStep.tsx
│   │   ├── AdminPageHeader.tsx        # Admin page header
│   │   ├── ClientNavbar.tsx           # Client-side navbar
│   │   ├── Footer.tsx                 # Footer component
│   │   ├── ErrorBoundary.tsx          # React error boundary
│   │   ├── LanguageSwitcher.tsx       # Language selection
│   │   ├── LeaguePage.tsx             # League detail template
│   │   ├── LatestPageClient.tsx       # Latest articles feed template
│   │   └── ...                        # Other shared components
│   ├── hooks/                         # Custom React hooks
│   │   ├── useArticles.ts             # Article data fetching hook
│   │   ├── useTheme.ts                # Theme management hook
│   │   ├── useTranslation.ts          # Translation hook
│   │   ├── useToast.ts                # Toast notifications hook
│   │   └── use-toast.ts               # Shadcn toast hook
│   ├── lib/                           # Utilities and services
│   │   ├── auth.tsx                   # Cognito authentication provider
│   │   ├── api.ts                     # API client with admin/public methods
│   │   ├── config.ts                  # Configuration (API URLs, auth config)
│   │   ├── i18n.ts                    # i18n setup and helpers
│   │   ├── image-utils.ts             # Image processing helpers
│   │   ├── date-utils.ts              # Date formatting utilities
│   │   ├── theme.ts                   # Theme configuration
│   │   ├── theme-utils.ts             # Theme utility functions
│   │   ├── mobile-utils.ts            # Mobile detection hooks
│   │   ├── translations.ts            # Translation functions
│   │   ├── content-validation.ts      # Content validation rules
│   │   ├── analytics.ts               # Analytics integration
│   │   ├── ads.ts                     # Ad configuration
│   │   ├── clubs-api.ts               # Club data fetching
│   │   ├── leagues-api.ts             # League data fetching
│   │   ├── players-api.ts             # Player data fetching
│   │   ├── dictionary-server.ts       # Server-side dictionary loading
│   │   ├── dictionary-provider.tsx    # Dictionary React provider
│   │   ├── dictionary-context.tsx     # Dictionary context setup
│   │   ├── utils.ts                   # General utilities
│   │   └── typography.ts              # Typography scale definition
│   ├── dictionaries/                  # i18n translation files
│   │   └── [locale].json              # JSON translation files
│   ├── middleware.ts                  # Next.js middleware (request interception)
│   └── globals.css                    # Global styles (Tailwind setup)
├── public/                            # Static assets
│   ├── assets/                        # Images and logos
│   ├── logos/leagues/                 # League-specific logos
│   └── favicon-*.png                  # Favicon variants
├── .planning/                         # Project planning documentation
│   └── codebase/                      # Architecture documentation
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── next.config.js                     # Next.js configuration
└── tailwind.config.js                 # Tailwind CSS configuration
```

## Directory Purposes

**src/app/:**
- Purpose: Next.js App Router - defines all routes and page structures
- Contains: Page components, API routes, layouts
- Key files: `page.tsx` for pages, `layout.tsx` for nested layouts, `route.ts` for API handlers

**src/app/[locale]/:**
- Purpose: Locale-prefixed public pages
- Contains: User-facing pages, article views, transfer feeds
- Pattern: Each feature gets a directory with `page.tsx` file

**src/app/admin/:**
- Purpose: Protected admin section
- Contains: Editorial tools, analytics, user management
- Protection: `layout.tsx` redirects unauthenticated users to login

**src/app/api/:**
- Purpose: Backend proxy layer
- Contains: Route handlers that forward requests to AWS backend
- Pattern: Route structure mirrors backend API (e.g., `/api/admin/articles/[id]` → proxies to backend's `/admin/articles/{id}`)

**src/components/:**
- Purpose: Reusable React components
- Organization: Feature-based subdirectories (admin, ads, publishing, ui)
- Pattern: Each component is a file (ArticlesTable.tsx) or directory with index export

**src/components/ui/:**
- Purpose: Base UI components from Radix UI
- Contains: Styled primitives (Button, Card, Dialog, etc.)
- Pattern: Component composition using Tailwind + class-variance-authority

**src/components/admin/:**
- Purpose: Admin-specific components
- Contains: Tables, forms, management interfaces
- Pattern: `Mobile*` prefix indicates mobile-optimized variants

**src/components/publishing/:**
- Purpose: Publishing workflow components
- Contains: Multi-step wizard and step components
- Pattern: Steps directory has individual step components with shared interface

**src/hooks/:**
- Purpose: Custom React hooks
- Contains: Data fetching logic, state management, utilities
- Pattern: File per hook (useArticles.ts), exported as named function

**src/lib/:**
- Purpose: Utility functions and services
- Organization: Feature-based (auth, i18n, api, config)
- Pattern: Services export functions or objects (adminApi, authProvider)

**src/dictionaries/:**
- Purpose: i18n translation files
- Contains: JSON files for each supported locale
- Pattern: Flat structure with nested keys for organization

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout, global providers setup
- `src/app/page.tsx`: Root page redirect to locale
- `src/app/[locale]/layout.tsx`: Locale wrapper with i18n
- `src/app/admin/layout.tsx`: Admin auth guard and layout
- `src/middleware.ts`: Request middleware for locale routing

**Configuration:**
- `src/lib/config.ts`: API URLs, auth config, endpoints, feature flags
- `tsconfig.json`: TypeScript with path alias `@/*` → `src/*`
- `next.config.js`: Next.js build and runtime configuration
- `tailwind.config.js`: Tailwind CSS theme and plugins

**Core Logic:**
- `src/lib/api.ts`: API client with methods for all endpoints (47KB file)
- `src/lib/auth.tsx`: Cognito authentication context provider
- `src/app/api/admin/articles/[id]/route.ts`: Core article proxy with CRUD
- `src/app/admin/articles/publish/[articleId]/[step]/page.tsx`: Publishing workflow

**Testing:**
- No dedicated test files found in codebase
- Testing infrastructure not configured (no jest.config or vitest.config)

**Utilities:**
- `src/lib/image-utils.ts`: Image URL processing and optimization
- `src/lib/date-utils.ts`: Date formatting and calculations
- `src/lib/mobile-utils.ts`: Mobile detection and responsive utilities
- `src/lib/content-validation.ts`: Form validation schemas

## Naming Conventions

**Files:**
- PascalCase: React components (`ArticlesTable.tsx`, `AdminSidebar.tsx`)
- camelCase: Utilities and services (`useArticles.ts`, `api.ts`, `config.ts`)
- kebab-case: Dynamic route segments (`[locale]`, `[id]`, `[articleId]`)
- suffix conventions: `Page` for pages (AdminPage), `Provider` for context providers, `Boundary` for error boundaries

**Directories:**
- camelCase: Utility directories (`lib/`, `hooks/`, `dictionaries/`)
- lowercase: Feature directories (`admin/`, `ads/`, `api/`, `components/`, `app/`)
- bracket notation: Dynamic routes (`[locale]/`, `[id]/`)
- kebab-case: Feature names (`admin/articles/`, `api/admin/newsletters/`)

**React Components:**
- PascalCase export name matching filename
- Client-only components marked with `'use client'` at top
- Custom hooks start with `use` prefix (useArticles, useTheme)
- Provider components end with `Provider` suffix

**Type Names:**
- PascalCase interfaces (Article, Transfer, User)
- Suffix `Type` for context types (AuthContextType)
- Suffix `Props` for component prop types
- Suffix `Config` for configuration objects (API_CONFIG, AUTH_CONFIG)

## Where to Add New Code

**New Feature (e.g., new article type):**
- Primary code: `src/app/[locale]/[feature-name]/page.tsx` (or `src/app/[locale]/[feature-name]/[slug]/page.tsx` for detail)
- API route: `src/app/api/[feature-name]/route.ts` (if backend integration needed)
- Components: `src/components/[Feature]*.tsx` (new components as needed)
- Hooks: `src/hooks/use[Feature].ts` (if data fetching needed)
- Styles: Use Tailwind classes in components, no separate CSS files

**New Admin Page:**
- Page file: `src/app/admin/[feature]/page.tsx`
- Components: `src/components/admin/[Feature].tsx` or subdirectory
- Mobile variant: `src/components/admin/Mobile[Feature].tsx`
- API routes: Proxy existing backend endpoints or add new ones to `src/app/api/admin/`

**New Component/Module:**
- UI components: `src/components/[ComponentName].tsx` (single file)
- Feature components: `src/components/[feature]/[ComponentName].tsx` (subdirectory)
- Shared components: `src/components/[ComponentName].tsx` at root
- Barrel export: Optional `index.ts` file to re-export from directory

**Utilities:**
- Helper functions: `src/lib/[feature]-utils.ts`
- API client methods: Add to `src/lib/api.ts` under appropriate namespace (adminApi, publicApi, etc.)
- Hooks: `src/hooks/use[Feature].ts`

**Styling:**
- Component styles: Inline Tailwind classes (no CSS files)
- Global styles: `src/app/globals.css` only for base reset and global setup
- Theme: Configure in `tailwind.config.js` and use via Tailwind classes
- Responsive: Use Tailwind breakpoints (sm:, md:, lg:)

**i18n:**
- Add translations: Edit JSON files in `src/dictionaries/`
- Add new language: Create `src/dictionaries/[locale].json` file
- Register locale: Update `src/lib/i18n.ts` locales array
- Use in component: Import hook or context, access dictionary object

## Special Directories

**src/app/[locale]/:**
- Purpose: Dynamic locale segments for multi-language support
- Generated: No (manually structured)
- Committed: Yes (part of codebase)
- Usage: All public pages must be under this route group

**src/app/admin/:**
- Purpose: Protected admin section
- Generated: No (manually structured)
- Committed: Yes (part of codebase)
- Usage: Requires authentication via layout.tsx guard

**src/app/api/:**
- Purpose: Next.js API routes (backend proxies)
- Generated: No (manually created)
- Committed: Yes (part of codebase)
- Usage: All client requests to backend go through these proxies

**public/:**
- Purpose: Static assets served by Next.js
- Generated: Partially (favicons can be generated)
- Committed: Yes (images, logos committed)
- Usage: Accessed via `/filename` from HTML

**src/dictionaries/:**
- Purpose: JSON translation files
- Generated: No (manually maintained)
- Committed: Yes (translation source files)
- Usage: Loaded server-side during page render via `getDictionary(locale)`

---

*Structure analysis: 2026-03-17*
