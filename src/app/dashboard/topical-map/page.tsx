/* eslint-disable no-unused-vars */

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HubData } from "@/types/HubData";

// Client-only D3 wheel
const HubSpokeChart = dynamic(() => import("@/components/HubSpokeChart"), {
  ssr: false,
});

export default function TopicalMapPage() {
  const [data, setData] = useState<HubData[]>([]);

  useEffect(() => {
    fetch("/api/get-hubs")
      .then((res) => res.json())
      .then((items) => {
        const hubs: HubData[] = items.map(
          (item: Record<string, unknown>) => ({
            id:
              (item as any).SortKey?.S ??
              "",
            title:
              (item as any).Title?.S ??
              "",
            hub: (item as any).HubNumber?.N
              ? Number((item as any).HubNumber.N)
              : 0,
          })
        );

        setData(hubs);
      })
      .catch((err) => console.error("Dynamo get-hubs error:", err));
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-[40px]">
      {data.length > 0 ? (
        <HubSpokeChart data={data} />
      ) : (
        <p className="text-xl text-gray-500">Loading...</p>
      )}
    </div>
  );
}
