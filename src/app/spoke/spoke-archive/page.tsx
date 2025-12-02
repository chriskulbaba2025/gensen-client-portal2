/* eslint-disable no-unused-vars */

import SpokeClient from "./SpokeClient";

export default function SpokePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="min-h-screen p-[40px] bg-[#f9fafb]">
      <SpokeClient hubId={params.id} />
    </main>
  );
}
