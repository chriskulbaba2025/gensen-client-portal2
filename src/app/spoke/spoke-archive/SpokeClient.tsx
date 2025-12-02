"use client";

import { useEffect, useState } from "react";

interface SpokeRecord {
  id: string;
  title: string;
  keywords: string;
  description: string;
  intent: string;
  status: string;
}

interface GroupedItem {
  intent: string;
  color: string;
  records: SpokeRecord[];
}

interface Stats {
  total: number;
  published: number;
  drafts: number;
}

export default function SpokeClient({ hubId }: { hubId: string }) {
  const [grouped, setGrouped] = useState<GroupedItem[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const hubNumber = Number(hubId);

    fetch("/api/get-spokes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hubNumber }),
    })
      .then((res) => res.json())
      .then((records: SpokeRecord[]) => {
        if (!Array.isArray(records)) {
          setError(true);
          return;
        }

        const intents = ["Informational", "Transactional", "Edge"] as const;
        const colors: Record<string, string> = {
          Informational: "#0aa2fb",
          Transactional: "#6ca439",
          Edge: "#f66630",
        };

        const groupedData: GroupedItem[] = intents.map((intent) => ({
          intent,
          color: colors[intent],
          records: records.filter((r) => r.intent === intent),
        }));

        const total = records.length;
        const published = records.filter(
          (r) => r.status?.toLowerCase() === "published"
        ).length;
        const drafts = total - published;

        setGrouped(groupedData);
        setStats({ total, published, drafts });
      })
      .catch(() => setError(true));
  }, [hubId]);

  if (error) {
    return (
      <h1 className="text-xl font-bold text-red-600 text-center mt-[40px]">
        Could not load spokes
      </h1>
    );
  }

  if (!grouped || !stats) {
    return <p className="text-center mt-[40px] text-[#4b5563]">Loading…</p>;
  }

  const { total, published, drafts } = stats;
  const publishedPct = total ? Math.round((published / total) * 100) : 0;

  const intentLabels: Record<string, string> = {
    Informational: "Awareness · Top-of-Funnel",
    Transactional: "Consideration · Mid-Funnel",
    Edge: "Decision · Bottom-of-Funnel",
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-[32px]">
      {/* Header + global stats */}
      <header className="space-y-[12px]">
        <h1 className="text-[28px] font-bold text-[#10284a]">
          Publishing Progress
        </h1>
        <p className="text-[15px] text-[#4b5563] max-w-[720px]">
          Track how consistently you’re publishing across awareness, consideration,
          and decision content. Use this view to balance your topics and keep a
          steady mix of TOFU, MOFU, and BOFU pieces live.
        </p>

        <div className="grid grid-cols-3 gap-[16px] mt-[12px]">
          <StatCard
            label="Published"
            value={published}
            subtitle={`${publishedPct}% of all spokes`}
            accent="#22c55e"
          />
          <StatCard
            label="Drafts"
            value={drafts}
            subtitle="Ready to be scheduled or refined"
            accent="#f97316"
          />
          <StatCard
            label="Total Spokes"
            value={total}
            subtitle="Live & in-progress topics"
            accent="#0aa2fb"
          />
        </div>
      </header>

      {/* Intent blocks */}
      <section className="space-y-[24px]">
        {grouped.map((group) => {
          const intentTotal = group.records.length;
          const intentPublished = group.records.filter(
            (r) => r.status?.toLowerCase() === "published"
          ).length;
          const intentPct = intentTotal
            ? Math.round((intentPublished / intentTotal) * 100)
            : 0;

          return (
            <div
              key={group.intent}
              className="bg-white border border-[#e5e7eb] rounded-[16px] p-[20px] shadow-sm"
            >
              {/* Block header */}
              <div className="flex items-center justify-between mb-[12px]">
                <div className="flex items-center gap-[10px]">
                  <span
                    className="w-[14px] h-[14px] rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <div>
                    <h2 className="text-[18px] font-semibold text-[#111827]">
                      {intentLabels[group.intent] ?? group.intent}
                    </h2>
                    <p className="text-[13px] text-[#6b7280]">
                      {intentTotal} topic{intentTotal === 1 ? "" : "s"} ·{" "}
                      {intentPublished} published
                    </p>
                  </div>
                </div>

                {/* Mini progress text */}
                <div className="text-right text-[13px] text-[#4b5563]">
                  <div className="font-medium">
                    {intentPublished}/{intentTotal || 0} published
                  </div>
                  <div>{intentPct}% complete</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#e5e7eb] rounded-full h-[10px] mb-[16px] overflow-hidden">
                <div
                  className="h-[10px] rounded-full transition-all duration-300"
                  style={{
                    width: `${intentPct}%`,
                    backgroundColor: group.color,
                  }}
                />
              </div>

              {/* Spoke rows */}
              {intentTotal === 0 ? (
                <p className="text-[13px] text-[#9ca3af] italic">
                  No spokes in this stage yet.
                </p>
              ) : (
                <div className="space-y-[8px]">
                  {group.records.map((record) => (
                    <SpokeRow
                      key={record.id}
                      record={record}
                      color={group.color}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

function StatCard(props: {
  label: string;
  value: number;
  subtitle: string;
  accent: string;
}) {
  const { label, value, subtitle, accent } = props;
  return (
    <div className="bg-white rounded-[14px] border border-[#e5e7eb] p-[14px] shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-[8px]">
        <span className="text-[13px] text-[#6b7280]">{label}</span>
        <span
          className="w-[8px] h-[24px] rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>
      <div className="text-[24px] font-semibold text-[#0f172a] leading-none mb-[4px]">
        {value}
      </div>
      <div className="text-[12px] text-[#9ca3af]">{subtitle}</div>
    </div>
  );
}

function SpokeRow({ record, color }: { record: SpokeRecord; color: string }) {
  const isPublished = record.status?.toLowerCase() === "published";

  return (
    <div className="flex items-start justify-between bg-[#f9fafb] hover:bg-[#eef2ff] transition-colors rounded-[10px] px-[12px] py-[10px] cursor-pointer">
      <div className="flex flex-col gap-[4px]">
        <div className="flex items-center gap-[8px]">
          <h3 className="text-[15px] font-semibold text-[#111827] line-clamp-1">
            {record.title || "Untitled spoke"}
          </h3>
          <StatusPill isPublished={isPublished} />
        </div>
        {record.description && (
          <p className="text-[13px] text-[#6b7280] line-clamp-2 max-w-[640px]">
            {record.description}
          </p>
        )}
        {record.keywords && (
          <p className="text-[11px] text-[#9ca3af]">
            <span className="font-medium text-[#6b7280]">Keywords:</span>{" "}
            {record.keywords}
          </p>
        )}
      </div>

      <div className="flex items-center gap-[6px] text-[11px] text-[#4b5563]">
        <span
          className="inline-flex items-center justify-center px-[8px] py-[4px] rounded-full border text-[11px]"
          style={{
            borderColor: color,
            color: color,
          }}
        >
          View details
        </span>
      </div>
    </div>
  );
}

function StatusPill({ isPublished }: { isPublished: boolean }) {
  if (isPublished) {
    return (
      <span className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[#dcfce7] text-[#166534] text-[11px] font-medium border border-[#bbf7d0]">
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[#fef3c7] text-[#92400e] text-[11px] font-medium border border-[#fde68a]">
      Draft
    </span>
  );
}
