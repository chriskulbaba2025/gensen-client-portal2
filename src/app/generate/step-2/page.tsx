'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGeneratorStore } from '@/lib/store';
import Image from 'next/image';

export default function GenerateStep2() {
  const router = useRouter();
  const { internalLinks, setInternalLinks, audience } = useGeneratorStore();

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
          Content Generation – Step 2 of 2
        </h1>
        <p className="text-[18px] text-[#333]">
          Add your internal links to boost SEO and context.
        </p>
      </div>

      {/* Instruction Card */}
      <div className="max-w-[700px] text-center bg-white shadow-md rounded-[15px] px-[30px] py-[25px] mb-[40px] border border-[#e0e6f5]">
        <p className="text-[20px] text-[#002c71] leading-relaxed">
          Add up to five internal links to strengthen your hub and spoke model; each link connects your readers toward related, high-value topics.
        </p>
        <p className="text-[20px] text-[#002c71] leading-relaxed mt-[15px]">
          These links connect your content ecosystem, turning single articles into a network that reinforces authority and relevance.
        </p>
        <p className="text-[20px] text-[#002c71] leading-relaxed mt-[15px]">
          Every spoke you add helps your audience and search engines see the bigger strategy behind your brand.
        </p>
      </div>

      {/* Link Inputs */}
      <div className="w-full max-w-[750px] bg-white rounded-[20px] shadow-md p-[45px] space-y-[25px] border border-[#e0e6f5]">
        {internalLinks.map((value, index) => (
          <div key={index}>
            <label className="block mb-[8px] font-semibold text-[22px] text-[#002c71]">
              Internal Link #{index + 1}
            </label>
            <input
              type="url"
              placeholder="https://examplesite.ca"
              className="w-full px-[16px] py-[14px] rounded-[12px] border border-[#ccd6ee] focus:border-[#076aff] focus:ring-[#076aff] focus:ring-1 outline-none text-[18px] text-[#0a0a0a] font-raleway bg-[#f9fbff] transition-all"
              value={value}
              onChange={(e) => {
                const newLinks = [...internalLinks];
                newLinks[index] = e.target.value;
                setInternalLinks(newLinks);
              }}
            />
          </div>
        ))}
      </div>

      {/* Audience Preview */}
      <div className="mt-[40px] text-left max-w-[750px] bg-white rounded-[20px] shadow-md p-[25px] border border-[#e0e6f5]">
        <p className="font-semibold text-[22px] text-[#002c71] mb-[10px]">
          Generated Audience
        </p>
        <div className="italic text-[#333] bg-[#f9fbff] border border-[#e0e6f5] rounded-[12px] p-[16px]">
          {audience || 'Your audience profile will appear here after Step 1.'}
        </div>
      </div>

      {/* Navigation */}
      <div className="text-center pt-[40px] flex gap-[20px]">
        <button
          onClick={() => router.push('/generate/step-1')}
          className="bg-white border border-[#076aff] text-[#076aff] px-[36px] py-[14px] rounded-[12px] text-[18px] font-semibold shadow-md hover:bg-[#076aff] hover:text-white transition-transform hover:scale-105"
        >
          Back
        </button>
        <button
          onClick={() => router.push('/summarize-submit')}
          className="bg-[#076aff] hover:bg-[#004fc7] text-white px-[36px] py-[14px] rounded-[12px] text-[18px] font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-105"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
