import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';
import { ENV } from '@/lib/env';

const jwks = createRemoteJWKSet(
  new URL(`${ENV.COGNITO_DOMAIN}/.well-known/jwks.json`)
);

export async function verifyIdToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, jwks, {
      audience: ENV.COGNITO_CLIENT_ID,
    });
    return payload;
  } catch {
    return null;
  }
}
