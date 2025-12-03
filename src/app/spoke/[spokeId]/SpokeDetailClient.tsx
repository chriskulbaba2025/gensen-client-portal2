"use client";

import { useEffect, useState } from "react";

export default function SpokeDetailClient({ spokeId }: { spokeId: string }) {
  const [spoke, setSpoke] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<any>(null);
  const [error, setError] = useState("");

  // Fetch the spoke record (from your existing get-spokes endpoint)
  useEffect(() => {
    async function loadSpoke() {
      const res = await fetch(`/api/get-single-spoke?spokeId=${spokeId}`);
      const json = await res.json();
      setSpoke(json);
    }
    loadSpoke();
  }, [spokeId]);

  async function generateBrief() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/get-executive-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hubNumber: spoke.hubNumber,
          spokeNumber: spoke.spokeNumber
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to generate brief");
      } else {
        setBrief(json);
      }
    } catch (err: any) {
      setError("Request failed");
    }

    setLoading(false);
  }

  if (!spoke) return <p className="text-center mt-[40px]">Loading topic…</p>;

  return (
    <div className="max-w-[900px] mx-auto py-[30px] space-y-[24px]">
      <h1 className="text-[28px] font-bold text-[#10284a]">
        {spoke.title}
      </h1>

      <p className="text-[15px] text-[#4b5563] max-w-[760px]">
        {spoke.description}
      </p>

      <button
        onClick={generateBrief}
        disabled={loading}
        className="px-[20px] py-[12px] bg-[#076aff] text-white rounded-[8px] hover:bg-[#0654d4] disabled:opacity-50"
      >
        {loading ? "Analyzing topic…" : "Generate Executive Brief"}
      </button>

      {error && (
        <p className="text-red-600 text-[14px] mt-[10px]">{error}</p>
      )}

      {brief && (
        <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[20px] space-y-[16px] shadow-sm mt-[20px]">
          <Section label="Audience Intent" text={brief.audienceIntent} />
          <Section label="Messaging Direction" text={brief.messagingDirection} />
          <Section label="Competitive Patterns" text={brief.competitorAngle} />
          <Section label="Differentiation Strategy" text={brief.differentiation} />
          <Section label="Narrative Positioning" text={brief.narrativePositioning} />
          <Section label="Strategic Content Brief" text={brief.contentBrief} />
          <Section label="Business Activation Strategy" text={brief.ctaStrategy} />
        </div>
      )}
    </div>
  );
}

function Section({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#111827] mb-[6px]">{label}</h2>
      <p className="text-[14px] text-[#4b5563] whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}
