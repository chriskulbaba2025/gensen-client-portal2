// src/app/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(user);
      await setDoc(doc(db, 'profiles', user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
      });
      router.push('/dashboard/welcome');
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Signup failed';
        setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-transparent dark:bg-[#000] px-4 pt-8">
      {/* Hero image – max 500px wide, with bottom margin */}
      <div className="mb-8">
        <Image
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/current-crop-1-1.webp"
          alt="Welcome to GENSEN"
          width={500}
          height={300}
          className="w-[500px] h-auto rounded-[10px] shadow-lg"
        />
      </div>

      <h1 className="text-4xl font-bold mb-6 text-center text-[#000] dark:text-[#fff]">
        Create Your GENSEN Account
      </h1>

      <form onSubmit={handleSignUp} className="w-[350px] mx-auto">
        {/* Name Field */}
        <div className="mb-[16px]">
          <label htmlFor="name" className="block text-[14px] font-medium mb-[4px]">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="
              w-full
              px-4
              py-[10px]
              pl-[15px]
              text-xl
              border border-[#d1d5db]
              rounded-[10px]
              bg-[#fff] dark:bg-[#111]
              text-[#000] placeholder:text-[#888]
              focus:outline-none
            "
          />
        </div>

        {/* Email Field */}
        <div className="mb-[16px]">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="
              w-full
              px-4
              py-[10px]
              pl-[15px]
              text-xl
              border border-[#d1d5db]
              rounded-[10px]
              bg-[#fff] dark:bg-[#111]
              text-[#000] placeholder:text-[#888]
              focus:outline-none
            "
          />
        </div>

        {/* Password Field */}
        <div className="mb-[16px]">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="
              w-full
              px-4
              py-[10px]
              pl-[15px]
              text-xl
              border border-[#d1d5db]
              rounded-[10px]
              bg-[#fff] dark:bg-[#111]
              text-[#000] placeholder:text-[#888]
              focus:outline-none
            "
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-[16px]">{error}</p>
        )}

        <button
          type="submit"
          className="
            w-full
            px-4
            py-[10px]
            text-xl font-semibold
            text-white
            bg-[#FF6600]
            rounded-[10px]
            hover:bg-[#e65500]
            transition
            mb-[16px]
          "
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
