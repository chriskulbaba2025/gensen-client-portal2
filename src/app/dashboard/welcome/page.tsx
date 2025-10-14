'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function WelcomePage() {
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (!parsed.email) return;

      // 🔹 Fetch name from Airtable
      fetch('/api/get-brand-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.found && data.name) {
            // Convert to sentence case
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
      {/* Greeting */}
      <h1 className="text-[32px] font-bold mb-[10px] text-center">
        {name ? `Welcome back, ${name}!` : 'Welcome back, creator!'}
      </h1>

      <h2 className="text-[24px] font-semibold mb-[30px] text-center text-[#0aa2fb]">
        Ship One Thing Today
      </h2>

      {/* Hero Banner */}
      <div className="mb-[40px] w-full max-w-[700px]">
        <Image
          src="https://omnipressence.com/wp-content/uploads/2025/10/welcome_banner.webp"
          alt="Ship One Thing Banner"
          width={1200}
          height={600}
          className="w-full h-auto rounded-[15px] shadow"
        />
      </div>

      {/* GENSEN Tip */}
      <div className="w-full max-w-[700px] bg-white rounded-[15px] shadow p-[25px] mb-[30px] text-center">
        <h3 className="text-[22px] font-semibold mb-[10px] text-[#0aa2fb]">
          GENSEN’s Latest Pro Tip
        </h3>
        <p className="text-[18px] mb-[8px]">
          Refactor last month’s pillar post to answer one “why” or “how” query
          right up top.
        </p>
        <p className="italic text-[16px] text-[#444]">
          *Why now?* AI Overviews own 13% of searches and cut top-rank clicks by
          34%.
        </p>
      </div>

      {/* Section Intro */}
      <p className="text-[20px] font-medium mb-[40px] text-center max-w-[700px]">
        GENSEN’s GENSOLOGY™ instantly crafts intros built for snippet success.
        Follow these three steps to go from concept to published content:
      </p>

      {/* Three Steps */}
      <div className="grid grid-cols-3 gap-[30px] max-w-[1000px] w-full text-[20px]">
        {/* Step 1 — Brand Voice */}
        <button
          onClick={() =>
            (window.location.href =
              'https://gensen-v2-voice.vercel.app/')
          }
          className="group flex flex-col items-center p-[25px] bg-white border border-[#0aa2fb] rounded-[15px] hover:bg-[#0aa2fb] hover:text-white hover:shadow-[0_0_15px_rgba(10,162,251,0.6)] transition-all"
        >
          <Image
            src="https://omnipressence.com/wp-content/uploads/2025/10/voice_main.png"
            alt="Brand Voice Icon"
            width={150}
            height={150}
            className="rounded-[15px] mb-[20px] object-contain"
          />
          <h3 className="font-semibold mb-[10px] group-hover:text-white text-center">
            Step 1 – Generate Your Brand Voice
          </h3>
          <p className="text-center leading-snug group-hover:text-white">
            Capture and define your unique brand tone.
          </p>
        </button>

        {/* Step 2 — Topical Map */}
        <button
          onClick={() =>
            (window.location.href =
              'https://gensen-map-builder.vercel.app/')
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
            Step 2 – Generate Your Topical Map
          </h3>
          <p className="text-center leading-snug group-hover:text-white">
            Outline key topics and cluster related ideas.
          </p>
        </button>

        {/* Step 3 — Content Generator */}
        <button
          onClick={() => (window.location.href = '/generate/step-1')}
          className="group flex flex-col items-center p-[25px] bg-white border border-[#0aa2fb] rounded-[15px] hover:bg-[#0aa2fb] hover:text-white hover:shadow-[0_0_15px_rgba(10,162,251,0.6)] transition-all"
        >
          <Image
            src="https://omnipressence.com/wp-content/uploads/2025/10/main_doc.png"
            alt="Content Generator Icon"
            width={150}
            height={150}
            className="rounded-[15px] mb-[20px] object-contain"
          />
          <h3 className="font-semibold mb-[10px] group-hover:text-white text-center">
            Step 3 – Generate Your Content
          </h3>
          <p className="text-center leading-snug group-hover:text-white">
            Produce ready-to-edit articles, social posts, and emails.
          </p>
        </button>
      </div>

      {/* GENSOLOGY™ Dropdown */}
      <details className="mt-[50px] w-full max-w-[700px] bg-[#F3F4F6] rounded-[12px] p-[20px] text-[18px]">
        <summary className="cursor-pointer font-semibold text-[#0aa2fb]">
          What is GENSOLOGY™?
        </summary>
        <p className="mt-[10px] leading-snug">
          GENSOLOGY™ is our proprietary methodology—the study and practice of
          AI-driven content creation—guiding you step-by-step from ideation to
          optimized assets. It ensures each session ships one high-impact
          deliverable with clarity and consistency.
        </p>
      </details>

      {/* CTA Button */}
      <button
        onClick={() => (window.location.href = '/dashboard')}
        className="mt-[50px] px-[28px] py-[16px] text-[20px] bg-[#0aa2fb] text-white rounded-[12px] hover:bg-[#088de3] transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
