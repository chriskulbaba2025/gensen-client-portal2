import HubClient from "./HubClient";

export default function HubPage({ params }: { params: { hub: string } }) {
  return <HubClient hubNumber={Number(params.hub)} />;
}
