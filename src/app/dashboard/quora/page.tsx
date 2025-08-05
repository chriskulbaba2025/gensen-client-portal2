'use client';
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

interface QuoraItem {
  id: number;
  title: string;
  date: string;
  preview: string;
  status: 'Draft' | 'Ready' | 'Published';
}

const initialItems: QuoraItem[] = [
  {
    id: 1,
    title: 'Answering Top Questions in Your Niche',
    date: '18 Jul 2025',
    preview: 'Position yourself as an expert by tackling the most common queries.',
    status: 'Ready',
  },
  {
    id: 2,
    title: 'Optimizing Your Profile for Visibility',
    date: '05 Jun 2025',
    preview: 'Make your bio and credentials shine so readers trust your answers.',
    status: 'Draft',
  },
  {
    id: 3,
    title: 'Leveraging Quora Spaces',
    date: '25 May 2025',
    preview: 'Grow your audience by contributing to high‑traffic Spaces.',
    status: 'Published',
  },
  {
    id: 4,
    title: 'Tracking Engagement Metrics',
    date: '30 Jun 2025',
    preview: 'Use Quora Analytics to refine your content strategy over time.',
    status: 'Ready',
  },
];

export default function QuoraPage() {
  const [items, setItems] = useState<QuoraItem[]>(initialItems);

  const setStatus = (id: number, newStatus: QuoraItem['status']) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  const latest = items.slice(0, 4);

  return (
    <PageLayout>
      {/* Header */}
      <h1 className="text-[30px] font-bold text-center mb-[20px] text-[#111111] dark:text-[#f5f5f5]">
        Quora Updates
      </h1>

      {/* Logo */}
      <div className="flex justify-center mb-[30px]">
        <img
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="Gensen Logo"
          className="w-[150px] h-auto"
        />
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-[20px] mb-[40px]">
        {latest.map(item => (
          <div
            key={item.id}
            className="border border-[#d35400] rounded-[10px] p-[20px]"
          >
            {/* Details */}
            <div className="space-y-[8px] mb-[16px]">
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Title
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc]">
                  {item.title}
                </span>
              </div>
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Date
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc]">
                  {item.date}
                </span>
              </div>
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Preview
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc] italic">
                  “{item.preview}”
                </span>
              </div>
            </div>

            {/* Action button */}
            <div className="flex justify-center mb-[16px]">
              <Link
                href={`/dashboard/quora/${item.id}`}
                className="border border-[#f66630] rounded-[6px] px-[24px] py-[10px] text-[16px] text-[#f66630] hover:bg-[#f66630] hover:text-[#ffffff] transition"
              >
                Get Quora Update
              </Link>
            </div>

            {/* Status buttons */}
            <div className="flex items-center gap-[8px]">
              {(['Draft', 'Ready', 'Published'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(item.id, s)}
                  className={
                    'flex-1 rounded-[6px] px-[12px] py-[6px] text-[14px] transition ' +
                    (item.status === s
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

      {/* Strategies & archive & back */}
      <div className="flex flex-col items-center space-y-[16px]">
        <Link
          href="/dashboard/quora/strategies"
          className="inline-block border border-[#f66630] rounded-[30px] px-[24px] py-[10px] text-[16px] text-[#f66630] hover:bg-[#f66630] hover:text-[#ffffff] transition"
        >
          Quora Posting Strategies
        </Link>
        <a
          href="https://drive.google.com/your-quora-archive-link"
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
