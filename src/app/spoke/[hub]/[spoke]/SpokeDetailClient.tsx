"use client";

import { useEffect, useState } from "react";

interface SpokeDetail {
  id: string;
  title: string;
  description: string;
  intent: string;
  hubNumber: number;
  spokeNumber: number;
}

export default function SpokeDetailClient({
  hub,
  spoke,
}: {
  hub: string;
  spoke: string;
}) {
  const [record, setRecord] = useState<SpokeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const hubNumber = Number(hub);
    const spokeNumber = Number(spoke);

    fetch("/api/get-spoke-detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hubNumber, spokeNumber }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data || data.error) {
          setError(true);
        } else {
          setRecord(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [hub, spoke]);

  if (loading) {
    return (
      <p className="text-center mt-[40px] text-[#4b5563]">
        Loading…
      </p>
    );
  }

  if (error || !record) {
    return (
      <h1 className="text-xl font-bold text-red-600 text-center mt-[40px]">
        Could not load spoke details
      </h1>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-[24px]">
      <h1 className="text-[28px] font-bold text-[#10284a]">
        {record.title}
      </h1>

      <p className="text-[15px] text-[#4b5563] leading-relaxed">
        {record.description || "No description available."}
      </p>

      <div className="p-[16px] rounded-[12px] border border-[#e5e7eb] bg-white shadow-sm">
        <p className="text-[14px] text-[#6b7280]">
          <strong>Funnel Stage:</strong> {record.intent}
        </p>
        <p className="text-[14px] text-[#6b7280] mt-[4px]">
          <strong>Hub:</strong> {record.hubNumber}  
        </p>
        <p className="text-[14px] text-[#6b7280]">
          <strong>Spoke:</strong> {record.spokeNumber}
        </p>
      </div>

      {/* Placeholder for next phase */}
      <div className="p-[20px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[12px]">
        <h2 className="text-[20px] font-semibold text-[#10284a] mb-[8px]">
          Coming Next
        </h2>
        <p className="text-[14px] text-[#4b5563]">
          This page will eventually show:
        </p>
        <ul className="list-disc ml-[20px] text-[14px] text-[#4b5563] mt-[6px]">
          <li>Long-form article draft</li>
          <li>Social snippets (FB, IG, X, LI)</li>
          <li>Media assets</li>
          <li>Metrics and publishing progress</li>
          <li>“Generate content” task panel</li>
        </ul>
      </div>
    </div>
  );
}
