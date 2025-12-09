"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HubPage({ params }: { params: { hub: string } }) {
  const hubNumber = Number(params.hub);
  const [spokes, setSpokes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSpokes() {
      const res = await fetch("/api/get-spokes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hubNumber }),
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSpokes(data);
      setLoading(false);
    }

    loadSpokes();
  }, [hubNumber]);

  if (loading) return <div className="p-8">Loading spokes…</div>;

  return (
    <div className="max-w-[900px] mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Hub {hubNumber}</h1>

      <div className="grid grid-cols-1 gap-4">
        {spokes.map((spoke) => (
          <Link
            key={spoke.id}
            href={`/dashboard/hub/${hubNumber}/spoke/${encodeURIComponent(
              spoke.id
            )}`}
            className="p-4 border rounded hover:bg-gray-50"
          >
            <h2 className="font-semibold">{spoke.title}</h2>
            <p className="text-sm text-gray-600">
              {spoke.description?.slice(0, 120)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
