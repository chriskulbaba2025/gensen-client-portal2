// src/app/spoke/[id]/page.tsx
import { NextResponse } from "next/server";
import SpokeClient from "./SpokeClient";

interface SpokeRecord {
  id: string;
  title: string;
  keywords: string;
  description: string;
  intent: string;
  status: string;
}

export default async function SpokePage({
  params,
}: {
  params: { id: string };
}) {
  const hubNumber = Number(params.id);

  if (!hubNumber || Number.isNaN(hubNumber)) {
    return (
      <main className="p-[40px] text-center">
        <h1 className="text-xl font-bold text-red-600">
          Invalid hub number
        </h1>
      </main>
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-spokes`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ hubNumber }),
    }
  );

  if (!res.ok) {
    return (
      <main className="p-[40px] text-center">
        <h1 className="text-xl font-bold text-red-600">
          Could not load spokes
        </h1>
      </main>
    );
  }

  const data: SpokeRecord[] = await res.json();

  const intents = ["Informational", "Transactional", "Edge"] as const;
  const colors: Record<string, string> = {
    Informational: "#0aa2fb",
    Transactional: "#6ca439",
    Edge: "#f66630",
  };

  const grouped = intents.map((intent) => ({
    intent,
    color: colors[intent],
    records: data.filter((r) => r.intent === intent),
  }));

  const count = (intent: string) =>
    data.filter((r) => r.intent === intent).length;

  const published = (intent: string) =>
    data.filter((r) => r.intent === intent && r.status === "published").length;

  return (
    <main
      className="min-h-screen bg-[#f9fafb] p-[40px]"
      style={{
        fontFamily: "Raleway, sans-serif",
        fontSize: "18px",
        color: "#0b1320",
      }}
    >
      <section className="mb-[40px]">
        <h1 className="text-[26px] font-bold text-[#10284a] mb-[20px]">
          Publishing Progress
        </h1>
        <div className="space-y-[16px]">
          {intents.map((intent) => {
            const total = count(intent);
            const done = published(intent);
            const percent = total ? (done / total) * 100 : 0;
            const color = colors[intent];

            return (
              <div key={intent}>
                <div className="flex justify-between mb-[6px] font-medium">
                  <span>{intent}</span>
                  <span>
                    {done}/{total} ({Math.round(percent)}%)
                  </span>
                </div>
                <div className="w-full bg-[#e9eef6] rounded-full h-[16px]">
                  <div
                    className="h-[16px] rounded-full transition-all duration-300"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Existing UI, unchanged */}
      <SpokeClient grouped={grouped} />
    </main>
  );
}
