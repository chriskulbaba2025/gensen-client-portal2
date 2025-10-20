import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { ENV } from "@/lib/env";

/**
 * Production callback endpoint for Cognito → Next.js.
 * Exchanges authorization code for tokens, verifies ID token,
 * and sets secure session cookie before redirecting user.
 */

const REDIRECT_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/auth/callback"
    : "https://gensen.omnipressence.com/api/auth/callback";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    // 1️⃣ If no auth code, go back to login
    if (!code) {
      return NextResponse.redirect("https://gensen.omnipressence.com/login");
    }

    // 2️⃣ Exchange the authorization code for tokens
    const tokenRes = await fetch(`${ENV.COGNITO_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: ENV.COGNITO_CLIENT_ID,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      console.error("Cognito token exchange failed", await tokenRes.text());
      return NextResponse.redirect("https://gensen.omnipressence.com/login?error=token_exchange_failed");
    }

    const tokens = await tokenRes.json();

    // 3️⃣ Verify ID token with Cognito JWKs
    const jwks = createRemoteJWKSet(new URL(`${ENV.COGNITO_DOMAIN}/.well-known/jwks.json`));
    const { payload } = await jwtVerify(tokens.id_token, jwks, {
      audience: ENV.COGNITO_CLIENT_ID,
    });

    // 4️⃣ Set secure cookie for the session
    const res = NextResponse.redirect("https://gensen.omnipressence.com/dashboard/welcome");
    res.cookies.set("gensen_session", tokens.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: ".omnipressence.com",
      maxAge: 3600, // 1 hour
    });

    // 5️⃣ Optionally include user info (for debugging/logging)
    console.log("Cognito user verified:", payload.email || payload.sub);

    return res;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect("https://gensen.omnipressence.com/login?error=callback_failed");
  }
}
