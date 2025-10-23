import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Cognito → Next.js callback handler with PKCE
 * 1. Exchanges authorization code for tokens (includes code_verifier)
 * 2. Verifies ID token signature using Cognito JWKS
 * 3. Stores ID token in secure cookie
 * 4. Redirects user to dashboard
 */

const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const REDIRECT_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/auth/callback"
    : "https://portal.omnipressence.com/api/auth/callback";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code)
      return NextResponse.redirect("https://portal.omnipressence.com/login");

    // Retrieve PKCE verifier from cookie
    const cookiesHeader = req.headers.get("cookie") || "";
    const verifierMatch = cookiesHeader.match(/pkce_verifier=([^;]+)/);
    const codeVerifier = verifierMatch ? verifierMatch[1] : "";

    // Exchange authorization code for tokens
    const tokenRes = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: COGNITO_CLIENT_ID,
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenRes.ok) {
      console.error("Cognito token exchange failed", await tokenRes.text());
      return NextResponse.redirect(
        "https://portal.omnipressence.com/login?error=token_exchange_failed"
      );
    }

    const tokens = await tokenRes.json();

    // Verify ID token signature against Cognito IdP JWKS
    const jwks = createRemoteJWKSet(
      new URL(
        "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_h3GTXtQg3/.well-known/jwks.json"
      )
    );
    const { payload } = await jwtVerify(tokens.id_token, jwks, {
      audience: COGNITO_CLIENT_ID,
    });

    // Set session cookie and redirect
    const res = NextResponse.redirect(
      "https://portal.omnipressence.com/dashboard/welcome"
    );
    res.cookies.set("gensen_session", tokens.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: ".omnipressence.com",
      maxAge: 3600,
    });

    console.log("Cognito user verified:", payload.email || payload.sub);
    return res;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(
      "https://portal.omnipressence.com/login?error=callback_failed"
    );
  }
}
