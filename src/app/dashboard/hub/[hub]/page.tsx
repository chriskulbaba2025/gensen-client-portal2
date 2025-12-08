import SpokeClient from "./SpokeClient";

export default function HubPage({ params }: { params: { hub: string } }) {
  return <SpokeClient hubId={params.hub} />;
}
