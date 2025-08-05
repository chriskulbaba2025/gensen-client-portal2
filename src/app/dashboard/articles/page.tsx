'use client';
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  date: string;
  preview: string;
  status: 'Draft' | 'Ready' | 'Published';
}

const initialArticles: Article[] = [
  {
    id: 1,
    title: 'The Ultimate AI Content Calendar',
    date: '15 Jul 2025',
    preview:
      'Plan your posts a month ahead with this ready‑to‑use calendar template.',
    status: 'Ready',
  },
  {
    id: 2,
    title: '7 SEO Myths to Forget in 2025',
    date: '02 Aug 2025',
    preview:
      'We bust the biggest misconceptions that still hurt search rankings.',
    status: 'Draft',
  },
  {
    id: 3,
    title: 'Case Study: 3× Traffic in 90 Days',
    date: '22 Jun 2025',
    preview:
      'See how a SaaS startup tripled organic visits with pillar‑cluster content.',
    status: 'Published',
  },
  {
    id: 4,
    title: 'How to Automate Your Content Workflow',
    date: '30 Jul 2025',
    preview:
      'Save hours by chaining AI prompts together in your calendar.',
    status: 'Ready',
  },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState(initialArticles);

  const setStatus = (id: number, newStatus: Article['status']) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const latest = articles.slice(0, 4);

  return (
    <PageLayout>
      {/* Header */}
      <h1 className="text-[30px] font-bold text-center mb-[20px] text-[#111111] dark:text-[#f5f5f5]">
        Articles and Outlines
      </h1>

      {/* Logo */}
      <div className="flex justify-center mb-[30px]">
        <img
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="Gensen Logo"
          className="w-[150px] h-auto"
        />
      </div>

      {/* 2×2 grid of cards */}
      <div className="grid grid-cols-2 gap-[20px] mb-[40px]">
        {latest.map((art) => (
          <div
            key={art.id}
            className="border border-[#d35400] rounded-[10px] p-[20px]"
          >
            {/* Article details */}
            <div className="space-y-[8px] mb-[16px]">
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Title
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc]">
                  {art.title}
                </span>
              </div>
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Date
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc]">
                  {art.date}
                </span>
              </div>
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Preview
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc] italic">
                  “{art.preview}”
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-[12px] mb-[16px]">
              <Link
                href={`/dashboard/articles/${art.id}/outline`}
                className="flex-1 text-center border border-[#007bff] rounded-[6px] px-[8px] py-[6px] text-[16px] text-[#007bff] hover:bg-[#007bff] hover:text-[#ffffff] transition"
              >
                Get Outline
              </Link>
              <Link
                href={`/dashboard/articles/${art.id}`}
                className="flex-1 text-center border border-[#f66630] rounded-[6px] px-[8px] py-[6px] text-[16px] text-[#f66630] hover:bg-[#f66630] hover:text-[#ffffff] transition"
              >
                Get Full Article
              </Link>
            </div>

            {/* Status buttons */}
            <div className="flex items-center gap-[8px]">
              {(['Draft', 'Ready', 'Published'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(art.id, s)}
                  className={
                    'flex-1 rounded-[6px] px-[12px] py-[6px] text-[14px] transition ' +
                    (art.status === s
                      ? 'bg-[#007bff] text-[#ffffff]'
                      : 'bg-[#d1d5db] text-[#6b7280]')
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Older‑articles link & back */}
      <div className="flex flex-col items-center space-y-[16px]">
        <a
          href="https://drive.google.com/your-client-folder-link"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-[#007bff] rounded-[30px] px-[24px] py-[10px] text-[16px] text-[#007bff] hover:bg-[#007bff] hover:text-[#ffffff] transition"
        >
          Click For Access To Previous Articles Database
        </a>

        <Link
          href="/dashboard"
          className="inline-block bg-[#f66630] text-[#ffffff] rounded-[6px] px-[20px] py-[8px] text-[16px] hover:bg-[#e0552b] transition"
        >
          Back to GENSEN Dashboard
        </Link>
      </div>
    </PageLayout>
  );
}
