import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { locales, defaultLocale, isValidLocale, type Locale } from './lib/i18n'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Refresh Supabase session on every request (keeps cookies alive)
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session (important — keeps auth alive)
  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes server-side
  if (pathname.startsWith('/admin') && !user) {
    const loginUrl = new URL('/login', request.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  // Skip locale logic for API routes, admin, and auth routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth')
  ) {
    return response
  }

  // Check if the pathname already has a valid locale
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment && isValidLocale(firstSegment)) {
    return response
  }

  // No locale in pathname, determine the appropriate locale
  let locale: Locale = defaultLocale

  const localeCookie = request.cookies.get('locale')?.value
  if (localeCookie && isValidLocale(localeCookie)) {
    locale = localeCookie
  } else {
    locale = defaultLocale
  }

  // Redirect to include the locale
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url)
  response = NextResponse.redirect(redirectUrl, 307)

  response.cookies.set('locale', locale, {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
