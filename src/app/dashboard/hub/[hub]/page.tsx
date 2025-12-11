export const dynamic = "force-dynamic";
export const revalidate = 0;

console.log("PAGE_DEBUG_VERSION_2000 — FILE LOADED");

export default function HubPage({ params }: { params: any }) {
  console.log("PAGE_DEBUG_PARAMS:", params);
  console.log("PAGE_DEBUG_HUB:", params?.hub);
  
  return (
    <div style={{ padding: 40, fontSize: 24 }}>
      PAGE_DEBUG — hub param: {String(params?.hub)}
    </div>
  );
}
