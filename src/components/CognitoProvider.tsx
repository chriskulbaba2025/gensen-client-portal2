"use client";

import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_h3GTXtQg3",
  client_id: "6760cut29ql2vv5533nah20ihm",
  redirect_uri: "http://localhost:3000/login/callback",
  response_type: "code",
  scope: "openid email profile",
};

export default function CognitoProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
