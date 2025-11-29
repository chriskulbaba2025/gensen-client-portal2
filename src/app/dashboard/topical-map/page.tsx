"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getHubs } from "@/lib/airtable";
import { HubData } from "@/types/HubData";

// Client-only D3 wheel
const HubSpokeChart = dynamic(() => import("@/components/HubSpokeChart"), {
  ssr: false,
});

export default function TopicalMapPage() {
  const [data, setData] = useState<HubData[]>([]);

  useEffect(() => {
    getHubs().then((hubs) => setData(hubs));
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
