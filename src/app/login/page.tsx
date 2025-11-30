'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const ENV = {
  NEXT_PUBLIC_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
  NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
};

export default function LoginPage() {
  const [redirectUri, setRedirectUri] = useState('');

  // ✅ Compute redirect URI once on client
  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      setRedirectUri('http://localhost:3000/api/auth/callback');
    } else {
      setRedirectUri('https://portal.omnipressence.com/api/auth/callback');
    }
  }, []);

  if (!redirectUri) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-gray-500">
        Loading login...
      </div>
    );
  }

  // 🔐 Cognito Hosted UI login link
  const loginUrl = `${ENV.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize?response_type=code&client_id=${
    ENV.NEXT_PUBLIC_COGNITO_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=openid+email+profile&state=gensen_login`;

  return (
    <div className="w-screen min-h-screen flex flex-col items-center pt-[100px] bg-[#f7f9fc] dark:bg-[#000000]">
      {/* Logo */}
      <div className="flex justify-center mb-[30px] w-full">
        <div className="flex justify-center mb-[30px] w-full">
  <Image
    src="https://omnipressence.com/wp-content/uploads/2025/09/Gensen-Logo-Final-version-lower-case-logo-and-spaces1-356x295-1.webp"
    alt="Gensen Logo"
    width={220}
    height={180}
    className="object-contain rounded-[15px]"
    priority
  />
</div>
      </div>

      {/* Title */}
      <h1 className="text-[24px] font-bold mb-[20px] text-center text-[#000000] dark:text-[#ffffff] font-raleway">
        Login to Gensen
      </h1>

      {/* Cognito Login Button */}
      <a
        href={loginUrl}
        className="w-[350px] py-[12px] rounded-[10px] border border-[#076aff] bg-[#076aff] text-[#ffffff] text-center hover:bg-[#005ae0] transition font-medium"
      >
        Sign into your Gensen portal
      </a>

{/* Forgot Password */}
<p className="mt-[20px] w-[350px] py-[10px] rounded-[10px] border border-[#076aff] text-[#076aff] text-center">
  Forgot password? Enter your email and click Next
</p>
</div> ); }
