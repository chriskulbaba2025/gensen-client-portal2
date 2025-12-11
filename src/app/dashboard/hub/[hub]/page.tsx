export const dynamic = "force-dynamic";

import HubClient from "@/app/dashboard/hub/[hub]/HubClient";

console.log("HUB_PAGE_VERSION_003");

export default function HubPage({ params }: { params: { hub: string } }) {
  console.log("HUB_PAGE_PARAMS:", params);
  console.log("HUB_PAGE_HUB_RAW:", params.hub);

  const raw = params.hub;

  const hubNumber = parseInt(Array.isArray(raw) ? raw[0] : raw, 10);

  console.log("HUB_PAGE_HUB_PARSED:", hubNumber);

  return <HubClient hubNumber={hubNumber} />;
}
