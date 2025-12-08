import SpokeClient from "./SpokeClient";

export default function HubPage({ params }: { params: { hubId: string } }) {
  return (
    <main className="min-h-screen p-[40px] bg-[#f9fafb]">
      <SpokeClient hubId={params.hubId} />
    </main>
  );
}

