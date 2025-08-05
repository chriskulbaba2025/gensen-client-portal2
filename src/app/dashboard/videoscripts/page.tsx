'use client';
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

interface VideoScript {
  id: number;
  title: string;
  date: string;
  preview: string;
  status: 'Draft' | 'Ready' | 'Published';
}

const initialScripts: VideoScript[] = [
  {
    id: 1,
    title: '60‑Second Product Demo',
    date: '01 Aug 2025',
    preview: 'A concise script highlighting your product’s top three features.',
    status: 'Ready',
  },
  {
    id: 2,
    title: '2‑Minute Company Story',
    date: '15 Jul 2025',
    preview: 'Engage viewers with your brand’s origin story in under two minutes.',
    status: 'Draft',
  },
  {
    id: 3,
    title: 'Explainer Video for New Feature',
    date: '10 Jul 2025',
    preview: 'Step‑by‑step walkthrough of your latest feature release.',
    status: 'Published',
  },
  {
    id: 4,
    title: 'Customer Testimonial Highlight',
    date: '22 Jun 2025',
    preview: 'Script for an authentic, 90‑second customer success story.',
    status: 'Ready',
  },
];

export default function VideoScriptsPage() {
  const [scripts, setScripts] = useState<VideoScript[]>(initialScripts);

  const setStatus = (id: number, newStatus: VideoScript['status']) => {
    setScripts(prev =>
      prev.map(s => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const latest = scripts.slice(0, 4);

  return (
    <PageLayout>
      <h1 className="text-[30px] font-bold text-center mb-[20px] text-[#111111] dark:text-[#f5f5f5]">
        Video Scripts
      </h1>

      <div className="flex justify-center mb-[30px]">
        <img
          src="https://responsegenerators.ca/wp-content/uploads/2025/07/Gensen-Logo-Final-version-lower-case-logo-and-spaces1.webp"
          alt="Gensen Logo"
          className="w-[150px] h-auto"
        />
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-[20px] mb-[40px]">
        {latest.map(script => (
          <div
            key={script.id}
            className="border border-[#d35400] rounded-[10px] p-[20px]"
          >
            {/* Details */}
            <div className="space-y-[8px] mb-[16px]">
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Title
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc]">
                  {script.title}
                </span>
              </div>
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Date
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc]">
                  {script.date}
                </span>
              </div>
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Preview
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc] italic">
                  “{script.preview}”
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-[12px] mb-[16px]">
              <Link
                href={`/dashboard/videoscripts/${script.id}/short`}
                className="flex-1 text-center border border-[#007bff] rounded-[6px] px-[8px] py-[6px] text-[16px] text-[#007bff] hover:bg-[#007bff] hover:text-[#ffffff] transition"
              >
                Short Script
              </Link>
              <Link
                href={`/dashboard/videoscripts/${script.id}/long`}
                className="flex-1 text-center border border-[#f66630] rounded-[6px] px-[8px] py-[6px] text-[16px] text-[#f66630] hover:bg-[#f66630] hover:text-[#ffffff] transition"
              >
                Long Script
              </Link>
            </div>

            {/* Status buttons */}
            <div className="flex items-center gap-[8px]">
              {(['Draft', 'Ready', 'Published'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(script.id, s)}
                  className={
                    'flex-1 rounded-[6px] px-[12px] py-[6px] text-[14px] transition ' +
                    (script.status === s
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

      {/* Archive & back */}
      <div className="flex flex-col items-center space-y-[16px]">
        <a
          href="https://drive.google.com/your-videoscripts-archive-link"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-[#007bff] rounded-[30px] px-[24px] py-[10px] text-[16px] text-[#007bff] hover:bg-[#007bff] hover:text-[#ffffff] transition"
        >
          Previous Video Scripts Database
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
