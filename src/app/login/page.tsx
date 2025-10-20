'use client';

import React from 'react';
import Image from 'next/image';
const ENV = {
  NEXT_PUBLIC_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
  NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
};


export default function LoginPage() {
  const redirectUri = 'https://gensen.omnipressence.com/api/auth/callback';
  const loginUrl = `${ENV.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize?response_type=code&client_id=${ENV.NEXT_PUBLIC_COGNITO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=openid+email+profile`;

  return (
    <div className="w-screen min-h-screen flex flex-col items-center pt-[100px] bg-[#f7f9fc] dark:bg-[#000000]">
      {/* Logo */}
      <div className="flex justify-center mb-[30px] w-full">
        <div className="relative w-[220px] h-[180px]">
          <Image
            src="https://omnipressence.com/wp-content/uploads/2025/09/Gensen-Logo-Final-version-lower-case-logo-and-spaces1-356x295-1.webp"
            alt="Gensen Logo"
            fill
            className="object-contain rounded-[15px]"
          />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-[24px] font-bold mb-[20px] text-center text-[#000000] dark:text-[#ffffff] font-raleway">
        Login to Gensen
      </h1>

      {/* Cognito Login Button */}
      <a
        href={loginUrl}
        className="w-[350px] py-[12px] rounded-[10px] border border-[#076aff] bg-[#076aff] text-[#ffffff] text-center hover:bg-[#005ae0] transition font-medium"
      >
        Sign in with Cognito
      </a>

      {/* Forgot Password */}
      <a
        href={`${ENV.NEXT_PUBLIC_COGNITO_DOMAIN}/forgotPassword?client_id=${ENV.NEXT_PUBLIC_COGNITO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}`}
        className="mt-[20px] inline-block w-[350px] py-[10px] rounded-[10px] border border-[#076aff] text-[#076aff] hover:bg-[#076aff] hover:text-[#ffffff] text-center transition"
      >
        Forgot your password?
      </a>
    </div>
  );
}
