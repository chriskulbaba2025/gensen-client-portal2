'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ClientSignupPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setMessage('');

    try {
      const res = await fetch('/api/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus('done');
        setMessage(
          `An invitation has been sent to ${email}. Please check your inbox to complete your account setup.`
        );
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to send invitation.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Request failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f9fc] text-[#0b1320] px-[20px]">
      {/* Logo */}
      <div className="mb-[24px]">
        <Image
          src="https://omnipressence.com/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="GENSEN Logo"
          width={220}
          height={70}
          className="mx-auto"
        />
      </div>

      {/* Card */}
      <div className="bg-white rounded-[16px] shadow-md border border-[#e0e6f5] w-full max-w-[420px] p-[36px] text-center">
        <h1 className="text-[26px] font-semibold text-[#10284a] mb-[14px]">
          Create Your GENSEN Client Account
        </h1>
        <p className="text-[15px] text-[#0b1320] mb-[28px] leading-relaxed">
          Welcome to GENSEN. This page allows you to create your client profile and
          access your personalized brand systems. Enter your email below and our
          platform will generate your secure Cognito account. You will receive an
          email with a link to set your password and activate your dashboard access.
        </p>

        <form onSubmit={handleSubmit} className="space-y-[16px]">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full border border-[#cbd5e1] rounded-[8px] px-[14px] py-[10px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#076aff]"
          />

          <button
            type="submit"
            disabled={status === 'sending'}
            className={`w-full py-[10px] rounded-[8px] font-medium text-white transition-all ${
              status === 'sending'
                ? 'bg-[#9bb9ff] cursor-not-allowed'
                : 'bg-[#076aff] hover:bg-[#002c71]'
            }`}
          >
            {status === 'sending' ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-[20px] text-[15px] ${
              status === 'error' ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Footer */}
      <p className="text-[13px] text-[#666] mt-[24px]">
        Secure signup powered by AWS Cognito · © 2025 GENSEN
      </p>
    </div>
  );
}
