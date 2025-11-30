/* eslint-disable no-unused-vars */

import { NextResponse } from "next/server";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { decodeJwt } from "jose";

/** Extract Cognito sub from the session cookie */
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

  /** Query only hub-level records: SpokeNumber = 0 */
  const cmd = new QueryCommand({
    TableName: process.env.DYNAMO_TABLE,
    KeyConditionExpression: "ClientID = :c",
    FilterExpression: "SpokeNumber = :zero",
    ExpressionAttributeValues: {
      ":c": { S: `sub#${sub}` },
      ":zero": { N: "0" },
    },
  });

  const result = await client.send(cmd);

  const hubs =
    result.Items?.map((item: Record<string, any>) => ({
      id: item.SortKey?.S ?? "",
      title: item.Title?.S ?? "",
      hub: item.HubNumber?.N ? Number(item.HubNumber.N) : 0,
    })) ?? [];

  return NextResponse.json(hubs);
}
