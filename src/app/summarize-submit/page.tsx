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
  } = useGeneratorStore();

  const handleSubmit = async () => {
    const payload = {
      keywords,
      audience,
      length,
      intent,
      internalLinks: internalLinks.filter((link) => link.trim() !== ''),
    };

    try {
      await fetch('https://your-n8n-webhook-url.com/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      alert('Submitted to GENSEN successfully!');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      console.error(errorMessage);
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen px-[40px] py-[60px] text-black dark:text-white text-center">
      <h1 className="text-[24px] font-semibold mb-[10px]">Summarize and Submit</h1>

      <div className="flex justify-center mb-[30px]">
        <Image
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="Gensen Logo"
          width={250}
          height={100}
          className="h-auto"
        />
      </div>

      <p className="max-w-[600px] mx-auto text-[16px] mb-[40px]">
        Take a moment to ensure your keyword, audience, and internal links are all correct.
        When you choose to submit, GENSEN will create your outline and article.
      </p>

      <div className="text-left max-w-[600px] mx-auto space-y-[20px] text-[16px] leading-[26px]">
        <div>
          <strong className="text-[#f66630]">Keywords:</strong><br />
          {keywords || '—'}
        </div>
        <div>
          <strong className="text-[#f66630]">Audience:</strong><br />
          {audience || '—'}
        </div>
        <div>
          <strong className="text-[#f66630]">Length:</strong><br />
          {length === 'standard' ? '2000–2500 words' : length === 'pillar' ? '2300–3000 words' : '—'}
        </div>

        <div className="mt-[30px] text-center">
          <p className="text-[20px] font-semibold mb-[20px] text-[#f66630]">
            What kind of content should this be?
          </p>

          <p className="mb-[20px]">
            Content can serve different goals — some articles are meant to <strong>build trust and visibility</strong>, others are designed to <strong>drive real action</strong> like sales, bookings, or signups.
          </p>

          <p className="mb-[20px]">
            🔍 <strong>SEO</strong> (Search Engine Optimization) helps people find your content on Google. <br />
            🤖 <strong>GEO</strong> (Generative Engine Optimization) ensures your content shows up in AI-powered answers, like ChatGPT or Google’s AI Overview.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-[5px] mt-[20px] text-left font-[Raleway] text-[20px]">
            <div className="w-full md:w-[300px] pl-[20px]">
              <p className="font-bold underline text-[18px] mb-[4px]">Informational Content</p>
              <ul className="list-disc text-[18px] space-y-[6px]">
                <li>Answers common or niche questions</li>
                <li>Builds topical authority and trust</li>
                <li>Helps you rank in AI search results (GEO)</li>
              </ul>
            </div>

            <div className="w-full md:w-[300px] pl-[20px]">
              <p className="font-bold underline text-[20px] mb-[4px]">Transactional Content</p>
              <ul className="list-disc text-[20px] space-y-[6px]">
                <li>Designed to convert leads into customers</li>
                <li>Supports sales, bookings, or client actions</li>
                <li>Great for SEO and lead generation</li>
              </ul>
            </div>
          </div>

          <p className="mt-[20px]">
            For most businesses, a healthy mix is about <strong>70% transactional</strong> (to grow leads and revenue) and <strong>30% informational</strong> (to build trust and visibility).
          </p>

          <div className="flex justify-center gap-[12px] mt-[20px]">
            <button
              className={clsx(
                'px-[20px] py-[10px] rounded-[10px] border border-[#f66630] transition-transform duration-200 transform hover:scale-105',
                intent === 'informational' ? 'bg-[#f66630] text-white' : 'bg-[#f2f2f2] text-black'
              )}
              onClick={() => setIntent('informational')}
            >
              Informational
            </button>

            <button
              className={clsx(
                'px-[20px] py-[10px] rounded-[10px] border border-[#f66630] transition-transform duration-200 transform hover:scale-105',
                intent === 'transactional' ? 'bg-[#f66630] text-white' : 'bg-[#f2f2f2] text-black'
              )}
              onClick={() => setIntent('transactional')}
            >
              Transactional
            </button>
          </div>
        </div>

        <div className="mt-[30px]">
          <strong className="text-[#f66630]">Internal Links:</strong>
          <ul className="list-disc ml-[20px] mt-[8px]">
            {internalLinks.filter((link) => link.trim() !== '').length === 0 ? (
              <li className="italic text-gray-400">No links provided</li>
            ) : (
              internalLinks.map((link, i) => <li key={i}>{link}</li>)
            )}
          </ul>
        </div>
      </div>

      <div className="mt-[50px] flex justify-center gap-[20px]">
        <button
          className="bg-white text-black hover:bg-[#f66630] hover:text-white px-[20px] py-[10px] rounded-[10px] hover:scale-105 transition"
          onClick={() => router.push('/generate/step-2')}
        >
          Back
        </button>
        <button
          className="bg-[#f66630] text-white px-[20px] py-[10px] rounded-[10px] hover:scale-105 transition"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
