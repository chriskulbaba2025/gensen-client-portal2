import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from './lib/verifyCognitoJwt';

const LOGIN = '/login';
const DASH = '/dashboard/welcome';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get('gensen_session')?.value;

  // ───────────────────────────────────────────────
  // Allow static assets, APIs, and signup page
  // ───────────────────────────────────────────────
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/client-signup')
  ) {
    return NextResponse.next();
  }

  // ───────────────────────────────────────────────
  // Redirect authenticated users away from /login
  // ───────────────────────────────────────────────
  if (pathname.startsWith(LOGIN) && token) {
    const ok = await verifyIdToken(token).catch(() => false);
    if (ok) return NextResponse.redirect(new URL(DASH, req.url));
  }

  // ───────────────────────────────────────────────
  // Protect dashboard and internal routes
  // ───────────────────────────────────────────────
  const needsAuth =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/generate') ||
    pathname.startsWith('/voice') ||
    pathname.startsWith('/map');

  if (needsAuth) {
    if (!token) {
      const url = new URL(LOGIN, req.url);
      url.searchParams.set('next', pathname + search);
      return NextResponse.redirect(url);
    }

    const ok = await verifyIdToken(token).catch(() => false);
    if (!ok) {
      const url = new URL(LOGIN, req.url);
      url.searchParams.set('next', pathname + search);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/generate/:path*',
    '/voice/:path*',
    '/map/:path*',
    '/client-signup',
  ],
};
