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

  // Extract decoded token + email
  let decoded: any = {};
  let email = "";

  try {
    decoded = decodeJwt(token);
    email = decoded.email ?? "";
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Debug mode: return entire decoded token + email
  const urlObj = new URL(req.url);
  if (urlObj.searchParams.get("debug") === "1") {
    return NextResponse.json({
      extracted_email: email,
      decoded_token: decoded,
      note:
        email === ""
          ? "Email is missing in Cognito token. This must be fixed."
          : "Email extracted successfully.",
    });
  }

  // If email is missing, businessName cannot be looked up
  if (!email) {
    return NextResponse.json({ businessName: "" });
  }

  // Airtable settings
  const baseId = process.env.AIRTABLE_BASE_ID!;
  const tableName = "Brand Voice Base";
  const tokenAir = process.env.AIRTABLE_TOKEN!;

  // Airtable filter: match CleanEmail to Cognito email
  const formula = encodeURIComponent(`{CleanEmail} = "${email}"`);

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
    tableName
  )}?filterByFormula=${formula}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tokenAir}`,
    },
    cache: "no-store",
  });

  const json = await response.json();

  // No matching row found
  if (!json.records || json.records.length === 0) {
    return NextResponse.json({
      businessName: "",
    });
  }

  // Extract businessName field
  const businessName = json.records[0].fields.businessName ?? "";

  return NextResponse.json({ businessName });
}
