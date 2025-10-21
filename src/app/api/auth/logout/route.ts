import { NextResponse } from "next/server";

const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const LOGOUT_REDIRECT = "https://portal.omnipressence.com/login";

export async function GET() {
  const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent(LOGOUT_REDIRECT)}`;
  const res = NextResponse.redirect(logoutUrl);

  res.cookies.delete("gensen_session");

  return res;
}
