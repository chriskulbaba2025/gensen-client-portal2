import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from './lib/verifyCognitoJwt';

const LOGIN_URL = 'https://portal.omnipressence.com/login';
const DASHBOARD_URL = 'https://portal.omnipressence.com/dashboard/welcome';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get('gensen_session')?.value;

  // Skip middleware for static assets or Next internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  // Unauthenticated access to protected routes
  if (
    !token &&
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/generate') ||
      pathname.startsWith('/voice') ||
      pathname.startsWith('/map'))
  ) {
    const loginUrl = new URL(LOGIN_URL);
    loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated user hits /login → go to dashboard instead
  if (token && pathname.startsWith('/login')) {
    const valid = await verifyIdToken(token).catch(() => false);
    if (valid) {
      return NextResponse.redirect(new URL(DASHBOARD_URL));
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
  ],
};
