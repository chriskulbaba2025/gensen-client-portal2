"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

const STAGES: {
  key: SpokeRecord["intent"];
  label: string;
  funnelLine: string;
  color: string;
  explainerTop: string;
  explainerBottom: string;
}[] = [
  {
    key: "Informational",
    label: "Awareness · Top-of-Funnel",
    funnelLine: "Meet people early and make the problem feel solvable.",
    color: "#0aa2fb",
    explainerTop:
      "This stage meets people early… before they compare vendors or hunt for solutions. The goal is simple: show them you understand their world and the challenges underneath their searches. Awareness pieces give your audience language, clarity, and confidence.",
    explainerBottom:
      "This content earns trust without pressure. It brings in cold audiences, early researchers, and anyone trying to get their bearings.",
  },
  {
    key: "Transactional",
    label: "Consideration · Mid-Funnel",
    funnelLine: "Help people compare paths and form a clear preference.",
    color: "#6ca439",
    explainerTop:
      "Here, readers already know the problem. Now they’re weighing approaches, tools, timelines, frameworks. They’re deciding what matters and who looks credible. Consideration content gives them structure… not sales pressure. It helps them compare tradeoffs and see what working with a competent partner looks like.",
    explainerBottom:
      "It’s where warm leads form opinions and start leaning in.",
  },
  {
    key: "Edge",
    label: "Decision · Bottom-of-Funnel",
    funnelLine: "Remove friction so serious buyers can move forward quickly.",
    color: "#f66630",
    explainerTop:
      "This is where people stop browsing and start choosing. They’re close to action. They want clarity, proof, and confidence so they don’t make the wrong call. Decision-stage pieces remove friction by answering the last uncomfortable questions and showing what’s real.",
    explainerBottom:
      "When this section works well, the rest of the funnel becomes lighter.",
  },
];

export default function SpokeClient({ hubId }: { hubId: string }) {
  const router = useRouter();
  const [records, setRecords] = useState<SpokeRecord[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const hubNumber = Number(hubId);

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
  }, [hubId]);

  if (error) {
    return (
      <h1 className="text-xl font-bold text-red-600 text-center mt-[40px]">
        Could not load spokes
      </h1>
    );
  }

  if (!records || !stats) {
    return (
      <p className="text-center mt-[40px] text-[#4b5563]">
        Loading…
      </p>
    );
  }

  const { total, published, drafts } = stats;
  const publishedPct = total ? Math.round((published / total) * 100) : 0;

  return (
    <div className="max-w-[1200px] mx-auto space-y-[32px]">
      {/* Header + funnel legend + global stats */}
      <header className="space-y-[16px]">
        <h1 className="text-[28px] font-bold text-[#10284a]">
          Publishing Progress
        </h1>
        <p className="text-[15px] text-[#4b5563] max-w-[760px]">
          This hub is designed to move people from first contact to confident
          decisions. Use the awareness, consideration, and decision sections
          to keep your topics balanced across the full funnel… not just at the
          top.
        </p>

        {/* Funnel legend bars */}
        <div className="flex flex-col md:flex-row gap-[12px] mt-[8px]">
          {STAGES.map((stage) => (
            <div
              key={stage.key}
              className="flex-1 flex flex-col justify-between rounded-[12px] border border-[#e5e7eb] px-[14px] py-[10px] bg-white shadow-sm"
            >
              <div className="flex items-center justify-between mb-[6px]">
                <div className="flex items-center gap-[8px]">
                  <span
                    className="w-[14px] h-[14px] rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-[14px] font-semibold text-[#111827]">
                    {stage.label}
                  </span>
                </div>
              </div>
              <p className="text-[12px] text-[#6b7280]">
                {stage.funnelLine}
              </p>
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

      {/* Stage sections in funnel order */}
      <section className="space-y-[24px]">
        {STAGES.map((stage) => {
          const stageRecords = records.filter(
            (r) => r.intent === stage.key
          );
          const stageTotal = stageRecords.length;
          const stagePublished = stageRecords.filter(
            (r) => r.status === "published"
          ).length;
          const stagePct = stageTotal
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
                      {stageTotal} topic{stageTotal === 1 ? "" : "s"} ·{" "}
                      {stagePublished} published
                    </p>
                  </div>
                </div>

                <div className="text-right text-[13px] text-[#4b5563]">
                  <div className="font-medium">
                    {stagePublished}/{stageTotal || 0} published
                  </div>
                  <div>{stagePct}% complete</div>
                </div>
              </div>

              {/* Stage explainer with left accent bar */}
              <div className="flex mt-[6px] mb-[14px]">
                <div
                  className="w-[4px] rounded-full mr-[10px]"
                  style={{ backgroundColor: stage.color }}
                />
                <div className="space-y-[6px]">
                  <p className="text-[13px] text-[#4b5563]">
                    {stage.explainerTop}
                  </p>
                  <p className="text-[13px] text-[#4b5563]">
                    {stage.explainerBottom}
                  </p>
                </div>
              </div>

              {/* Stage progress bar */}
              <div className="w-full bg-[#e5e7eb] rounded-full h-[10px] mb-[16px] overflow-hidden">
                <div
                  className="h-[10px] rounded-full transition-all duration-300"
                  style={{
                    width: `${stagePct}%`,
                    backgroundColor: stage.color,
                  }}
                />
              </div>

              {/* Spoke cards */}
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
  router.push(`/dashboard/spoke/${record.hubNumber}-${record.spokeNumber}`)
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
        <div className="flex items-center justify-between gap-[8px]">
          <div className="flex items-center gap-[8px] min-w-0">
            <h3 className="text-[15px] font-semibold text-[#111827] line-clamp-1">
              {record.title || "Untitled spoke"}
            </h3>
            <StatusPill isPublished={isPublished} />
          </div>
          <span
            className="inline-flex items-center justify-center px-[8px] py-[4px] rounded-full border text-[11px] whitespace-nowrap"
            style={{
              borderColor: color,
              color: color,
            }}
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
            <span className="font-medium text-[#6b7280]">
              Keywords:
            </span>{" "}
            {record.keywords}
          </p>
        )}
      </div>
    </button>
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
