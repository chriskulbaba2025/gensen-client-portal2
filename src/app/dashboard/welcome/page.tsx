'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';

export default function WelcomePage() {
  const [name, setName] = useState<string>('');

  // External apps
  const brandVoiceUrl: string =
    process.env.NEXT_PUBLIC_BRAND_VOICE_URL || '';
  const mapBuilderUrl: string =
    process.env.NEXT_PUBLIC_MAP_BUILDER_URL ||
    'https://gensen-map-builder.vercel.app/';

  // ───────────────────────────────────────────
  // Load profile name
  // ───────────────────────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, 'profiles', uid));
      if (snap.exists()) {
        setName((snap.data() as { name?: string }).name ?? '');
      }
    };
    loadProfile();
  }, []);

  // ───────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center p-[20px] bg-[#F9FAFB] dark:bg-[#111111] text-[#333333] dark:text-[#ECECEC]">
      {/* 1. Greeting */}
      <h1 className="text-[30px] font-semibold mb-[16px] text-center">
        {name ? (
          <>
            Welcome back, <span className="text-[#FF6600]">{name}</span>!
          </>
        ) : (
          'Welcome back!'
        )}
      </h1>

      {/* 2. Title */}
      <h2 className="text-[24px] font-medium text-[#FF6600] mb-[12px] text-center">
        Ship One Thing Today
      </h2>

      {/* 3. Hero Image */}
      <div className="mb-[30px] w-[60%]">
        <Image
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/ship-one-thing-1.webp"
          alt="Ship One Thing"
          width={1200}
          height={720}
          className="w-full h-auto rounded-[12px] shadow"
        />
      </div>

      {/* 4. Micro-Block */}
      <div className="w-full max-w-[600px] bg-white dark:bg-[#1E1E1E] rounded-[12px] shadow p-[20px] mb-[16px] text-center">
        <h3 className="text-[18px] font-semibold mb-[8px]">
          GENSEN&apos;s Latest Pro Tip:
        </h3>
        <p className="text-[16px] mb-[8px]">
          Refactor last month’s pillar post to answer one “why/how” query up top.
        </p>
        <p className="italic text-[14px]">
          *Why now?* AI Overviews own 13% of searches and cut top-rank clicks by
          34%.
        </p>
      </div>

      {/* 5. Subtext */}
      <p className="text-[14px] font-medium mb-[30px]">
        GENSEN’s GENSOLOGY™ instantly crafts that intro for snippet success.
      </p>

      {/* 6. Intro to Steps */}
      <p className="w-full max-w-[600px] text-[16px] mb-[16px]">
        Follow these three steps to go from concept to published article:
      </p>

      {/* 7. Three-step Tiles */}
      <div className="grid grid-cols-3 gap-[16px] w-full max-w-[600px] mb-[30px]">
        {/* Step 1 — Brand Voice */}
        <button
          onClick={() => {
            window.location.href = brandVoiceUrl;
          }}
          className="
            group flex flex-col items-center p-[20px]
            bg-white dark:bg-[#1E1E1E]
            border-[1px] border-black rounded-[12px]
            transition-transform transition-colors transition-shadow
            hover:scale-105 hover:bg-[#7dadfe] hover:border-[#7dadfe]
            hover:shadow-[0_0_10px_rgba(125,173,254,0.5)]
          "
        >
          <div className="bg-white rounded-[8px] p-[8px] mb-[12px]">
            <Image
              src="https://responsegenerators.ca/wp-content/uploads/2025/08/mic-icon.webp"
              alt="Brand Voice Icon"
              width={80}
              height={80}
              loading="lazy"
            />
          </div>
          <h3 className="text-[18px] font-semibold mb-[6px] text-black dark:text-[#ECECEC] group-hover:text-white">
            Step 1 – Generate Your Brand Voice
          </h3>
          <p className="text-[14px] text-center text-black dark:text-[#ECECEC] group-hover:text-white">
            Capture and define your unique brand tone.
          </p>
        </button>

        {/* Step 2 — Topical Map */}
        <button
          onClick={() => {
            window.location.href = mapBuilderUrl;
          }}
          className="
            group flex flex-col items-center p-[20px]
            bg-white dark:bg-[#1E1E1E]
            border-[1px] border-black rounded-[12px]
            transition-transform transition-colors transition-shadow
            hover:scale-105 hover:bg-[#7dadfe] hover:border-[#7dadfe]
            hover:shadow-[0_0_10px_rgba(125,173,254,0.5)]
          "
        >
          <div className="bg-white rounded-[8px] p-[8px] mb-[12px]">
            <Image
              src="https://responsegenerators.ca/wp-content/uploads/2025/08/GENSEN-map-icon.webp"
              alt="Topical Map Icon"
              width={80}
              height={80}
              loading="lazy"
            />
          </div>
          <h3 className="text-[18px] font-semibold mb-[6px] text-black dark:text-[#ECECEC] group-hover:text-white">
            Step 2 – Generate Your Topical Map
          </h3>
          <p className="text-[14px] text-center text-black dark:text-[#ECECEC] group-hover:text-white">
            Outline key topics and cluster related ideas.
          </p>
        </button>

        {/* Step 3 — Content */}
        <button
          onClick={() => {
            window.location.href = '/generate/step-1';
          }}
          className="
            group flex flex-col items-center p-[20px]
            bg-white dark:bg-[#1E1E1E]
            border-[1px] border-black rounded-[12px]
            transition-transform transition-colors transition-shadow
            hover:scale-105 hover:bg-[#7dadfe] hover:border-[#7dadfe]
            hover:shadow-[0_0_10px_rgba(125,173,254,0.5)]
          "
        >
          <div className="bg-white rounded-[8px] p-[8px] mb-[12px]">
            <Image
              src="https://responsegenerators.ca/wp-content/uploads/2025/08/GENSEN-document-icon.webp"
              alt="Generate Article Icon"
              width={80}
              height={80}
              loading="lazy"
            />
          </div>
          <h3 className="text-[18px] font-semibold mb-[6px] text-black dark:text-[#ECECEC] group-hover:text-white">
            Step 3 – Generate Your Content
          </h3>
          <p className="text-[14px] text-center text-black dark:text-[#ECECEC] group-hover:text-white">
            Produce ready-to-edit draft articles, socials, emails, and more.
          </p>
        </button>
      </div>

      {/* 8. GENSOLOGY™ Dropdown */}
      <details className="w-full max-w-[600px] bg-[#F3F4F6] dark:bg-[#1A1A1A] rounded-[8px] p-[16px] mb-[30px]">
        <summary className="cursor-pointer text-[16px] font-medium text-[#FF6600]">
          What is GENSOLOGY™?
        </summary>
        <p className="mt-[8px] text-[14px] leading-snug text-[#333333] dark:text-[#ECECEC]">
          GENSOLOGY™ is our trademarked methodology—the study and practice of
          AI-driven content creation—guiding you step-by-step from ideation to
          AI-optimized assets. It’s the “-ology” behind every feature, ensuring
          you ship one high-impact deliverable each session.
        </p>
      </details>

      {/* 9. Bottom Action Button */}
      <button
        onClick={() => {
          window.location.href = '/dashboard';
        }}
        className="
          px-[20px] py-[12px]
          bg-white text-black border border-black
          rounded-[8px] font-medium
          hover:bg-[#FF6600] hover:text-white hover:border-transparent
          transition
        "
      >
        Go to Dashboard
      </button>
    </div>
  );
}
