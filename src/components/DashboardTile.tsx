// src/components/DashboardTile.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

interface DashboardTileProps {
  title: string;
  imageUrl: string;
  href: string;
  description: string;
}

export default function DashboardTile({
  title,
  imageUrl,
  href,
  description,
}: DashboardTileProps) {
  return (
    <Link href={href} className="group block no-underline">
      <div
        className="
          flex flex-col items-center text-center
          p-[28px] bg-white dark:bg-[#1A1A1A]
          border border-[#d35400] rounded-[10px]
          transition-transform duration-200 ease-in-out
          hover:scale-105 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]
        "
      >
        <Image
          src={imageUrl}
          alt={`${title} icon`}
          width={80}
          height={80}
          loading="lazy"
          className="mb-[16px] select-none"
        />

        <h2
          className="
            text-[18px] font-semibold mb-[8px]
            text-[#111111] dark:text-[#f5f5f5]
            group-hover:text-[#d35400]
          "
        >
          {title}
        </h2>

        <p className="text-[14px] text-[#333333] dark:text-[#cccccc]">
          {description}
        </p>
      </div>
    </Link>
  );
}
