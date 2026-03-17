# Technology Stack

**Analysis Date:** 2026-03-17

## Languages

**Primary:**
- TypeScript 5.8.3 - Full codebase (frontend)
- JavaScript - Configuration files

**Secondary:**
- Python 3 - Backend Lambda functions (in ../infra)

## Runtime

**Environment:**
- Node.js (via Next.js runtime)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 15.3.5 - Frontend framework with App Router
- React 19.0.0 - UI library

**UI Components:**
- Radix UI - Accessible component library (`@radix-ui/*` suite)
- shadcn/ui - Component system built on Radix UI via `components.json`
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- Lucide React 0.525.0 - Icon library

**Styling & Utilities:**
- class-variance-authority 0.7.1 - CSS class composition
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.3.1 - Merge Tailwind classes intelligently
- tailwindcss-animate 1.0.7 - Animation utilities for Tailwind

**Rich Text & Media:**
- @uiw/react-md-editor 4.0.7 - Markdown editor component
- recharts 3.1.0 - Data visualization library
- Image optimization via Next.js Image component

**Analytics:**
- next-plausible 3.12.4 - Privacy-first analytics wrapper
- Plausible Analytics integration (configured in `next.config.ts`)

**Theming:**
- next-themes 0.4.6 - Dark mode management

**AWS Integration:**
- @aws-sdk/client-lambda 3.864.0 - Lambda client (unused in frontend, prepared for Lambda invocation)

## Key Dependencies

**Critical:**
- next: 15.3.5 - Core framework
- react: 19.0.0 - UI runtime
- typescript: 5.8.3 - Type safety

**Infrastructure:**
- @aws-sdk/client-lambda - AWS Lambda integration (prepared but not currently used in frontend)

## Configuration

**Environment:**
- NEXT_PUBLIC_API_URL - Backend API base URL (required, no fallback)
- NEXT_PUBLIC_API_URL_FALLBACK - Optional fallback API URL
- NEXT_PUBLIC_USER_POOL_ID - AWS Cognito user pool ID
- NEXT_PUBLIC_USER_POOL_CLIENT_ID - Cognito app client ID
- NODE_ENV - Development/production mode

**Build:**
- `next.config.js` - Next.js configuration with image optimization
- `next.config.ts` - TypeScript version with Plausible proxy configuration
- `tsconfig.json` - TypeScript compiler options (ES2017 target, strict mode)
- `tailwind.config.js` - Tailwind CSS configuration with shadcn/ui setup
- `postcss.config.js` / `postcss.config.mjs` - PostCSS configuration
- `components.json` - shadcn/ui configuration
- `eslint.config.mjs` - ESLint configuration with Next.js and TypeScript rules

**Linting & Formatting:**
- ESLint 9 - Linter with Next.js rules
- @next/core-web-vitals - Next.js best practices

## Platform Requirements

**Development:**
- Node.js (npm)
- TypeScript 5.8+

**Production:**
- Vercel (Next.js deployment target via image hostname patterns: `*.cloudfront.net`, `*.amazonaws.com`, `s3.amazonaws.com`)
- AWS CloudFront CDN for image delivery
- AWS S3 for image storage (via presigned URLs through `/api/admin/media/upload`)

## Key Features

**Image Handling:**
- Remote image loading from CloudFront and S3 via `next/image` with remotePatterns
- Image upload to S3 via `/api/admin/media/upload` endpoint
- Formats optimized: WebP, AVIF

**API Routes:**
- Next.js API routes in `/src/app/api/` acting as proxy layer
- Forward authentication headers to backend AWS API
- Routes for: articles, newsletter, translation, media upload, admin operations

---

*Stack analysis: 2026-03-17*
