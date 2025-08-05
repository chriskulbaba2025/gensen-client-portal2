'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGeneratorStore } from '@/lib/store';
import Image from 'next/image';

export default function GenerateStep2() {
  const router = useRouter();

  // ✅ Fix: properly destructure audience from the store
  const { internalLinks, setInternalLinks, audience } = useGeneratorStore();

  return (
    <div className="min-h-screen px-[40px] py-[60px] text-black dark:text-white text-center">
      <h1 className="text-[24px] font-semibold mb-[10px]">
        Content Generation – Step 2 of 2
      </h1>
      <p className="text-[18px] mb-[30px]">Internal Links</p>

      <div className="flex justify-center mb-[30px]">
        <Image
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="Gensen Logo"
          width={250}
          height={100}
          className="h-auto"
        />
      </div>

      <div className="max-w-[700px] mx-auto space-y-[20px] text-[16px]">
        <p>
          Add up to 5 internal links that will be inserted into your article with contextual anchor links (they are descriptive and make sense to the reader, instead of just inserting a link).
        </p>
        <p>
          Remember, this is where the support to your article happens, with internal links pointing back to areas you want the reader and search engines to visit that relate to your article.
        </p>
        <p>
          These are the “spokes” for your hub and spoke model.
        </p>
      </div>

      <div className="mt-[40px] max-w-[600px] mx-auto space-y-[20px]">
        {internalLinks.map((value, index) => (
          <div key={index} className="flex items-center gap-[10px]">
            <label className="w-[120px] text-left">Internal Link #{index + 1}</label>
            <input
              type="url"
              placeholder="https://examplesite.ca"
              className="w-full px-[12px] py-[8px] rounded-[10px] border border-gray-300 text-black placeholder:text-[14px] placeholder:font-normal placeholder:font-[Raleway]"
              value={value}
              onChange={(e) => {
                const newLinks = [...internalLinks];
                newLinks[index] = e.target.value;
                setInternalLinks(newLinks);
              }}
            />
            <span className="text-[#f66630]">🔗</span>
          </div>
        ))}
      </div>

      {/* ✅ This now works: audience is defined above */}
      <div className="mt-[20px] text-left max-w-[600px] mx-auto">
        <p className="font-bold underline mb-[6px]">Generated Audience</p>
        <div className="italic text-gray-500">{audience || '“{audience appears here}”'}</div>
      </div>

      <div className="mt-[50px] flex justify-center gap-[20px]">
        <button
          className="bg-white text-black hover:bg-[#f66630] hover:text-white px-[20px] py-[10px] rounded-[10px] hover:scale-105 transition"
          onClick={() => router.push('/generate/step-1')}
        >
          Back
        </button>
        <button
          className="bg-white text-black hover:bg-[#f66630] hover:text-white px-[20px] py-[10px] rounded-[10px] hover:scale-105 transition"
          onClick={() => router.push('/summarize-submit')}
        >
          Next
        </button>
      </div>
    </div>
  );
}
