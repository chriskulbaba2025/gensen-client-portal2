import { NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ await required
    const id = cookieStore.get("id_token")?.value;

    if (!id)
      return NextResponse.json({ authenticated: false }, { status: 401 });

    const region = process.env.COGNITO_REGION!;
    const poolId = process.env.COGNITO_USER_POOL_ID!;
    const clientId = process.env.COGNITO_CLIENT_ID!;

    const issuer = `https://cognito-idp.${region}.amazonaws.com/${poolId}`;
    const JWKS = createRemoteJWKSet(
      new URL(`${issuer}/.well-known/jwks.json`)
    );

    const { payload } = await jwtVerify(id, JWKS, {
      issuer,
      audience: clientId,
    });

    return NextResponse.json({
      authenticated: true,
      sub: payload.sub,
      email: payload.email,
      exp: payload.exp,
    });
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
