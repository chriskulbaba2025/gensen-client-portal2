// src/app/api/auth/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/verifyCognitoJwt';

export async function GET(req: NextRequest) {
  // read token from request cookies
  const token = req.cookies.get('gensen_session')?.value;

  if (!token)
    return NextResponse.json({ ok: false, error: 'NO_TOKEN' }, { status: 401 });

  try {
    // verify and decode Cognito JWT
    const payload: any = await verifyIdToken(token);
  
    const email = (payload.email || '').toLowerCase();
  
    return NextResponse.json({
      ok: true,
      user: {
        sub: payload.sub || '',
        email,
        name: payload.name || payload['cognito:username'] || '',
      },
    });
  } catch (e) {
    console.error('Token verification error', e);
    return NextResponse.json(
      { ok: false, error: 'INVALID_TOKEN' },
      { status: 401 }
    );
  }
}
