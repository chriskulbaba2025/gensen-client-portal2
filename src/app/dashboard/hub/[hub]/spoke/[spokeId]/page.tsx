import SpokeClient from "./SpokeClient";

export default async function SpokePage({
  params,
}: {
  params: Promise<{ hub: string; spokeId: string }>;
}) {
  const { hub, spokeId } = await params;

  const hubNum = Number(hub);
  const spokeNum = Number(spokeId);

  const hubStr = hubNum.toString().padStart(3, "0");
  const spokeStr = spokeNum.toString().padStart(3, "0");

  const sortKey = `HUB#${hubStr}#SPOKE#${spokeStr}`;

  return (
    <SpokeClient
      hubNum={hubNum}
      spokeNum={spokeNum}
      sortKey={sortKey}
    />
  );
}
