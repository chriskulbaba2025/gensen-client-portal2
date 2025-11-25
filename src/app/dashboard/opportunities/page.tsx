'use client';

import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';

export default function OpportunitiesPage() {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/opportunity', { cache: 'no-store' });
        const json = await res.json();
        setHtml(json.html || null);
      } catch {
        setHtml(null);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <PageLayout>
      <h1 className="text-[30px] font-bold text-center mb-[25px] text-[#111111] dark:text-[#f5f5f5]">
        Opportunity Map Report
      </h1>

      {loading && (
        <p className="text-center text-[18px] text-[#333] dark:text-[#ccc]">
          Loading your report…
        </p>
      )}

      {!loading && !html && (
        <p className="text-center text-[18px] text-[#333] dark:text-[#ccc]">
          No report found.
        </p>
      )}

      {html && (
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </PageLayout>
  );
}
