import HubClient from "@/app/dashboard/hub/[hub]/HubClient";

export default function HubPage({ params }: { params: { hub: string } }) {
  console.log("HUB_PAGE_PARAMS:", params);
  console.log("HUB_PAGE_HUB_RAW:", params.hub);
  console.log("HUB_PAGE_HUB_TYPE:", typeof params.hub);

  const hubNumber = Number(params.hub);
  console.log("HUB_PAGE_HUB_PARSED:", hubNumber);

  return <HubClient hubNumber={hubNumber} />;
}
