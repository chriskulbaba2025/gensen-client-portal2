/* eslint-disable no-unused-vars */

import { NextResponse } from "next/server";
import { decodeJwt } from "jose";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("gensen_session="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: any = {};
  let email = "";

  try {
    decoded = decodeJwt(token);
    email = decoded.email ?? "";
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const urlObj = new URL(req.url);
  const debug = urlObj.searchParams.get("debug") === "1";

  const baseId = process.env.AIRTABLE_BASE_ID!;
  const tableName = "Brand Voice Base";
  const tokenAir = process.env.AIRTABLE_TOKEN!;

  const formula = `{CleanEmail} = "${email}"`;
  const encodedFormula = encodeURIComponent(formula);

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
    tableName
  )}?filterByFormula=${encodedFormula}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tokenAir}`,
    },
    cache: "no-store",
  });

  const json = await response.json();

  if (debug) {
    return NextResponse.json({
      email_used: email,
      formula_used: formula,
      airtable_response: json
    });
  }

  if (!json.records || json.records.length === 0) {
    return NextResponse.json({ businessName: "" });
  }

  const businessName = json.records[0].fields.businessName ?? "";

  return NextResponse.json({ businessName });
}
