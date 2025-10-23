import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from './lib/verifyCognitoJwt';

const LOGIN_URL = 'https://portal.omnipressence.com/login';
const DASHBOARD_URL = 'https://portal.omnipressence.com/dashboard/welcome';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get('gensen_session')?.value;

  // ───────────────────────────────────────────────
  // No session cookie → redirect to login
  // ───────────────────────────────────────────────
  if (!token) {
    const loginUrl = new URL(LOGIN_URL);
    loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // ───────────────────────────────────────────────
  // Validate JWT signature (basic check)
  // ───────────────────────────────────────────────
  const valid = await verifyIdToken(token).catch(() => false);
  if (!valid) {
    const loginUrl = new URL(LOGIN_URL);
    loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // ───────────────────────────────────────────────
  // If user already authenticated and on /login → skip back to dashboard
  // ───────────────────────────────────────────────
  if (pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL(DASHBOARD_URL));
  }

  // ───────────────────────────────────────────────
  // Allow access to requested page
  // ───────────────────────────────────────────────
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
