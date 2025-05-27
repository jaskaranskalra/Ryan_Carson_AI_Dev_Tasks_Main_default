import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Paths that don't require authentication
const publicPaths = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth',
]

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Allow static files and API routes (except /api/profile and /api/partner)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    (pathname.startsWith('/api') &&
      !pathname.startsWith('/api/profile') &&
      !pathname.startsWith('/api/partner') &&
      !pathname.startsWith('/api/preferences'))
  ) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to sign in
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check if user has completed onboarding
  if (pathname !== '/onboarding' && !token.isOnboarded) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next (Next.js internals)
     * 2. /static (static files)
     * 3. /_vercel (Vercel internals)
     * 4. /favicon.ico, /robots.txt (static files)
     */
    '/((?!_next|static|_vercel|favicon.ico|robots.txt).*)',
  ],
} 