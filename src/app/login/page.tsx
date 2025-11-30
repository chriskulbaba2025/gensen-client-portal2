'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const ENV = {
  NEXT_PUBLIC_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
  NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
};

export default function LoginPage() {
  const [redirectUri, setRedirectUri] = useState('');

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

  const loginUrl = `${ENV.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize?response_type=code&client_id=${
    ENV.NEXT_PUBLIC_COGNITO_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=openid+email+profile&state=gensen_login`;

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-start pt-[100px] bg-[#f7f9fc] dark:bg-[#000000]">

      {/* Logo */}
      <div className="flex justify-center mb-[40px]">
        <Image
          src="https://omnipressence.com/wp-content/uploads/2025/09/Gensen-Logo-Final-version-lower-case-logo-and-spaces1-356x295-1.webp"
          alt="Gensen Logo"
          width={220}
          height={180}
          className="rounded-[15px] object-contain"
          priority
        />
      </div>

      {/* Title */}
      <h1 className="text-[26px] font-bold mb-[25px] text-center text-[#000000] dark:text-white">
        Login to Gensen
      </h1>

      {/* Button */}
      <a
        href={loginUrl}
        className="w-[350px] py-[14px] rounded-[10px] border border-[#076aff] bg-[#076aff] text-white 
                   text-center text-[18px] hover:bg-[#005ae0] transition font-medium"
      >
        Sign into your Gensen portal
      </a>

      {/* Forgot Password */}
      <p className="mt-[20px] w-[350px] text-center text-[14px] text-[#333] dark:text-[#ccc]">
        Forgot password? Enter your email and click Next
      </p>

    </div>
  );
}
