import SpokeDetailClient from "./SpokeDetailClient";

export default function SpokeDetailPage({
  params,
}: {
  params: { hub: string; spoke: string };
}) {
  return (
    <main className="min-h-screen p-[40px] bg-[#f9fafb]">
      <SpokeDetailClient hub={params.hub} spoke={params.spoke} />
    </main>
  );
}
