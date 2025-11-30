// src/lib/env.ts
export const ENV = {
    COGNITO_DOMAIN: process.env.COGNITO_DOMAIN!,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID!,
    NEXT_PUBLIC_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
    NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
  };
  
  for (const [key, value] of Object.entries(ENV)) {
    if (!value) throw new Error(`Missing environment variable: ${key}`);
  }
  
