'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGeneratorStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function GenerateStep1() {
  const router = useRouter();
  const store = useGeneratorStore();
  const {
    keywords,
    setKeywords,
    icp,
    setIcp,
    audience,
    setAudience,
    brandStatement,
    setBrandStatement,
  } = store;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email) {
      setLoading(false);
      return;
    }

    fetch('/api/get-brand-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.found) {
          setAudience(data.audience || '');
          setIcp(data.icp || '');
          setBrandStatement(data.brandStatement || '');
        }
      })
      .catch((err) => console.error('Airtable fetch failed:', err))
      .finally(() => setLoading(false));
  }, [setAudience, setIcp, setBrandStatement]);

  const handleNext = () => {
    if (!keywords.trim()) {
      setError('Please enter a keyword before continuing.');
      return;
    }
    setError('');
    router.push('/generate/step-2');
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f8ff] text-[#002c71] font-raleway text-[22px]">
        Building your brand voice profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-[#0a0a0a] px-[40px] py-[60px] font-raleway flex flex-col items-center">
      {/* Logo */}
      <div className="flex justify-center mb-[30px]">
        <div className="bg-white p-[10px] rounded-[15px] shadow-md">
          <Image
            key={Date.now()}
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
<<<<<<< HEAD
        <h1 className="text-[34px] font-semibold mb-[8px] text-[#002c71]">
          Content Generation – Step 1 of 2
=======
        <h1 className="text-[24px] font-semibold mb-[10px]">
          Content Generation â€“ Step 1 of 2
>>>>>>> 79875a4 (Update Navbar and tiles to link to brand voice)
        </h1>
        <p className="text-[18px] text-[#333]">
          Define your focus and refine your brand tone.
        </p>
      </div>

<<<<<<< HEAD
      {/* Welcome Message */}
      <div className="max-w-[700px] text-center bg-white shadow-md rounded-[15px] px-[30px] py-[25px] mb-[40px] border border-[#e0e6f5]">
        <p className="text-[22px] text-[#002c71] leading-relaxed">
          Welcome back — your brand foundation is already fully set up.
        </p>
        <p className="text-[22px] text-[#002c71] leading-relaxed mt-[15px]">
          We’ve preloaded your audience, ICP, and brand statement directly from your voice profile.
        </p>
        <p className="text-[22px] text-[#002c71] leading-relaxed mt-[15px]">
          You can edit each field below to fine-tune your next piece of content before generation.
        </p>
=======
      <div className="flex justify-center">
        <Image
          src="https://omnipressence.com/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="Gensen Logo"
          width={250}
          height={100}
          className="h-auto mb-[40px]"
        />
>>>>>>> 79875a4 (Update Navbar and tiles to link to brand voice)
      </div>

      {/* Form Section */}
      <div className="w-full max-w-[750px] bg-white rounded-[20px] shadow-md p-[45px] space-y-[25px] border border-[#e0e6f5]">
        {/* Keyword */}
        <div>
<<<<<<< HEAD
          <label className="block mb-[8px] font-semibold text-[25px] text-[#002c71]">
            Keyword <span className="text-red-600">*</span>
=======
          <label className="block mb-[8px] font-medium text-[16px]">
            Keyword Field â€“ long tail and specific keyword phrases are the best options for SEO (Search Engine Optimization) and GEO (Generative Engine Optimization)
>>>>>>> 79875a4 (Update Navbar and tiles to link to brand voice)
          </label>
          <input
            type="text"
            placeholder="e.g. How can small teams use AI to rank faster on Google?"
            className={`w-full px-[16px] py-[14px] rounded-[12px] border ${
              error ? 'border-red-500' : 'border-[#ccd6ee]'
            } focus:border-[#076aff] focus:ring-[#076aff] focus:ring-1 outline-none text-[18px] text-[#0a0a0a] font-raleway bg-[#f9fbff] transition-all`}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          {error && (
            <p className="text-red-600 text-[16px] mt-[6px]">{error}</p>
          )}
        </div>

        {/* ICP */}
        <div>
<<<<<<< HEAD
          <label className="block mb-[8px] font-semibold text-[25px] text-[#002c71]">
            ICP (Ideal Customer Profile)
          </label>
          <textarea
            rows={4}
            placeholder="Describe your perfect-fit customer — their role, goals, and challenges."
            className="w-full px-[16px] py-[14px] rounded-[12px] border border-[#ccd6ee] focus:border-[#076aff] focus:ring-[#076aff] focus:ring-1 outline-none text-[18px] text-[#0a0a0a] font-raleway bg-[#f9fbff] transition-all resize-none"
            value={icp}
            onChange={(e) => setIcp(e.target.value)}
          />
        </div>

        {/* Audience */}
        <div>
          <label className="block mb-[8px] font-semibold text-[25px] text-[#002c71]">
            Audience
          </label>
          <textarea
            rows={4}
            placeholder="Explain who will read this — their industry, experience level, and what they care about most."
            className="w-full px-[16px] py-[14px] rounded-[12px] border border-[#ccd6ee] focus:border-[#076aff] focus:ring-[#076aff] focus:ring-1 outline-none text-[18px] text-[#0a0a0a] font-raleway bg-[#f9fbff] transition-all resize-none"
=======
          <label className="block mb-[8px] font-medium text-[16px] text-center">
            Audience Field â€“ describe your reader with clear, simple details like their job title, industry, goals, or challenges. The more clearly you paint the picture, the better we can tailor the tone and messaging to match.
          </label>
          <textarea
            rows={5}
            placeholder="eg. Marketing agencies or white-label service providers who manage multiple small business or high-ticket clients â€” and need to produce SEO-rich, conversion-ready articles in minutes, not hours. These users prioritize speed, scale, and content that drives real action: leads, bookings, and purchases. Their content must be branded, persuasive, and optimized for strong calls-to-action and buyer intent â€” without sacrificing quality or tone."
            className="w-full px-[12px] py-[8px] rounded-[10px] border border-gray-300 text-black resize-y overflow-y-auto placeholder:text-[14px] placeholder:font-normal placeholder:font-[Raleway]"
>>>>>>> 79875a4 (Update Navbar and tiles to link to brand voice)
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </div>

<<<<<<< HEAD
        {/* Brand Statement */}
        <div>
          <label className="block mb-[8px] font-semibold text-[25px] text-[#002c71]">
            Brand Statement
          </label>
          <textarea
            rows={4}
            placeholder="Summarize your brand’s mission, tone, and what makes it stand out."
            className="w-full px-[16px] py-[14px] rounded-[12px] border border-[#ccd6ee] focus:border-[#076aff] focus:ring-[#076aff] focus:ring-1 outline-none text-[18px] text-[#0a0a0a] font-raleway bg-[#f9fbff] transition-all resize-none"
            value={brandStatement}
            onChange={(e) => setBrandStatement(e.target.value)}
          />
=======
        <div className="flex flex-col gap-[12px]">
          <button
            className={`w-full px-[12px] py-[10px] rounded-[10px] shadow ${
              length === 'standard' ? 'bg-[#f66630] text-white' : 'bg-orange-100 text-[#f66630]'
            }`}
            onClick={() => setLength('standard')}
          >
            Standard Length â€“ 2000-2500 words â€“ click to select
          </button>
          <button
            className={`w-full px-[12px] py-[10px] rounded-[10px] shadow ${
              length === 'pillar' ? 'bg-[#f66630] text-white' : 'bg-orange-100 text-[#f66630]'
            }`}
            onClick={() => setLength('pillar')}
          >
            Pillar Content â€“ 2300-3000 words â€“ click to select
          </button>
>>>>>>> 79875a4 (Update Navbar and tiles to link to brand voice)
        </div>

        {/* Button */}
        <div className="text-center pt-[25px]">
          <button
            onClick={handleNext}
            className="bg-[#076aff] hover:bg-[#004fc7] text-white px-[36px] py-[16px] rounded-[12px] text-[18px] font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-105 font-raleway"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}

