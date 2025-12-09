import SpokeClient from "./SpokeClient";

export default async function SpokePage({
  params,
}: {
  params: { hub: string; spokeId: string };
}) {
  const { hub, spokeId } = params;

  const hubNum = Number(hub);
  const spokeNum = Number(spokeId);

  const hubStr = hubNum.toString();                       // no padding
  const spokeStr = spokeNum.toString().padStart(3, "0");  // padded

  const sortKey = `HUB#${hubStr}#SPOKE#${spokeStr}`;

  return (
    <SpokeClient
      hubNum={hubNum}
      spokeNum={spokeNum}
      sortKey={sortKey}
    />
  );
}
