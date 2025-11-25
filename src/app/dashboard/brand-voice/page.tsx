'use client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function BrandVoicePage() {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVoice() {
      try {
        const res = await fetch('/api/brand-voice', { cache: 'no-store' });
        const data = await res.json();
        setHtml(data.html || null);
      } catch {
        setHtml(null);
      } finally {
        setLoading(false);
      }
    }
    fetchVoice();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!html) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-semibold">Brand Voice Report</h1>
        <p>No report found.</p>
      </div>
    );
  }

  return (
    <div
      className="
        prose prose-lg max-w-none
        prose-h2:text-[#10284a] prose-h2:font-bold prose-h2:text-[28px] prose-h2:mt-[32px] prose-h2:mb-[12px]
        prose-h3:text-[#10284a] prose-h3:font-semibold prose-h3:text-[22px] prose-h3:mt-[24px] prose-h3:mb-[8px]
        prose-p:text-[16px] prose-p:leading-relaxed
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
