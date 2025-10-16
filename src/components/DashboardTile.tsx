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
          w-[260px] h-[320px]
          p-[20px] bg-white dark:bg-[#0d0d0d]
          border border-[#076aff40] rounded-[15px]
          transition-transform duration-200 ease-in-out
          hover:scale-105 hover:shadow-[0_6px_24px_rgba(7,106,255,0.25)]
        "
      >
        <div className="relative w-[120px] h-[120px] mb-[16px]">
          <Image
            src={imageUrl}
            alt={`${title} icon`}
            fill
            className="object-contain rounded-[15px] select-none"
          />
        </div>

        <h2
          className="
            text-[18px] font-semibold mb-[8px]
            text-[#10284a] dark:text-[#f5f5f5]
            group-hover:text-[#076aff]
          "
        >
          {title}
        </h2>

        <p className="text-[15px] leading-snug text-[#333333] dark:text-[#cccccc]">
          {description}
        </p>
      </div>
    </Link>
  );
}
