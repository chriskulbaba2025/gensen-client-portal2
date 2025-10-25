// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from './lib/verifyCognitoJwt';

const LOGIN = '/login';
const DASH = '/dashboard/welcome';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get('gensen_session')?.value;

  // ignore assets and API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api')
  ) return NextResponse.next();

  // if hitting /login and already authenticated → go to dashboard
  if (pathname.startsWith(LOGIN) && token) {
    const ok = await verifyIdToken(token).catch(() => false);
    if (ok) return NextResponse.redirect(new URL(DASH, req.url));
  }

  // protect app routes
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
  matcher: ['/login', '/dashboard/:path*', '/generate/:path*', '/voice/:path*', '/map/:path*'],
};
