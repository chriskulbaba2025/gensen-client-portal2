'use client';

import { useRouter } from 'next/navigation';
import { useGeneratorStore } from '@/lib/store';
import clsx from 'clsx';
import Image from 'next/image';

export default function SummarizeSubmit() {
  const router = useRouter();
  const {
    keywords,
    audience,
    length,
    internalLinks,
    intent,
    setIntent,
    setLength,
  } = useGeneratorStore();

  // ───────────────────────────────────────────────
  // Submit handler
  // ───────────────────────────────────────────────
  const handleSubmit = async () => {
    const payload = {
      keywords,
      audience,
      length,
      intent,
      internalLinks: internalLinks.filter((link) => link.trim() !== ''),
    };

    try {
      const response = await fetch(
        'https://primary-production-77e7.up.railway.app/webhook/efb68c51-45b7-4d44-86f4-d24774272133',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error('n8n webhook returned an error');
      alert('Submitted to GENSEN successfully!');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('[GENSEN SUBMIT ERROR]', errorMessage);
      alert('Submission failed. Please try again.');
    }
  };

  // ───────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────
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
          Summarize and Submit
        </h1>
        <p className="text-[18px] text-[#333]">
          Review your selections before generating your article.
        </p>
      </div>

      {/* Summary Card */}
      <div className="text-left w-full max-w-[750px] bg-white rounded-[20px] shadow-md p-[45px] border border-[#e0e6f5] text-[18px] leading-[28px]">
        <div>
          <strong className="text-[#076aff]">Keyword:</strong>
          <p className="mt-[6px]">{keywords || '—'}</p>
        </div>

        <div className="mt-[20px]">
          <strong className="text-[#076aff]">Audience:</strong>
          <p className="mt-[6px]">{audience || '—'}</p>
        </div>

        {/* Length Selector */}
        <div className="mt-[40px] text-center">
          <p className="text-[22px] font-semibold mb-[16px] text-[#002c71]">
            Choose Article Length
          </p>
          <p className="text-[18px] text-[#333] mb-[20px]">
            Length influences the depth of research and detail. Select based on your campaign goals.
          </p>
          <div className="flex justify-center gap-[12px]">
            <button
              className={clsx(
                'px-[20px] py-[10px] rounded-[10px] border border-[#076aff] transition-transform duration-200 hover:scale-105',
                length === 'standard'
                  ? 'bg-[#076aff] text-white'
                  : 'bg-[#f9fbff] text-[#002c71]'
              )}
              onClick={() => setLength('standard')}
            >
              Normal (2200–2500 words)
            </button>

            <button
              className={clsx(
                'px-[20px] py-[10px] rounded-[10px] border border-[#076aff] transition-transform duration-200 hover:scale-105',
                length === 'pillar'
                  ? 'bg-[#076aff] text-white'
                  : 'bg-[#f9fbff] text-[#002c71]'
              )}
              onClick={() => setLength('pillar')}
            >
              Long Form (2500–3250 words)
            </button>
          </div>
        </div>

        {/* Intent Section with Explanation */}
        <div className="mt-[60px] text-center">
          <p className="text-[22px] font-semibold mb-[20px] text-[#002c71]">
            What kind of content should this be?
          </p>

          <p className="mb-[15px]">
            Content serves different goals. Some articles build trust and visibility,
            while others drive action such as purchases, bookings, or signups.
          </p>

          <p className="mb-[20px]">
            🔍 <strong>SEO</strong> (Search Engine Optimization) helps people find your content on Google. <br />
            🤖 <strong>GEO</strong> (Generative Engine Optimization) ensures your content appears in AI-powered answers like ChatGPT or Google’s AI Overview.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-[40px] mt-[20px] text-left">
            <div className="w-full md:w-[300px]">
              <p className="font-bold underline text-[20px] mb-[8px] text-[#002c71]">
                Informational Content
              </p>
              <ul className="list-disc text-[18px] pl-[20px] space-y-[6px]">
                <li>Answers common or niche questions</li>
                <li>Builds topical authority and trust</li>
                <li>Helps you rank in AI search results (GEO)</li>
              </ul>
            </div>

            <div className="w-full md:w-[300px]">
              <p className="font-bold underline text-[20px] mb-[8px] text-[#002c71]">
                Transactional Content
              </p>
              <ul className="list-disc text-[18px] pl-[20px] space-y-[6px]">
                <li>Converts leads into customers</li>
                <li>Supports sales, bookings, or actions</li>
                <li>Drives SEO visibility and lead generation</li>
              </ul>
            </div>
          </div>

          <p className="mt-[25px] text-[18px] text-[#333]">
            For most brands, a balanced mix is about <strong>70% transactional</strong> to grow leads and revenue, and <strong>30% informational</strong> to build trust and visibility.
          </p>

          <div className="flex justify-center gap-[12px] mt-[25px]">
            <button
              className={clsx(
                'px-[20px] py-[10px] rounded-[10px] border border-[#076aff] transition-transform duration-200 hover:scale-105',
                intent === 'informational'
                  ? 'bg-[#076aff] text-white'
                  : 'bg-[#f9fbff] text-[#002c71]'
              )}
              onClick={() => setIntent('informational')}
            >
              Informational
            </button>

            <button
              className={clsx(
                'px-[20px] py-[10px] rounded-[10px] border border-[#076aff] transition-transform duration-200 hover:scale-105',
                intent === 'transactional'
                  ? 'bg-[#076aff] text-white'
                  : 'bg-[#f9fbff] text-[#002c71]'
              )}
              onClick={() => setIntent('transactional')}
            >
              Transactional
            </button>
          </div>
        </div>

        {/* Internal Links */}
        <div className="mt-[60px]">
          <strong className="text-[#076aff]">Internal Links:</strong>
          <ul className="list-disc ml-[20px] mt-[10px]">
            {internalLinks.filter((link) => link.trim() !== '').length === 0 ? (
              <li className="italic text-gray-400">No links provided</li>
            ) : (
              internalLinks.map((link, i) => <li key={i}>{link}</li>)
            )}
          </ul>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-[50px] flex justify-center gap-[20px]">
        <button
          onClick={() => router.push('/generate/step-2')}
          className="bg-white border border-[#076aff] text-[#076aff] px-[36px] py-[14px] rounded-[12px] text-[18px] font-semibold shadow-md hover:bg-[#076aff] hover:text-white transition-transform hover:scale-105"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          className="bg-[#076aff] hover:bg-[#004fc7] text-white px-[36px] py-[14px] rounded-[12px] text-[18px] font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-105"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
