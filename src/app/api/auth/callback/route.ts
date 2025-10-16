import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/login", req.url));

  const verifier = (await cookies()).get("cv")?.value;
  if (!verifier) return NextResponse.redirect(new URL("/login", req.url));

  const domain = process.env.COGNITO_DOMAIN!;
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const redirectUri = process.env.OAUTH_REDIRECT_URI!;
  const postLogin = process.env.POST_LOGIN_REDIRECT || "/";

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code_verifier: verifier,
    code,
    redirect_uri: redirectUri,
  });

  const tokenRes = await fetch(domain + "/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!tokenRes.ok) return NextResponse.redirect(new URL("/login", req.url));

  const t = await tokenRes.json() as {
    id_token: string; access_token: string; refresh_token?: string; expires_in: number;
  };

  const res = NextResponse.redirect(new URL(postLogin, req.url), { status: 302 });
  res.cookies.set("id_token", t.id_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: t.expires_in });
  res.cookies.set("access_token", t.access_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: t.expires_in });
  if (t.refresh_token) res.cookies.set("refresh_token", t.refresh_token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  res.cookies.set("cv", "", { path: "/", maxAge: 0 });
  return res;
}
