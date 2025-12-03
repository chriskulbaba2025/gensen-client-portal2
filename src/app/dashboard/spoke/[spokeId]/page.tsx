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
  whyItMatters: string; // <-- ADD THIS
}


export default function SpokeDetailPage({
  params,
}: {
  params: { spokeId: string };
}) {
  const [record, setRecord] = useState<SpokeRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const spokeId = params.spokeId;

  useEffect(() => {
    async function load() {
      if (!spokeId || !spokeId.includes("-")) {
        setError("Invalid spokeId format");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/get-single-spoke?spokeId=${spokeId}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load spoke");
          setLoading(false);
          return;
        }

        setRecord(data);
        setLoading(false);
      } catch {
        setError("Network error loading spoke");
        setLoading(false);
      }
    }

    load();
  }, [spokeId]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading…</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!record) {
    return <div className="p-6 text-center text-red-600">No data found</div>;
  }

  return (
  <div className="max-w-[900px] mx-auto py-[24px] space-y-[24px]">
    <h1 className="text-[28px] font-bold text-[#10284a]">
      {record.title}
    </h1>

    {record.description && (
      <p className="text-[15px] text-[#4b5563]">
        {record.description}
      </p>
    )}

    <div className="grid grid-cols-2 gap-[12px] text-[14px] text-[#374151]">
      <p><strong>Hub:</strong> {record.hubNumber}</p>
      <p><strong>Spoke:</strong> {record.spokeNumber}</p>
      <p><strong>Intent:</strong> {record.intent}</p>
      <p><strong>BOS:</strong> {record.bos ?? "—"}</p>
      <p><strong>KD:</strong> {record.kd ?? "—"}</p>
      <p><strong>Priority:</strong> {record.priority ?? "—"}</p>
    </div>

    {record.whyItMatters && (
      <div className="p-[16px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px]">
        <h2 className="text-[18px] font-semibold text-[#111827] mb-[6px]">
          Why It Matters
        </h2>
        <p className="text-[14px] text-[#4b5563]">{record.whyItMatters}</p>
      </div>
    )}

    {record.localAngle && (
      <div className="p-[16px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px]">
        <h2 className="text-[18px] font-semibold text-[#111827] mb-[6px]">
          Local Angle
        </h2>
        <p className="text-[14px] text-[#4b5563]">{record.localAngle}</p>
      </div>
    )}
  </div>
);
}
