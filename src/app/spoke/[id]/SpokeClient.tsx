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

export default function SpokeClient({ hubId }: { hubId: string }) {
  const [grouped, setGrouped] = useState<GroupedItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const hubNumber = Number(hubId);

    fetch("/api/get-spokes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hubNumber }),
    })
      .then((res) => res.json())
      .then((records) => {
        if (!Array.isArray(records)) {
          setError(true);
          return;
        }

        const intents = ["Informational", "Transactional", "Edge"];
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

        setGrouped(groupedData);
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

  if (!grouped) {
    return <p className="text-center mt-[40px]">Loading...</p>;
  }

  return (
    <div>
      <pre>{JSON.stringify(grouped, null, 2)}</pre>
    </div>
  );
}
