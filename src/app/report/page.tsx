'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ReportPage() {
  const [timeLeft, setTimeLeft] = useState(240);
  const [html, setHtml] = useState<string | null>(null);
  const [status, setStatus] = useState<'auth' | 'loading' | 'done' | 'error'>('auth');

  // Step 1: verify Cognito session cookie
  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith('gensen_session='));
    if (!tokenCookie) {
      window.location.href = '/login';
      return;
    }

    const token = tokenCookie.split('=')[1];
    setStatus('loading');

    // Step 2: countdown timer
    const timer = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);

    // Step 3: call n8n webhook with AWS token
    fetch('https://primary-production-77e7.up.railway.app/webhook/brand-voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setHtml(data.html);
        setStatus('done');
        clearInterval(timer);
      })
      .catch(() => {
        setStatus('error');
        clearInterval(timer);
      });

    return () => clearInterval(timer);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f5f8ff] text-[#0a0a0a] px-[40px] py-[60px] font-raleway flex flex-col items-center">
        {/* Logo */}
        <div className="flex justify-center mb-[30px]">
          <div className="bg-white p-[10px] rounded-[15px] shadow-md">
            <Image
              src="https://omnipressence.com/wp-content/uploads/2025/09/Gensen-Logo-Final-version-lower-case-logo-and-spaces1-356x295-1.webp"
              alt="Gensen Logo"
              width={250}
              height={100}
              className="rounded-[15px] object-contain"
              priority
            />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-[40px]">
          <h1 className="text-[34px] font-semibold mb-[8px] text-[#002c71]">
            Building Your Unified Brand Voice Report
          </h1>
          <p className="text-[18px] text-[#333]">
            Please wait while we process your data. This takes about 4 minutes.
          </p>
        </div>

        {/* Information Card */}
        <div className="max-w-[700px] text-center bg-white shadow-md rounded-[15px] px-[30px] py-[25px] mb-[40px] border border-[#e0e6f5]">
          <p className="text-[20px] text-[#002c71] leading-relaxed">
            <strong>What:</strong> Your complete Brand Voice framework.
          </p>
          <p className="text-[20px] text-[#002c71] leading-relaxed mt-[10px]">
            <strong>Why:</strong> To unify tone and structure across all communication.
          </p>
          <p className="text-[20px] text-[#002c71] leading-relaxed mt-[10px]">
            <strong>Where:</strong> Use it on your website, emails, and social media.
          </p>
          <p className="text-[20px] text-[#002c71] leading-relaxed mt-[10px]">
            <strong>When:</strong> During brand creation, content review, or campaign launches.
          </p>
          <p className="text-[20px] text-[#002c71] leading-relaxed mt-[10px]">
            <strong>Who:</strong> Writers, strategists, and leadership teams ensuring consistency.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[600px] bg-gray-200 h-3 rounded">
          <div
            className="bg-[#076aff] h-3 rounded transition-all"
            style={{ width: `${((240 - timeLeft) / 240) * 100}%` }}
          ></div>
        </div>
        <p className="mt-[10px] text-[16px] text-[#333]">
          Estimated time remaining: {timeLeft}s
        </p>
      </div>
    );
  }

  if (status === 'done' && html) {
    return (
      <div className="min-h-screen bg-[#f5f8ff] text-[#0a0a0a] px-[20px] py-[40px] font-raleway flex flex-col items-center">
        <div className="bg-white rounded-[15px] shadow-md p-[20px] max-w-[950px] w-full border border-[#e0e6f5]">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f8ff] text-red-600 font-raleway">
        Failed to load report. Please try again.
      </div>
    );
  }

  return null;
}
