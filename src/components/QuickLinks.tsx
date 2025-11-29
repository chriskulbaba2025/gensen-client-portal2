"use client";

import Link from "next/link";

export default function QuickLinks() {
  return (
    <div className="flex space-x-4 mb-4">
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Dashboard
      </Link>

      <Link
        href="/dashboard/topical-map"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Topical Map
      </Link>

      <Link
        href="/dashboard/articles"
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Articles
      </Link>
    </div>
  );
}
