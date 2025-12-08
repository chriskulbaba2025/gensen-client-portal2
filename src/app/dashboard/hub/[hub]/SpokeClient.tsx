"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// ---------------------------------------
// Types
// ---------------------------------------
interface SpokeRecord {
  id: string;
  title: string;
  keywords: string;
  description: string;
  intent: "Informational" | "Transactional" | "Edge";
  status: "published" | "draft";
  hubNumber: number;
  spokeNumber: number;
}

interface Stats {
  total: number;
  published: number;
  drafts: number;
}

// ---------------------------------------
// Funnel stages
// ---------------------------------------
const STAGES = [
  {
    key: "Informational",
    label: "Awareness · Top-of-Funnel",
    color: "#0aa2fb",
    funnelLine: "Meet people early and make the problem feel solvable.",
  },
  {
    key: "Transactional",
    label: "Consideration · Mid-Funnel",
    color: "#6ca439",
    funnelLine: "Help people compare paths and form a clear preference.",
  },
  {
    key: "Edge",
    label: "Decision · Bottom-of-Funnel",
    color: "#f66630",
    funnelLine: "Remove friction so serious buyers can move forward quickly.",
  },
] as const;

// ---------------------------------------
// Component
// ---------------------------------------
export default function SpokeClient({ hubId }: { hubId?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const [records, setRecords] = useState<SpokeRecord[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  // --------------------------------------------------
  // Load spokes for the hub
  // --------------------------------------------------
  useEffect(() => {
    const fromUrl = pathname.split("/").filter(Boolean).pop() ?? "";
    const effectiveHub = hubId ?? fromUrl;

    const hubNumber = Number(effectiveHub);

    if (!hubNumber || Number.isNaN(hubNumber)) {
      setError(true);
      return;
    }

    fetch("/api/get-spokes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hubNumber }),
    })
      .then((res) => res.json())
      .then((data: SpokeRecord[] | { error: string }) => {
        if (!Array.isArray(data)) {
          setError(true);
          return;
        }

        const total = data.length;
        const published = data.filter((r) => r.status === "published").length;
        const drafts = total - published;

        setRecords(data);
        setStats({ total, published, drafts });
      })
      .catch(() => setError(true));
  }, [hubId, pathname]);

  // --------------------------------------------------
  // Rendering states
  // --------------------------------------------------
  if (error) {
    return (
      <h1 className="text-xl font-bold text-red-600 text-center mt-[40px]">
        Could not load spokes
      </h1>
    );
  }

  if (!records || !stats) {
    return <p className="text-center mt-[40px] text-[#4b5563]">Loading…</p>;
  }

  const { total, published, drafts } = stats;
  const publishedPct = total ? Math.round((published / total) * 100) : 0;

  // --------------------------------------------------
  // Main render
  // --------------------------------------------------
  return (
    <div className="max-w-[1200px] mx-auto space-y-[32px]">

      {/* Header */}
      <header className="space-y-[16px]">
        <h1 className="text-[28px] font-bold text-[#10284a]">
          Publishing Progress
        </h1>

        <p className="text-[15px] text-[#4b5563] max-w-[760px]">
          This hub is designed to move people from first contact to confident decisions.
        </p>

        {/* Funnel legend */}
        <div className="flex flex-col md:flex-row gap-[12px] mt-[8px]">
          {STAGES.map((stage) => (
            <div
              key={stage.key}
              className="flex flex-col rounded-[12px] border border-[#e5e7eb] px-[14px] py-[10px] bg-white shadow-sm"
            >
              <div className="flex items-center gap-[8px]">
                <span
                  className="w-[14px] h-[14px] rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-[14px] font-semibold text-[#111827]">
                  {stage.label}
                </span>
              </div>
              <p className="text-[12px] text-[#6b7280]">{stage.funnelLine}</p>
            </div>
          ))}
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mt-[12px]">
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

      {/* Stages */}
      <section className="space-y-[24px]">
        {STAGES.map((stage) => {
          const stageRecords = records.filter((r) => r.intent === stage.key);
          const stageTotal = stageRecords.length;
          const stagePublished = stageRecords.filter(
            (r) => r.status === "published"
          ).length;
          const stagePct =
            stageTotal > 0
              ? Math.round((stagePublished / stageTotal) * 100)
              : 0;

          return (
            <div
              key={stage.key}
              className="bg-white border border-[#e5e7eb] rounded-[16px] p-[20px] shadow-sm"
            >
              {/* Stage header */}
              <div className="flex items-center justify-between mb-[12px]">
                <div className="flex items-center gap-[10px]">
                  <span
                    className="w-[18px] h-[18px] rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <div>
                    <h2 className="text-[18px] font-semibold text-[#111827]">
                      {stage.label}
                    </h2>
                    <p className="text-[13px] text-[#6b7280]">
                      {stageTotal} topics · {stagePublished} published
                    </p>
                  </div>
                </div>

                <div className="text-right text-[13px] text-[#4b5563]">
                  <div className="font-medium">
                    {stagePublished}/{stageTotal} published
                  </div>
                  <div>{stagePct}% complete</div>
                </div>
              </div>

              {/* Spoke Cards */}
              {stageTotal === 0 ? (
                <p className="text-[13px] text-[#9ca3af] italic">
                  No spokes in this stage yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] mt-[4px]">
                  {stageRecords.map((record) => (
                    <SpokeCard
                      key={record.id}
                      record={record}
                      color={stage.color}
                      onClick={() =>
                        router.push(
                          `/dashboard/hub/${record.hubNumber}/spoke/${encodeURIComponent(
                            record.id
                          )}`
                        )
                      }
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

// ---------------------------------------
// Helper Components
// ---------------------------------------
function StatCard({
  label,
  value,
  subtitle,
  accent,
}: {
  label: string;
  value: number;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-[14px] border border-[#e5e7eb] p-[14px] shadow-sm">
      <div className="flex items-center justify-between mb-[8px]">
        <span className="text-[13px] text-[#6b7280]">{label}</span>
        <span
          className="w-[8px] h-[24px] rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>
      <div className="text-[24px] font-semibold text-[#0f172a]">{value}</div>
      <div className="text-[12px] text-[#9ca3af]">{subtitle}</div>
    </div>
  );
}

function SpokeCard({
  record,
  color,
  onClick,
}: {
  record: SpokeRecord;
  color: string;
  onClick: () => void;
}) {
  const isPublished = record.status === "published";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-[#f9fafb] hover:bg-[#eef2ff] transition-colors rounded-[10px] px-[12px] py-[10px] cursor-pointer border border-[#e5e7eb]"
    >
      <div className="flex flex-col gap-[4px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px] min-w-0">
            <h3 className="text-[15px] font-semibold text-[#111827] line-clamp-1">
              {record.title}
            </h3>
            <StatusPill isPublished={isPublished} />
          </div>
          <span
            className="inline-flex items-center justify-center px-[8px] py-[4px] rounded-full border text-[11px]"
            style={{ borderColor: color, color }}
          >
            View details
          </span>
        </div>

        {record.description && (
          <p className="text-[13px] text-[#6b7280] line-clamp-2">
            {record.description}
          </p>
        )}

        {record.keywords && (
          <p className="text-[11px] text-[#9ca3af] mt-[2px]">
            <span className="font-medium text-[#6b7280]">Keywords:</span>{" "}
            {record.keywords}
          </p>
        )}
      </div>
    </button>
  );
}

function StatusPill({ isPublished }: { isPublished: boolean }) {
  return isPublished ? (
    <span className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[#dcfce7] text-[#166534] text-[11px] font-medium border border-[#bbf7d0]">
      Published
    </span>
  ) : (
    <span className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[#fef3c7] text-[#92400e] text-[11px] font-medium border border-[#fde68a]">
      Draft
    </span>
  );
}
