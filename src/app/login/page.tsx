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
      router.push('/dashboard/welcome');
    } catch {
      setError('Please enter a valid email and password.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard/welcome');
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center pt-[100px] bg-transparent dark:bg-[#000000]">
      {/* Logo */}
      <div className="flex justify-center mb-[30px] w-full">
        <Image
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="Gensen Logo"
          width={250}
          height={250}
        />
      </div>

      {/* Heading */}
      <h1 className="text-[24px] font-bold mb-[20px] text-center text-[#000000] dark:text-[#ffffff]">
        Login to Gensen
      </h1>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col items-center space-y-[12px] w-full">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-[350px] px-[12px] py-[10px] border border-[#d1d5db] rounded-[10px] bg-[#ffffff] dark:bg-[#ffffff] text-[#000000] placeholder:text-[#888888] focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-[350px] px-[12px] py-[10px] border border-[#d1d5db] rounded-[10px] bg-[#ffffff] dark:bg-[#ffffff] text-[#000000] placeholder:text-[#888888] focus:outline-none"
        />

        {error && <p className="text-[#ff0000] text-[14px]">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          className="w-[350px] py-[10px] rounded-[10px] border border-[#000000] bg-[#ffffff] dark:bg-[#ffffff] text-[#000000] hover:bg-[#0000ff] hover:text-[#ffffff] transition"
        >
          Login
        </button>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-[350px] flex items-center justify-center gap-[10px] py-[10px] rounded-[10px] border border-[#000000] bg-[#ffffff] dark:bg-[#ffffff] text-[#000000] hover:bg-[#0000ff] hover:text-[#ffffff] transition"
        >
          <div className="p-[4px] rounded-full bg-[#ffffff] dark:bg-[#ffffff]">
            <FcGoogle size={20} />
          </div>
          <span>Continue with Google</span>
        </button>

        {/* Create Account Link */}
        <p className="mt-[12px] text-[14px]">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-[#FF6600] hover:underline">
            Create one
          </Link>
        </p>

        {/* Forgot Password */}
        <Link
          href="/forgot-password"
          className="
            mt-[20px] inline-block w-[350px] py-[10px]
            bg-[#f66630] dark:bg-[#f66630]
            rounded-[10px] border border-[#f66630]
            text-[#000000] dark:text-[#000000]
            hover:bg-[#e0552b]
            hover:text-[#ffffff]
            text-center transition
          "
        >
          Forgot your password?
        </Link>
      </form>
    </div>
  );
}
