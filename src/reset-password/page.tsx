// src/app/reset-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get('mode');       // e.g. "resetPassword"
  const oobCode = params.get('oobCode'); // Firebase one-time code

  // Shared UI state
  const [email, setEmail]             = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage]         = useState('');
  const [error, setError]             = useState('');

  // 1️⃣ If link flow, verify code on mount
  useEffect(() => {
    if (mode === 'resetPassword' && oobCode) {
      verifyPasswordResetCode(auth, oobCode)
        .then(emailFromCode => setEmail(emailFromCode))
        .catch(() => setError('Invalid or expired reset link.'));
    }
  }, [mode, oobCode]);

  // 2️⃣ Handle “Send Reset Link” (email form)
  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password?mode=resetPassword`,
      });
      setMessage('Check your inbox for a reset link.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Request failed';
      setError(msg);
    }
  };

  // 3️⃣ Handle “Set New Password” (oob flow)
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!oobCode) {
      setError('Missing reset code.');
      return;
    }
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password updated! Redirecting to login…');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset failed';
      setError(msg);
    }
  };

  // 🔀 UI switch: request link vs. set new password
  if (mode === 'resetPassword' && oobCode) {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Choose a New Password
        </h1>

        <form onSubmit={handleSetPassword} className="w-[350px]">
          <p className="mb-4 text-sm text-gray-700">
            Resetting password for <strong>{email}</strong>
          </p>

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            className="w-full mb-[16px] px-[15px] py-[10px] border rounded-[10px] focus:outline-none"
          />

          {message && <p className="text-green-600 mb-[16px]">{message}</p>}
          {error   && <p className="text-red-500 mb-[16px]">{error}</p>}

          <button
            type="submit"
            className="w-full py-[10px] bg-[#FF6600] text-white rounded-[10px] hover:bg-[#e65500] transition"
          >
            Set Password
          </button>
        </form>
      </div>
    );
  }

  // 📨 Default: request reset link
  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Forgot Your Password?
      </h1>

      <form onSubmit={handleRequestLink} className="w-[350px]">
        <input
          type="email"
          placeholder="Registered email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full mb-[16px] px-[15px] py-[10px] border rounded-[10px] focus:outline-none"
        />

        {message && <p className="text-green-600 mb-[16px]">{message}</p>}
        {error   && <p className="text-red-500 mb-[16px]">{error}</p>}

        <button
          type="submit"
          className="w-full py-[10px] bg-[#FF6600] text-white rounded-[10px] hover:bg-[#e65500] transition"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
