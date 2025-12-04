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
    TableName: process.env.DYNAMO_TABLE_NAME ?? "GensenClientsMain",
    KeyConditionExpression:
      "ClientID = :c AND begins_with(SortKey, :prefix)",
    ExpressionAttributeValues: {
      ":c": { S: `sub#${sub}` },   // FIXED PARTITION KEY
      ":prefix": { S: "HUB#" },
    },
  });

  const result = await client.send(cmd);

  const onlyHubs =
    result.Items?.filter((item: any) => item.SortKey?.S.length === 7) ?? [];

  const hubs = onlyHubs.map((item: any) => ({
    id: item.SortKey.S,
    title: item.Title?.S ?? item.ShortTitle?.S ?? "",
    hub: Number(item.HubNumber?.N ?? 0),
    businessName: item.businessName?.S ?? "",
  }));

  return NextResponse.json(hubs);
}
