import { NextResponse } from "next/server";

export async function GET() {
  const domain = process.env.COGNITO_DOMAIN!;
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const postLogout = process.env.POST_LOGOUT_REDIRECT || "/";
  const url = new URL(domain + "/logout");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("logout_uri", postLogout);

  const res = NextResponse.redirect(url.toString(), { status: 302 });
  for (const k of ["id_token","access_token","refresh_token","cv"]) {
    res.cookies.set(k, "", { path:"/", maxAge:0 });
  }
  return res;
}
