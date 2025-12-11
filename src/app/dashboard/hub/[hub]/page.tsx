export const dynamic = "force-dynamic";
export const revalidate = 0;

console.log("PAGE_DEBUG_VERSION_1000");

export default function HubPage({ params }: { params: { hub: any } }) {
  console.log("PAGE_DEBUG_PARAMS:", params);
  console.log("PAGE_DEBUG_RAW:", params.hub);
  console.log("PAGE_DEBUG_TYPE:", typeof params.hub);

  let hubNumber;

  try {
    hubNumber = parseInt(
      Array.isArray(params.hub) ? params.hub[0] : params.hub,
      10
    );
  } catch (err) {
    console.log("PAGE_DEBUG_PARSE_ERROR:", err);
    hubNumber = NaN;
  }

  console.log("PAGE_DEBUG_PARSED:", hubNumber);

  return (
    <div style={{ padding: 40, fontSize: 24 }}>
      PAGE DEBUG – hubNumber = {String(hubNumber)}
    </div>
  );
}
