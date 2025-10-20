import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from './lib/verifyCognitoJwt';

const LOGIN_URL = 'https://gensen.omnipressence.com/login';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('gensen_session')?.value;

  if (!token) {
    const url = new URL(LOGIN_URL);
    url.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  const valid = await verifyIdToken(token);
  if (!valid) {
    const url = new URL(LOGIN_URL);
    url.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/generate/:path*',
    '/voice/:path*',
    '/map/:path*',
  ],
};
