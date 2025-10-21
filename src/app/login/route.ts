import { NextResponse } from "next/server";
import crypto from "crypto";

// Environment variables (must be defined in Vercel)
const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const REDIRECT_URI = process.env.OAUTH_REDIRECT_URI!;

/**
 * Generates PKCE verifier and challenge.
 * Cognito requires SHA256 + Base64URL encoding.
 */
function generatePkcePair() {
  const verifier = crypto.randomBytes(64).toString("base64url");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
  return { verifier, challenge };
}

/**
 * GET /login → Redirects to Cognito hosted UI with PKCE
 */
export async function GET() {
  try {
    const { verifier, challenge } = generatePkcePair();

    // Store verifier securely in an HTTP-only cookie
    const response = NextResponse.redirect(
      `${COGNITO_DOMAIN}/oauth2/authorize?${new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: "openid email profile",
        code_challenge_method: "S256",
        code_challenge: challenge,
      }).toString()}`
    );

    response.cookies.set("pkce_verifier", verifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 300, // 5 minutes
    });

    return response;
  } catch (err) {
    console.error("Login redirect error:", err);
    return new NextResponse("Login initialization failed", { status: 500 });
  }
}
