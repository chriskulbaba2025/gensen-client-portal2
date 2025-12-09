import SpokeClient from "./SpokeClient";

export default function SpokePage({
  params,
}: {
  params: { hub: string; spokeId: string };
}) {

  console.log("SPOKE_PAGE_PARAMS:", params);

  const hubNum = Number(params.hub);

  // spokeId is the FULL SortKey (e.g. HUB#1#SPOKE#001)
  const sortKey = decodeURIComponent(params.spokeId);

  console.log("SPOKE_PAGE_SORTKEY_DECODED:", sortKey);
  console.log("SPOKE_PAGE_PASSING_TO_CLIENT:", {
    hubNum,
    sortKey,
  });

  return (
    <SpokeClient
      hubNum={hubNum}
      spokeNum={0}     // not used anymore (safe to remove later)
      sortKey={sortKey}
    />
  );
}
