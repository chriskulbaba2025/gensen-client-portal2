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
        
        // 🌟 DIAGNOSTIC LOG: Check the exact string content received from the server
        console.log('Received HTML String (Check for &lt;):', data.html ? data.html.substring(0, 100) : 'No content');

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
  
  // This rendering block is structurally correct for rendering HTML
  return (
    <div
      className="max-w-[760px] mx-auto px-4 py-6 text-[#0b1320]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}