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
        const hubs: HubData[] = items.map((item: any) => ({
          id: item.SortKey.S,
          title: item.Title?.S ?? "",
          hub: item.HubNumber?.N ? Number(item.HubNumber.N) : 0,
        }));

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
