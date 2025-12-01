/* eslint-disable no-unused-vars */

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HubData } from "@/types/HubData";

// Client-only D3 wheel
const HubSpokeChart = dynamic<
  { data: HubData[]; businessName: string }
>(() => import("@/components/HubSpokeChart"), {
  ssr: false,
});

export default function TopicalMapPage() {
  const [data, setData] = useState<HubData[]>([]);
  const [businessName, setBusinessName] = useState("");

 useEffect(() => {
  // Load Hubs from Dynamo
  fetch("/api/get-hubs")
    .then((res) => res.json())
    .then((items) => {
      if (!Array.isArray(items)) return;

      const hubs: HubData[] = items.map((item: any) => ({
        id: item.id,
        title: item.title,
        hub: item.hub,
      }));

      setData(hubs);
    })
    .catch((err) => console.error("get-hubs error:", err));

  // Load business name from Airtable
  fetch("/api/get-business-name")
    .then((res) => res.json())
    .then((json) => {
      setBusinessName(json.businessName || "");
    })
    .catch((err) => console.error("get-business-name error:", err));
}, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-[40px]">
      {data.length > 0 ? (
        <HubSpokeChart data={data} businessName={businessName} />
      ) : (
        <p className="text-xl text-gray-500">Loading...</p>
      )}
    </div>
  );
}
