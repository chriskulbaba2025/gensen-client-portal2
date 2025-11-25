'use client';

import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Loader2 } from 'lucide-react';

export default function OpportunitiesPage() {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch('/api/opportunity-report', { cache: 'no-store' });
        if (!res.ok) throw new Error('Bad response');

        const data = await res.json();
        setHtml(data?.html || null);
      } catch {
        setHtml(null);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 className="animate-spin" size={42} />
        </div>
      </PageLayout>
    );
  }

  // If no report exists
  if (!html) {
    return (
      <PageLayout>
        <h1 className="text-[28px] font-semibold text-center mt-[40px]">
          Opportunity Map
        </h1>
        <p className="text-center text-[16px] text-[#444] mt-[10px]">
          No Opportunity Map report found.
        </p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="text-[30px] font-bold text-center mb-[20px] text-[#111] dark:text-[#f5f5f5]">
        Opportunity Map
      </h1>

      {/* RESTORED HEADINGS / TYPOGRAPHY */}
      <div
        className="
          prose prose-lg max-w-none
          prose-h2:text-[#10284a] prose-h2:font-bold prose-h2:text-[28px] prose-h2:mt-[32px] prose-h2:mb-[12px]
          prose-h3:text-[#10284a] prose-h3:font-semibold prose-h3:text-[22px] prose-h3:mt-[24px] prose-h3:mb-[8px]
          prose-p:text-[16px] prose-p:leading-relaxed
        "
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </PageLayout>
  );
}
