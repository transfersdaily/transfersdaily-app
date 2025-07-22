import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale, isValidLocale } from './lib/i18n'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for API routes, static files, admin routes, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next()
  }

  // Check if the pathname already has a valid locale
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  
  if (firstSegment && isValidLocale(firstSegment)) {
    // Path already has a valid locale, continue
    return NextResponse.next()
  }

  // No locale in pathname, determine the appropriate locale
  let locale = defaultLocale

  // 1. Check for locale in cookie
  const localeCookie = request.cookies.get('locale')?.value
  if (localeCookie && isValidLocale(localeCookie)) {
    locale = localeCookie
  } else {
    // 2. Check Accept-Language header
    const acceptLanguage = request.headers.get('Accept-Language')
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage
        .split(',')[0]
        .split('-')[0]
        .toLowerCase()
      
      if (isValidLocale(preferredLocale)) {
        locale = preferredLocale
      }
    }
  }

  // Redirect to include the locale
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url)
  const response = NextResponse.redirect(redirectUrl, 307)
  
  // Set locale cookie for future requests
  response.cookies.set('locale', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
  
  return response
}

export const config = {
  matcher: [
    // Match all paths except those starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - admin (admin routes)
    // - login (auth routes)
    // - public folder files (images, etc.)
    '/((?!api|_next/static|_next/image|favicon.ico|admin|login|register|auth|.*\\.).*)',
  ],
}
