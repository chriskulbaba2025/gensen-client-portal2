import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { ENV } from "@/lib/env";

const REDIRECT_URI = "https://gensen.omnipressence.com/api/auth/callback";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect("https://gensen.omnipressence.com/login");

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
  const tokens = await tokenRes.json();

  const jwks = createRemoteJWKSet(new URL(`${ENV.COGNITO_DOMAIN}/.well-known/jwks.json`));
  await jwtVerify(tokens.id_token, jwks, { audience: ENV.COGNITO_CLIENT_ID });

  const res = NextResponse.redirect(new URL("/dashboard/welcome", "https://gensen.omnipressence.com"));
  res.cookies.set("gensen_session", tokens.id_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    domain: ".omnipressence.com",
    maxAge: 3600,
  });
  return res;
}
