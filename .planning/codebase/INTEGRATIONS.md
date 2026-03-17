# External Integrations

**Analysis Date:** 2026-03-17

## APIs & External Services

**Backend API:**
- AWS-hosted REST API - Core backend service
  - Base URL: `NEXT_PUBLIC_API_URL` environment variable (required)
  - Auth: Bearer token in Authorization header
  - Integration: HTTP fetch in Next.js API routes (`/src/app/api/*/route.ts`)

**Translation Service:**
- AWS Step Functions - Translation workflow orchestration
  - Endpoint: `{API_BASE_URL}/admin/start-translation`
  - Purpose: Multi-language article translation
  - Params: articleId, articleTitle, articleContent, targetLanguages (default: es, fr, de, it)
  - Implementation: `/src/app/api/admin/start-translation/route.ts`

**Analytics:**
- Plausible Analytics - Privacy-first analytics
  - Configuration: `next.config.ts` with `withPlausibleProxy()`
  - Domain: transfersdaily.com
  - Features: outbound link tracking, file download tracking
  - Client: `next-plausible` package
  - Implementation: `/src/lib/analytics.ts`
  - Events tracked: Article View, Newsletter Subscribe, Search Query, Transfer View, Contact Form Submit, Admin actions

## Data Storage

**Databases:**
- No direct database connection in frontend
- All database operations through AWS backend API

**File Storage:**
- AWS S3 - Article images and media
  - Upload endpoint: `/api/admin/media/upload` (proxies to backend)
  - Access: CloudFront CDN distribution (d2w4vhlo0um37d.cloudfront.net, d1ix9g9onn4adc.cloudfront.net)
  - Permitted image sources: `*.cloudfront.net`, `*.amazonaws.com`, `s3.amazonaws.com`

**Caching:**
- CloudFront CDN - Image delivery and edge caching

## Authentication & Identity

**Auth Provider:**
- AWS Cognito (us-east-1)
  - User Pool ID: `NEXT_PUBLIC_USER_POOL_ID` (default: us-east-1_R5AGrABLI)
  - Client ID: `NEXT_PUBLIC_USER_POOL_CLIENT_ID` (default: 7ka8dci4e4o9ua9ermiffdk0cq)
  - Endpoint: `https://cognito-idp.us-east-1.amazonaws.com/`
  - Implementation: `/src/lib/auth.tsx`
  - Auth flows: USER_PASSWORD_AUTH, REFRESH_TOKEN_AUTH
  - Storage: Browser localStorage with keys:
    - `transfersdaily_access_token` - JWT access token
    - `transfersdaily_id_token` - JWT ID token
    - `transfersdaily_refresh_token` - Refresh token
    - `transfersdaily_user` - User object (email, firstName, lastName)
  - Token refresh: Automatic on expiry via `refreshAccessToken()` in `/src/lib/api.ts`

## Monitoring & Observability

**Error Tracking:**
- No dedicated error tracking service integrated
- Console logging for debugging (development mode)

**Logs:**
- Browser console (client-side)
- Server logs via Next.js (development mode)
- Verbose logging in API routes with emojis for visual debugging

## CI/CD & Deployment

**Hosting:**
- Vercel (inferred from Next.js configuration and image routing patterns)

**CI Pipeline:**
- Not detected in frontend codebase
- Backend infrastructure in `../infra` (AWS CDK)

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_API_URL` - Backend API base URL (e.g., https://api.transfersdaily.com)
- `NEXT_PUBLIC_USER_POOL_ID` - AWS Cognito user pool ID
- `NEXT_PUBLIC_USER_POOL_CLIENT_ID` - Cognito app client ID
- `NODE_ENV` - Development/production mode

**Optional env vars:**
- `NEXT_PUBLIC_API_URL_FALLBACK` - Fallback API URL if primary fails

**Secrets location:**
- Environment variables (Vercel env vars, .env.local)
- Note: No .env files committed; configuration via platform-specific secret management

## Webhooks & Callbacks

**Incoming:**
- None detected in frontend

**Outgoing:**
- No direct webhook implementations
- Translation workflow callbacks handled by backend Step Functions

## Data Flow

**Article Publishing:**
1. User submits article via admin UI (`/src/app/admin/articles/publish/`)
2. Frontend calls `/api/admin/articles/{id}/publish` (POST)
3. Frontend API proxies to `{API_BASE_URL}/admin/articles/{id}/publish`
4. Authorization header (Bearer token) forwarded from client
5. Backend processes publish and returns status

**Translation Workflow:**
1. User initiates translation via `/src/app/admin/articles/publish/`
2. Frontend calls `/api/admin/start-translation` (POST)
3. Frontend validates input: articleId, articleTitle, articleContent, targetLanguages
4. Frontend proxies to `{API_BASE_URL}/admin/start-translation`
5. Backend invokes AWS Step Functions for async translation
6. Frontend polls `/api/admin/translation-status/{id}` for progress

**Newsletter Subscription:**
1. User subscribes via `/api/newsletter` (POST/GET)
2. Frontend proxies to `{API_BASE_URL}/newsletter`
3. Backend stores subscription in database

**Media Upload:**
1. User uploads image via ImageUpload component (`/src/components/ui/image-upload.tsx`)
2. Frontend calls `/api/admin/media/upload` (POST with FormData)
3. Frontend attaches Authorization header (Bearer token)
4. Backend processes upload to S3 and returns URL
5. Frontend receives presigned URL or public S3 path

**Image Delivery:**
- Images served from CloudFront CDN
- Optimized via Next.js Image component (WebP, AVIF formats)

## API Proxy Pattern

All admin and translation endpoints use Next.js API routes as middleware:

- Route: `/api/admin/*` or `/api/start-translation`
- Handler: Extracts Authorization header from client request
- Forward: Proxies request to `NEXT_PUBLIC_API_URL/admin/*` or `NEXT_PUBLIC_API_URL/start-translation`
- Return: Proxies response back to client
- Error handling: Graceful fallbacks for development mode

This pattern centralizes auth header forwarding and provides a consistent API surface.

---

*Integration audit: 2026-03-17*
