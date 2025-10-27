'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import BrandVoiceTile from '@/components/BrandVoiceTile'; // new component import

export default function WelcomePage() {
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (!parsed.email) return;

      fetch('/api/get-brand-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.found && data.name) {
            const proper =
              data.name.charAt(0).toUpperCase() +
              data.name.slice(1).toLowerCase();
            setName(proper);
          } else {
            const localPart = parsed.email.split('@')[0];
            const proper =
              localPart.charAt(0).toUpperCase() +
              localPart.slice(1).toLowerCase();
            setName(proper);
          }
        })
        .catch(() => {
          const localPart = parsed.email.split('@')[0];
          const proper =
            localPart.charAt(0).toUpperCase() +
            localPart.slice(1).toLowerCase();
          setName(proper);
        });
    } catch {
      localStorage.removeItem('user');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-[40px] bg-[#F9FAFB] text-[#10284a]">
      <h1 className="text-[32px] font-bold mb-[10px] text-center">
        {name ? `Welcome back, ${name}!` : 'Welcome back, creator!'}
      </h1>

      <h2 className="text-[24px] font-semibold mb-[30px] text-center text-[#0aa2fb]">
        Ship One Thing Today
      </h2>

      <div className="mb-[40px] w-full max-w-[700px]">
        <Image
          src="https://omnipressence.com/wp-content/uploads/2025/10/welcome_banner.webp"
          alt="Ship One Thing Banner"
          width={1200}
          height={600}
          className="w-full h-auto rounded-[15px] shadow"
        />
      </div>

      {/* --- DASHBOARD TILES --- */}
      <div className="grid grid-cols-3 gap-[30px] max-w-[1000px] w-full text-[20px]">
        {/* 1 — Brand Voice */}
        <BrandVoiceTile />

        {/* 2 — Topical Map */}
        <button
          onClick={() =>
            (window.location.href = 'https://gensen-map-builder.vercel.app/')
          }
          className="group flex flex-col items-center p-[25px] bg-white border border-[#0aa2fb] rounded-[15px] hover:bg-[#0aa2fb] hover:text-white hover:shadow-[0_0_15px_rgba(10,162,251,0.6)] transition-all"
        >
          <Image
            src="https://omnipressence.com/wp-content/uploads/2025/10/map_main.png"
            alt="Topical Map Icon"
            width={150}
            height={150}
            className="rounded-[15px] mb-[20px] object-contain"
          />
          <h3 className="font-semibold mb-[10px] group-hover:text-white text-center">
            Topical Map
          </h3>
          <p className="text-center leading-snug group-hover:text-white">
            Outline key topics and cluster related ideas.
          </p>
        </button>

        {/* 3 — Articles */}
        <button
          onClick={() => (window.location.href = '/generate/step-1')}
          className="group flex flex-col items-center p-[25px] bg-white border border-[#0aa2fb] rounded-[15px] hover:bg-[#0aa2fb] hover:text-white hover:shadow-[0_0_15px_rgba(10,162,251,0.6)] transition-all"
        >
          <Image
            src="https://responsegenerators.ca/wp-content/uploads/2025/07/quill.png"
            alt="Articles Icon"
            width={150}
            height={150}
            className="rounded-[15px] mb-[20px] object-contain"
          />
          <h3 className="font-semibold mb-[10px] group-hover:text-white text-center">
            Articles
          </h3>
          <p className="text-center leading-snug group-hover:text-white">
            Produce ready-to-edit articles, social posts, and emails.
          </p>
        </button>

        {/* 4 — Facebook */}
        <button
          onClick={() => (window.location.href = '/dashboard/facebook')}
          className="group flex flex-col items-center p-[25px] bg-white border border-[#0aa2fb] rounded-[15px] hover:bg-[#0aa2fb] hover:text-white hover:shadow-[0_0_15px_rgba(10,162,251,0.6)] transition-all"
        >
          <Image
            src="https://omnipressence.com/wp-content/uploads/2025/10/facebook_main.png"
            alt="Facebook Icon"
            width={150}
            height={150}
            className="rounded-[15px] mb-[20px] object-contain"
          />
          <h3 className="font-semibold mb-[10px] group-hover:text-white text-center">
            Facebook Updates
          </h3>
          <p className="text-center leading-snug group-hover:text-white">
            Auto-generate and schedule posts for your brand.
          </p>
        </button>
      </div>

      <button
        onClick={() => (window.location.href = '/dashboard')}
        className="mt-[60px] px-[28px] py-[16px] text-[20px] bg-[#0aa2fb] text-white rounded-[12px] hover:bg-[#088de3] transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
