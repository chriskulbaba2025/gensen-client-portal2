'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/generate/step-1');
    } catch (err: unknown) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'code' in err
          ? 'Please enter a valid email and password.'
          : 'Something went wrong. Please try again.';
      setError(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/generate/step-1');
    } catch (err: unknown) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'code' in err
          ? 'Google sign-in failed. Please try again.'
          : 'Something went wrong. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center mt-[100px]">
      {/* Logo */}
      <div className="flex justify-center mb-[30px]">
        <Image
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="Gensen Logo"
          width={250}
          height={250}
        />
      </div>

      {/* Heading */}
      <h1 className="text-[24px] font-bold mb-[20px] text-center">
        Login to Gensen
      </h1>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="space-y-[12px] flex flex-col items-center"
      >
        <input
          type="email"
          placeholder="Email"
          className="w-[350px] px-[12px] py-[10px] border border-gray-300 rounded-[10px]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-[350px] px-[12px] py-[10px] border border-gray-300 rounded-[10px]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-[14px]">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          className="w-[350px] text-[#000000] bg-[#ffffff] py-[10px] rounded-[10px] border border-[#000000] hover:bg-[#0000ff] hover:text-[#ffffff] transition"
        >
          Login
        </button>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-[350px] flex items-center justify-center gap-[10px] text-[#000000] bg-[#ffffff] py-[10px] rounded-[10px] border border-[#000000] hover:bg-[#0000ff] hover:text-[#ffffff] transition"
        >
          <div className="bg-[#ffffff] p-[4px] rounded-full">
            <FcGoogle size={20} />
          </div>
          <span>Continue with Google</span>
        </button>

        {/* Forgot Password */}
        <div className="text-center mt-[10px]">
          <Link
            href="/forgot-password"
            className="text-[14px] text-[#f66630] hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </form>
    </div>
  );
}
