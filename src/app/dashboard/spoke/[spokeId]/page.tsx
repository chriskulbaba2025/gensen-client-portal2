/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";

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
}

interface ExecBrief {
  audienceIntent: string;
  whyThisMatters: string;
  howToUseThisContent: string;
  contentSummary: string;
  recommendedCTAs: string[];
  clientSummary: any;
}

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

  // ----------------------------
  // 1. Load Dynamo Spoke Record
  // ----------------------------
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

  // ----------------------------
  // 2. Trigger n8n Executive Brief Hook
  // ----------------------------
  useEffect(() => {
    if (!record) return;

    async function runBrief() {
      setLoadingBrief(true);

      // start countdown
      setCountdown(30);
      const interval = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      try {
        const res = await fetch(
          "https://primary-production-77e7.up.railway.app/webhook/spoke-brief",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(record),
          }
        );

        const data = await res.json();

        setBrief(data);
        setLoadingBrief(false);
      } catch (err) {
        setError("Failed to load Executive Brief");
        setLoadingBrief(false);
      }
    }

    runBrief();
  }, [record]);

  // ----------------------------
  // UI STATES
  // ----------------------------
  if (loadingRecord) {
    return <div className="p-6 text-center text-gray-500">Loading…</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!record) {
    return <div className="p-6 text-center text-red-600">No data found</div>;
  }

  // ----------------------------
  // LOADING BRIEF SCREEN (Timer)
  // ----------------------------
  if (loadingBrief || (!brief && countdown > 0)) {
    return (
      <div className="max-w-[900px] mx-auto py-[40px] text-center space-y-[20px]">
        <h2 className="text-[22px] font-semibold text-[#10284a]">
          Analyzing your topic…
        </h2>

        <p className="text-[15px] text-gray-600">
          We’re running a strategic analysis.  
          This usually takes **20–30 seconds**.
        </p>

        <div className="text-[42px] font-bold text-[#076aff]">
          {countdown}s
        </div>

        <p className="text-[14px] text-gray-500">
          Reviewing search intent • Evaluating fit • Building executive summary
        </p>
      </div>
    );
  }

  // ----------------------------
  // FINAL PAGE UI (Record + Executive Brief)
  // ----------------------------
  return (
    <div className="max-w-[900px] mx-auto py-[24px] space-y-[32px]">
      {/* HEADLINE */}
      <h1 className="text-[28px] font-bold text-[#10284a]">{record.title}</h1>

      {/* DESCRIPTION */}
      {record.description && (
        <p className="text-[15px] text-[#4b5563]">{record.description}</p>
      )}

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 gap-[12px] text-[14px] text-[#374151]">
        <p>
          <strong>Hub:</strong> {record.hubNumber}
        </p>
        <p>
          <strong>Spoke:</strong> {record.spokeNumber}
        </p>
        <p>
          <strong>Intent:</strong> {record.intent}
        </p>
        <p>
          <strong>BOS:</strong> {record.bos ?? "—"}
        </p>
        <p>
          <strong>KD:</strong> {record.kd ?? "—"}
        </p>
        <p>
          <strong>Priority:</strong> {record.priority ?? "—"}
        </p>
      </div>

      {/* WHY IT MATTERS */}
      {record.whyItMatters && (
        <div className="p-[16px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px]">
          <h2 className="text-[18px] font-semibold text-[#111827] mb-[6px]">
            Why It Matters
          </h2>
          <p className="text-[14px] text-[#4b5563]">{record.whyItMatters}</p>
        </div>
      )}

      {/* LOCAL ANGLE */}
      {record.localAngle && (
        <div className="p-[16px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px]">
          <h2 className="text-[18px] font-semibold text-[#111827] mb-[6px]">
            Local Angle
          </h2>
          <p className="text-[14px] text-[#4b5563]">{record.localAngle}</p>
        </div>
      )}

      {/* EXECUTIVE BRIEF BLOCK */}
      {brief && (
        <div className="p-[20px] bg-white border border-[#d1d5db] rounded-[12px] shadow-sm space-y-[18px]">
          <h2 className="text-[22px] font-bold text-[#10284a]">
            Executive Brief
          </h2>

          <Section title="Audience" text={brief.audienceIntent} />
          <Section title="Why This Matters" text={brief.whyThisMatters} />
          <Section title="How to Use This Content" text={brief.howToUseThisContent} />
          <Section title="Summary" text={brief.contentSummary} />
        </div>
      )}
    </div>
  );
}

// Reusable section UI
function Section({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <div>
      <h3 className="text-[17px] font-semibold text-[#111827] mb-[4px]">
        {title}
      </h3>
      <p className="text-[14px] text-[#4b5563]">{text}</p>
    </div>
  );
}
