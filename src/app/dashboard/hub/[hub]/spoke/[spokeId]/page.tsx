import SpokeClient from "./SpokeClient";

export default function SpokePage({
  params,
}: {
  params: { hub: string; spokeId: string };
}) {
  const hubNum = Number(params.hub);

  // spokeId is already the FULL SortKey, do NOT parse it
  const sortKey = decodeURIComponent(params.spokeId);

  return (
    <SpokeClient
      hubNum={hubNum}
      spokeNum={0}              // not used anymore, can remove later
      sortKey={sortKey}
    />
  );
}
