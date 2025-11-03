import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from './lib/verifyCognitoJwt';

const LOGIN = '/login';
const DASH = '/dashboard/welcome';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get('gensen_session')?.value;

  // ignore assets, API routes, and the standalone client signup page
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/client-signup')
  ) {
    return NextResponse.next();
  }

  // redirect authenticated users away from /login
  if (pathname.startsWith(LOGIN) && token) {
    const ok = await verifyIdToken(token).catch(() => false);
    if (ok) return NextResponse.redirect(new URL(DASH, req.url));
  }

  // protect only these app routes
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
    '/client-signup', // explicitly include so it's recognized, but skipped in logic above
  ],
};
