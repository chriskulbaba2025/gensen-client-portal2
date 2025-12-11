export const dynamic = "force-dynamic";

export default function HubPage({ params }: { params: { id: string } }) {
  console.log("HUBPAGE_PARAMS:", params);

  const hubNumber = Number(params.id);
  console.log("HUBPAGE_HUBNUMBER:", hubNumber);

  return <div>HubPage Debug — hubNumber = {String(hubNumber)}</div>;
}
