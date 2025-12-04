// src/app/api/get-brand-data/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    //
    // 1. Parse and validate email
    //
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid email" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase().replace(/\s+/g, "");

    //
    // 2. Validate env variables
    //
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.AIRTABLE_TABLE_ID;
    const token = process.env.AIRTABLE_TOKEN;

    if (!baseId || !tableId || !token) {
      return NextResponse.json(
        { error: "Missing Airtable environment variables" },
        { status: 500 }
      );
    }

    //
    // 3. Build correct Airtable formula
    //
    const formula = encodeURIComponent(
      `LOWER(TRIM({Email})) = "${cleanEmail}"`
    );

    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${formula}`;

    //
    // 4. Fetch Airtable
    //
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    //
    // 5. Handle no record found
    //
    if (!json.records || json.records.length === 0) {
      return NextResponse.json({ found: false });
    }

    const f = json.records[0].fields;

    //
    // 6. Return normalized brand data
    //
    return NextResponse.json({
      found: true,
      audience: f.Audience ?? "",
      icp: f.ICP ?? "",
      brandStatement: f["Brand Statement"] ?? "",

      // Extra brand fields (future-proof)
      tone: f.Tone ?? "",
      keywords: f.Keywords ?? "",
      painPoints: f.PainPoints ?? "",
      valueProps: f.ValueProps ?? "",
      messaging: f.Messaging ?? "",
    });
  } catch (err) {
    console.error("❌ Airtable fetch failed:", err);
    return NextResponse.json(
      { error: "Server error", details: String(err) },
      { status: 500 }
    );
  }
}
