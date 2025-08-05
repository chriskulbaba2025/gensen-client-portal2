'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGeneratorStore } from '@/lib/store';

export default function GenerateStep1() {
  const store = useGeneratorStore();
  const { keywords, setKeywords, audience, setAudience, length, setLength } = store;

  return (
    <div className="min-h-screen px-[40px] py-[60px] text-black">
      <div className="text-center mb-[40px]">
        <h1 className="text-[24px] font-semibold mb-[10px]">
          Content Generation – Step 1 of 2
        </h1>
        <p className="text-[18px]">
          Keywords, Audience, and Article Length
        </p>
      </div>

      <div className="flex justify-center">
        <Image
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="Gensen Logo"
          width={250}
          height={100}
          className="h-auto mb-[40px]"
        />
      </div>

      <div className="max-w-[600px] mx-auto space-y-[30px] text-center">
        <div>
          <label className="block mb-[8px] font-medium text-[16px]">
            Keyword Field – long tail and specific keyword phrases are the best options for SEO (Search Engine Optimization) and GEO (Generative Engine Optimization)
          </label>
          <input
            type="text"
            placeholder="e.g. AI content for dentists near me, local SEO writing for coaches, writing transactional emails, etc."
            className="w-full px-[12px] py-[8px] rounded-[10px] border border-gray-300 text-black"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-[8px] font-medium text-[16px] text-center">
            Audience Field – describe your reader with clear, simple details like their job title, industry, goals, or challenges. The more clearly you paint the picture, the better we can tailor the tone and messaging to match.
          </label>
          <textarea
            rows={5}
            placeholder="eg. Marketing agencies or white-label service providers who manage multiple small business or high-ticket clients — and need to produce SEO-rich, conversion-ready articles in minutes, not hours. These users prioritize speed, scale, and content that drives real action: leads, bookings, and purchases. Their content must be branded, persuasive, and optimized for strong calls-to-action and buyer intent — without sacrificing quality or tone."
            className="w-full px-[12px] py-[8px] rounded-[10px] border border-gray-300 text-black resize-y overflow-y-auto placeholder:text-[14px] placeholder:font-normal placeholder:font-[Raleway]"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-[12px]">
          <button
            className={`w-full px-[12px] py-[10px] rounded-[10px] shadow ${
              length === 'standard' ? 'bg-[#f66630] text-white' : 'bg-orange-100 text-[#f66630]'
            }`}
            onClick={() => setLength('standard')}
          >
            Standard Length – 2000-2500 words – click to select
          </button>
          <button
            className={`w-full px-[12px] py-[10px] rounded-[10px] shadow ${
              length === 'pillar' ? 'bg-[#f66630] text-white' : 'bg-orange-100 text-[#f66630]'
            }`}
            onClick={() => setLength('pillar')}
          >
            Pillar Content – 2300-3000 words – click to select
          </button>
        </div>

        <div className="text-center">
          <a
            href="#"
            className="text-[14px] hover:text-[#f66630] hover:underline transition"
          >
            Need help with keyword + audience?
          </a>
        </div>

        <div className="text-center mt-[20px]">
          <Link href="/generate/step-2">
            <button
              className="bg-white text-black hover:bg-[#f66630] hover:text-white px-[20px] py-[10px] rounded-[10px] hover:scale-105 transition"
            >
              Next Step
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
