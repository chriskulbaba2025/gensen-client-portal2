<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const validEmail = 'chris@omnipressence.com';
    const validPassword = 'test123';

    if (email === validEmail && password === validPassword) {
      localStorage.setItem('user', JSON.stringify({ email }));
      router.push('/dashboard/welcome');
    } else {
      setError('Invalid email or password.');
    }
  };

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
      <h1 className="text-[24px] font-bold mb-[20px] text-center text-[#000000] dark:text-[#ffffff]">
        Login to Gensen
      </h1>

      {/* Form */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center space-y-[12px] w-full"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-[350px] px-[12px] py-[10px] border border-[#d1d5db] rounded-[10px] bg-[#ffffff] text-[#000000] placeholder:text-[#888888] focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-[350px] px-[12px] py-[10px] border border-[#d1d5db] rounded-[10px] bg-[#ffffff] text-[#000000] placeholder:text-[#888888] focus:outline-none"
        />

        {error && <p className="text-[#ff0000] text-[14px]">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          className="w-[350px] py-[10px] rounded-[10px] border border-[#076aff] bg-[#076aff] text-[#ffffff] hover:bg-[#005ae0] transition"
        >
          Login
        </button>

        {/* Forgot Password */}
        <Link
          href="/forgot-password"
          className="mt-[20px] inline-block w-[350px] py-[10px] rounded-[10px] border border-[#076aff] text-[#076aff] hover:bg-[#076aff] hover:text-[#ffffff] text-center transition"
        >
          Forgot your password?
        </Link>
      </form>
=======
﻿// src/app/login/page.tsx
"use client";

import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();

  // When user is authenticated, go to dashboard
  useEffect(() => {
    if (auth.isAuthenticated) router.replace("/dashboard");
  }, [auth.isAuthenticated, router]);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        Loading…
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen grid place-items-center text-red-600">
        Error: {auth.error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#F9FAFB]">
      <button
        onClick={() => auth.signinRedirect()}
        className="px-6 py-3 rounded-md border border-gray-300 bg-white hover:bg-gray-100"
      >
        Sign in with Cognito
      </button>
>>>>>>> 79875a4 (Update Navbar and tiles to link to brand voice)
    </div>
  );
}
