/* eslint-disable no-unused-vars */

import { NextResponse } from "next/server";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { decodeJwt } from "jose";

function getSubFromCookie(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("gensen_session="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const decoded: any = decodeJwt(token);
    return decoded.sub || null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const sub = getSubFromCookie(req);
  if (!sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION ?? "us-east-1",
  });

  const cmd = new QueryCommand({
    TableName: process.env.DYNAMO_TABLE_NAME,
    KeyConditionExpression:
      "ClientID = :c AND begins_with(SortKey, :prefix)",
    ExpressionAttributeValues: {
      ":c": { S: `sub#${sub}` },   // REQUIRED format
      ":prefix": { S: "HUB#" },
    },
  });

  let result;
try {
  result = await client.send(cmd);
} catch (err) {
  console.error("Dynamo get-hubs error:", err);
  return NextResponse.json(
    { error: "dynamo_failed", details: String(err) },
    { status: 500 }
  );
}


  // Correct hub detection: HUB# + 3 digits ONLY
  const onlyHubs =
    result.Items?.filter((item: any) => {
      const sk = item.SortKey?.S ?? "";
      return /^HUB#[0-9]{3}$/.test(sk);
    }) ?? [];

  const hubs = onlyHubs.map((item: any) => ({
    id: item.SortKey.S,
    title: item.Title?.S ?? item.ShortTitle?.S ?? "",
    hub: item.HubNumber?.N ? Number(item.HubNumber.N) : 0,
    businessName: item.BusinessName?.S ?? "",  // FIXED attribute name
  }));

  return NextResponse.json(hubs);
}
