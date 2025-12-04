/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";

//
// ==========================================================
// TYPES
// ==========================================================
interface SpokeRecord {
  id: string;
  title: string;
  description: string;
  keywords: string;
  intent: string;
  status: string;
  bos: number | null;
  kd: number | null;
  priority: number | null;
  localAngle: string;
  hubNumber: number;
  spokeNumber: number;
  whyItMatters: string;

  // Added for accuracy
  searchIntent?: string;
  SearchIntent?: string;
}

interface ExecBrief {
  title: string;
  description: string;
  whyItMatters: string;
  intent: string;
  bos: string;
  kd: string;
  priority: string;
  searchIntent: string;
  localAngle: string;
  hubNumber: number;
  spokeNumber: number;
  brandVoice: string;

  audienceIntent: string;
  whyThisMatters: string;
  howToUseThisContent: string;
  contentSummary: string;
  recommendedCTAs: string[];

  clientSummary: {
    audience: string;
    value: string;
    howToUseIt: string;
    whatTheArticleCovers: string;
    nextSteps: string[];
  };
}

//
// ==========================================================
// PAGE COMPONENT
// ==========================================================
export default function SpokeDetailPage({
  params,
}: {
  params: { spokeId: string };
}) {
  const [record, setRecord] = useState<SpokeRecord | null>(null);
  const [brief, setBrief] = useState<ExecBrief | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [loadingRecord, setLoadingRecord] = useState(true);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const spokeId = params.spokeId;

  //
  // ========================================================
  // LOAD SPOKE
  // ========================================================
  useEffect(() => {
    async function load() {
      if (!spokeId || !spokeId.includes("-")) {
        setError("Invalid spokeId format");
        setLoadingRecord(false);
        return;
      }

      try {
        const res = await fetch(`/api/get-single-spoke?spokeId=${spokeId}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load spoke");
          setLoadingRecord(false);
          return;
        }

        setRecord(data);
        setLoadingRecord(false);
      } catch {
        setError("Network error loading spoke");
        setLoadingRecord(false);
      }
    }

    load();
  }, [spokeId]);

  //
  // ========================================================
  // EXECUTIVE BRIEF FETCH (CACHE → n8n)
  // ========================================================
  useEffect(() => {
    if (!record) return;

    async function getBrief() {
      setLoadingBrief(true);

      // ---------------------------------------------
      // 1. CHECK CACHE FIRST (Dynamo)
      // ---------------------------------------------
      const r = record as SpokeRecord;
      const hubStr = String(r.hubNumber).padStart(2, "0");
      const spokeStr = String(r.spokeNumber).padStart(3, "0");

      try {
        const cachedRes = await fetch(
          `/api/get-spoke-brief?hub=${hubStr}&spoke=${spokeStr}`,
          { cache: "no-store" }
        );

        const cachedJson = await cachedRes.json();

        if (cachedJson.brief) {
          // Found cached brief → skip n8n
          setBrief(cachedJson.brief);
          setLoadingBrief(false);
          return;
        }
      } catch {
        // If cache check fails, continue to n8n
      }

      // ---------------------------------------------
      // 2. NO CACHE → continue to n8n
      // ---------------------------------------------

      // Start countdown
      setCountdown(30);
      const countdownInterval = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      try {
        // CORRECT searchIntent via fallback chain
        const finalSearchIntent =
          r.SearchIntent ?? r.searchIntent ?? r.intent ?? "";

        const payload = [
          {
            title: r.title,
            description: r.description,
            whyItMatters: r.whyItMatters,
            intent: r.intent,
            bos: String(r.bos ?? ""),
            kd: String(r.kd ?? ""),
            priority: String(r.priority ?? ""),
            searchIntent: finalSearchIntent,
            localAngle: r.localAngle,
            hubNumber: r.hubNumber,
            spokeNumber: r.spokeNumber,
            brandVoice:
              "GENSEN voice: confident, grounded, precise, human, editorial, no hype, no fluff.",
          },
        ];

        const res = await fetch(
          "https://primary-production-77e7.up.railway.app/webhook/spoke-brief",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Webhook returned error");

        const json = await res.json();
        const briefData = Array.isArray(json) ? json[0] : json;

        setBrief(briefData);

        // Save to Dynamo (non-blocking)
        fetch("/api/store-spoke-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brief: briefData }),
        }).catch(() => {});
      } catch {
        setError("Failed to generate Executive Brief");
      } finally {
        setLoadingBrief(false);
      }
    }

    getBrief();
  }, [record]);

  //
  // ========================================================
  // GLOBAL LOADING / ERROR
  // ========================================================
  if (loadingRecord) return <PageMessage text="Loading spoke…" />;
  if (error) return <PageError text={error} />;
  if (!record) return <PageError text="No spoke found." />;

  //
  // ========================================================
  // LOADING BRIEF VIEW
  // ========================================================
  if (loadingBrief || (!brief && countdown > 0)) {
    return (
      <div className="max-w-[900px] mx-auto py-[60px] text-center space-y-[24px]">
        <h2 className="text-[24px] font-semibold text-[#10284a]">
          Analyzing your topic…
        </h2>

        <p className="text-[16px] text-gray-600">
          We’re running your strategic analysis. This usually takes 20–30
          seconds.
        </p>

        <div className="text-[48px] font-bold text-[#076aff]">{countdown}s</div>

        <p className="text-[14px] text-gray-500">
          Reviewing search intent • Evaluating fit • Building executive summary
        </p>
      </div>
    );
  }

  //
  // ========================================================
  // FINAL RENDER
  // ========================================================
  if (!record) return null;
  const r = record as SpokeRecord;

  return (
    <div className="max-w-[900px] mx-auto py-[32px] space-y-[32px]">
      {/* TITLE */}
      <h1 className="text-[30px] font-bold text-[#10284a]">{r.title}</h1>

      {/* DESCRIPTION */}
      {r.description && (
        <p className="text-[16px] leading-[1.55] text-[#4b5563]">
          {r.description}
        </p>
      )}

      {/* METRICS */}
      <Metrics record={r} />

      {/* WHY IT MATTERS */}
      {r.whyItMatters && <Card title="Why It Matters" text={r.whyItMatters} />}

      {/* LOCAL ANGLE */}
      {r.localAngle && <Card title="Local Angle" text={r.localAngle} />}

      {/* EXECUTIVE BRIEF */}
      {brief && <ExecBriefBlock brief={brief} />}
    </div>
  );
}

//
// ==========================================================
// REUSABLE COMPONENTS
// ==========================================================
function PageMessage({ text }: { text: string }) {
  return <div className="p-8 text-center text-gray-500">{text}</div>;
}

function PageError({ text }: { text: string }) {
  return <div className="p-8 text-center text-red-600">{text}</div>;
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-[20px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px]">
      <h2 className="text-[18px] font-semibold text-[#111827] mb-[6px]">
        {title}
      </h2>
      <p className="text-[15px] text-[#4b5563] leading-[1.55]">{text}</p>
    </div>
  );
}

function Metrics({ record }: { record: SpokeRecord }) {
  return (
    <div className="grid grid-cols-2 gap-[12px] text-[15px] text-[#374151]">
      <Metric label="Hub" value={record.hubNumber} />
      <Metric label="Spoke" value={record.spokeNumber} />
      <Metric label="Intent" value={record.intent} />
      <Metric label="BOS" value={record.bos ?? "—"} />
      <Metric label="KD" value={record.kd ?? "—"} />
      <Metric label="Priority" value={record.priority ?? "—"} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: any }) {
  return (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  );
}

function ExecBriefBlock({ brief }: { brief: ExecBrief }) {
  return (
    <div className="p-[24px] bg-white border border-[#d1d5db] rounded-[12px] shadow-sm space-y-[24px]">
      <h2 className="text-[24px] font-bold text-[#10284a]">Executive Brief</h2>

      <Section title="Audience" text={brief.clientSummary.audience} />
      <Section title="Value" text={brief.clientSummary.value} />
      <Section
        title="How to Use This Content"
        text={brief.clientSummary.howToUseIt}
      />
      <Section
        title="Summary"
        text={brief.clientSummary.whatTheArticleCovers}
      />

      {/* CTAs */}
      {brief.recommendedCTAs?.length > 0 && (
        <details className="border border-[#d1d5db] rounded-[8px]">
          <summary className="cursor-pointer px-4 py-2 bg-[#f9fafb] text-[16px] font-medium">
            Recommended CTAs
          </summary>
          <div className="px-4 py-3 text-[15px] text-[#374151] space-y-2">
            {brief.recommendedCTAs.map((cta, i) => (
              <div key={i}>• {cta}</div>
            ))}
          </div>
        </details>
      )}

      {/* NEXT STEPS */}
      {brief.clientSummary.nextSteps?.length > 0 && (
        <div>
          <h3 className="text-[17px] font-semibold text-[#111827] mb-[6px]">
            Next Steps
          </h3>
          <ul className="list-disc pl-[20px] text-[15px] text-[#4b5563] space-y-[4px]">
            {brief.clientSummary.nextSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  if (!text) return null;

  return (
    <div>
      <h3 className="text-[17px] font-semibold text-[#111827] mb-[4px]">
        {title}
      </h3>
      <p className="text-[15px] text-[#4b5563] leading-[1.55]">{text}</p>
    </div>
  );
}
