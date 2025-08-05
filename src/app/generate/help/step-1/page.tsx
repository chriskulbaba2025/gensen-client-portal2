'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HelpKeywordAudience() {
  const router = useRouter();

  return (
    <div className="min-h-screen px-[40px] py-[60px] text-center text-black dark:text-white font-[Raleway] text-[20px]">
      <h1 className="text-[24px] font-semibold mb-[30px]">Keyword and Audience – Strategic Suggestions</h1>

      <div className="flex justify-center mb-[30px]">
        <Image
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="Gensen Logo"
          width={250}
          height={250}
        />
      </div>

      <div className="max-w-[700px] mx-auto space-y-[24px] leading-[32px]">
        <p>In the first field, input the website address for your own business.</p>
        <p>In the second field, input the name of your competition that you are looking to outrank.</p>
        <p>
          After you choose submit, GENSEN will analyze both sites in real time, and look for gaps in content that you
          can add to your site to gain experience, authority, expertise, and to create trust. The system is designed to
          choose standard length for this article as it will be acting as a spoke instead of a hub content item.
        </p>
        <p>
          Your audience wants answers to their questions – GENSEN helps determine what they are asking, and who is
          asking the questions, allowing you to further strategize your topical map to gain traffic.
        </p>

        <div className="text-left mt-[40px] space-y-[20px]">
          <div>
            <label htmlFor="your-site" className="block font-semibold mb-[8px]">Your Website</label>
            <input
              type="url"
              id="your-site"
              placeholder="https://examplesite.ca"
              className="w-full border border-gray-300 rounded-[8px] px-[16px] py-[10px] text-[18px]"
            />
          </div>
          <div>
            <label htmlFor="competitor-site" className="block font-semibold mb-[8px]">Competitor Website</label>
            <input
              type="url"
              id="competitor-site"
              placeholder="https://examplesite.ca"
              className="w-full border border-gray-300 rounded-[8px] px-[16px] py-[10px] text-[18px]"
            />
          </div>
        </div>

        <div className="flex justify-center gap-[20px] mt-[40px]">
          <button
            onClick={() => router.push('/generate/step-1')}
            className="bg-white text-black border border-[#f66630] hover:bg-[#f66630] hover:text-white px-[24px] py-[12px] rounded-[10px] transition hover:scale-105"
          >
            BACK
          </button>
          <button
            onClick={() => alert('Submitted for analysis.')}
            className="bg-[#f66630] text-white px-[24px] py-[12px] rounded-[10px] transition hover:scale-105"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
