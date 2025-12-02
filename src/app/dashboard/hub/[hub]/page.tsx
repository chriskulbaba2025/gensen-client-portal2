import SpokeClient from "./SpokeClient";

export default function HubPage({ params }: { params: { hub: string } }) {
  return (
    <main className="min-h-screen p-[40px] bg-[#f9fafb]">
      <SpokeClient hubId={params.hub} />
    </main>
  );
}
