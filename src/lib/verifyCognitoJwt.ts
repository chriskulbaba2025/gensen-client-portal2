// src/lib/verifyCognitoJwt.ts
import { createRemoteJWKSet, jwtVerify } from 'jose';

const issuer = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_h3GTXtQg3';
const audience = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));

export async function verifyIdToken(token: string) {
  const { payload } = await jwtVerify(token, jwks, {
    issuer,
    audience,
    clockTolerance: 60, // small drift
  });

  // return full decoded payload
  return payload;
}
