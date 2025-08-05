'use client';
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

interface ImageItem {
  id: number;
  title: string;
  date: string;
  alt: string;
  status: 'Draft' | 'Ready' | 'Published';
}

const initialImages: ImageItem[] = [
  {
    id: 1,
    title: 'Downtown Skyline',
    date: '01 Jul 2025',
    alt: 'City skyline at sunset',
    status: 'Ready',
  },
  {
    id: 2,
    title: 'Team Workshop',
    date: '15 Jun 2025',
    alt: 'Colleagues collaborating around a table',
    status: 'Draft',
  },
  {
    id: 3,
    title: 'Product Mockup',
    date: '22 May 2025',
    alt: '3D mockup of the new app interface',
    status: 'Published',
  },
  {
    id: 4,
    title: 'Outdoor Event',
    date: '30 Apr 2025',
    alt: 'Attendees at a company picnic',
    status: 'Ready',
  },
];

export default function ImagesPage() {
  const [items, setItems] = useState<ImageItem[]>(initialImages);

  const setStatus = (id: number, newStatus: ImageItem['status']) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  const latest = items.slice(0, 4);

  return (
    <PageLayout>
      <h1 className="text-[30px] font-bold text-center mb-[20px] text-[#111111] dark:text-[#f5f5f5]">
        Image Assets
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
        {latest.map((img) => (
          <div
            key={img.id}
            className="border border-[#d35400] rounded-[10px] p-[20px]"
          >
            {/* Icon placeholder */}
            <div className="flex justify-center mb-[12px]">
              <div className="w-[60px] h-[60px] bg-[#e5e7eb] dark:bg-[#333333] rounded-[6px] flex items-center justify-center">
                <span className="text-[24px] text-[#9ca3af]">🖼️</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-[8px] mb-[16px]">
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Title
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc]">
                  {img.title}
                </span>
              </div>
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Date
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc]">
                  {img.date}
                </span>
              </div>
              <div>
                <span className="inline-block bg-[#007bff] text-[#ffffff] px-[8px] py-[2px] rounded-[4px] text-[14px] mr-[8px]">
                  Alt Text
                </span>
                <span className="text-[16px] text-[#333333] dark:text-[#cccccc] italic">
                  {img.alt}
                </span>
              </div>
            </div>

            {/* View button */}
            <div className="flex justify-center mb-[16px]">
              <Link
                href={`/dashboard/images/${img.id}`}
                className="border border-[#f66630] rounded-[6px] px-[24px] py-[10px] text-[16px] text-[#f66630] hover:bg-[#f66630] hover:text-[#ffffff] transition"
              >
                View Image
              </Link>
            </div>

            {/* Status buttons */}
            <div className="flex items-center gap-[8px]">
              {(['Draft', 'Ready', 'Published'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(img.id, s)}
                  className={
                    'flex-1 rounded-[6px] px-[12px] py-[6px] text-[14px] transition ' +
                    (img.status === s
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
          href="https://drive.google.com/your-images-archive-link"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-[#007bff] rounded-[30px] px-[24px] py-[10px] text-[16px] text-[#007bff] hover:bg-[#007bff] hover:text-[#ffffff] transition"
        >
          Previous Image Assets Database
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
