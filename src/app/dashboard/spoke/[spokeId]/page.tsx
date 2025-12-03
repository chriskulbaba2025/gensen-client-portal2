"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SpokeDetailPage() {
  const { spokeId } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/get-single-spoke?spokeId=${spokeId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch(() => setError("Failed to load spoke."))
      .finally(() => setLoading(false));
  }, [spokeId]);

  if (loading) {
    return <p className="text-center mt-[40px] text-[#4b5563]">Loading…</p>;
  }

  if (error || !data) {
    return (
      <p className="text-center mt-[40px] text-red-600">
        {error || "Not found"}
      </p>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto py-[24px] space-y-[24px]">
      <h1 className="text-[28px] font-bold text-[#10284a]">
        {data.title}
      </h1>

      <p className="text-[15px] text-[#4b5563]">
        {data.description}
      </p>

      <div className="grid grid-cols-2 gap-[12px] text-[14px] text-[#374151]">
        <p><strong>Hub:</strong> {data.hubNumber}</p>
        <p><strong>Spoke:</strong> {data.spokeNumber}</p>
        <p><strong>Intent:</strong> {data.intent}</p>
        <p><strong>BOS:</strong> {data.bos}</p>
        <p><strong>KD:</strong> {data.kd}</p>
        <p><strong>Priority:</strong> {data.priority}</p>
      </div>

      {data.whyItMatters && (
        <div className="p-[16px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px]">
          <h2 className="text-[18px] font-semibold text-[#111827] mb-[6px]">
            Why It Matters
          </h2>
          <p className="text-[14px] text-[#4b5563]">{data.whyItMatters}</p>
        </div>
      )}

      {data.localAngle && (
        <div className="p-[16px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px]">
          <h2 className="text-[18px] font-semibold text-[#111827] mb-[6px]">
            Local Angle
          </h2>
          <p className="text-[14px] text-[#4b5563]">{data.localAngle}</p>
        </div>
      )}

      <button
        onClick={() => router.push(`/dashboard/generate/${spokeId}`)}
        className="px-[20px] py-[10px] bg-[#076aff] text-white rounded-[8px] font-medium"
      >
        Generate Content
      </button>
    </div>
  );
}
