"use client";

import Link from "next/link";

export default function QuickLinks({ inline = false }: { inline?: boolean }) {
  const containerClass = inline
    ? "flex flex-col items-center gap-4 py-4"
    : "flex space-x-4 mb-4";

  return (
    <div className={containerClass}>
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm text-center"
      >
        Dashboard
      </Link>

      <Link
        href="/dashboard/topical-map"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm text-center"
      >
        Topical Map
      </Link>

      <Link
        href="/dashboard/articles"
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm text-center"
      >
        Articles
      </Link>
    </div>
  );
}
