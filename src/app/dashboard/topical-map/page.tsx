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
    fetch("/api/get-hubs")
      .then((res) => res.json())
      .then((items) => {
        // Map correct DynamoDB fields
        const hubs: HubData[] = items.map((item: any) => ({
          id: item.id,
          title: item.title,
          hub: item.hub,
          businessName: item.businessName,
        }));

        setData(hubs);

        // Pick businessName from first hub record
        setBusinessName(hubs[0]?.businessName ?? "");
      })
      .catch((err) => console.error("Dynamo get-hubs error:", err));
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
