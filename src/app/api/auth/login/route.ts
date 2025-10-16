import { NextResponse } from "next/server";
import { generatePkce } from "@/lib/pkce";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const qpProvider = url.searchParams.get("provider");      // e.g. Google
  const qpScreen = url.searchParams.get("screen_hint");     // e.g. signup

  const region = process.env.COGNITO_REGION!;
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const domain = process.env.COGNITO_DOMAIN!;
  const redirectUri = process.env.OAUTH_REDIRECT_URI!;

  const { verifier, challenge } = generatePkce();

  const authorize = new URL(domain + "/oauth2/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", "openid email profile");
  authorize.searchParams.set("code_challenge_method", "S256");
  authorize.searchParams.set("code_challenge", challenge);
  if (qpProvider) authorize.searchParams.set("identity_provider", qpProvider);
  if (qpScreen) authorize.searchParams.set("screen_hint", qpScreen);

  const res = NextResponse.redirect(authorize.toString(), { status: 302 });
  res.cookies.set("cv", verifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
