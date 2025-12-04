/* eslint-disable no-unused-vars */

import { NextResponse } from "next/server";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { decodeJwt } from "jose";

/** Extract Cognito sub from cookie */
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
  const { searchParams } = new URL(req.url);
  const spokeId = searchParams.get("spokeId");

  if (!spokeId || !spokeId.includes("-")) {
    return NextResponse.json(
      { error: "Invalid spokeId format. Expected 'hub-spoke'." },
      { status: 400 }
    );
  }

  const [rawHub, rawSpoke] = spokeId.split("-");
  const hubNumber = Number(rawHub);
  const spokeNumber = Number(rawSpoke);

  if (!hubNumber || !spokeNumber) {
    return NextResponse.json(
      { error: "Invalid numeric values in spokeId" },
      { status: 400 }
    );
  }

  const sub = getSubFromCookie(req);
  if (!sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION ?? "us-east-1",
  });

  const cmd = new QueryCommand({
    TableName: process.env.DYNAMO_TABLE_NAME,          // FIXED
    KeyConditionExpression: "ClientID = :c",
    FilterExpression: "HubNumber = :hub AND SpokeNumber = :spoke",
    ExpressionAttributeValues: {
      ":c": { S: `sub#${sub}` },                       // FIXED PK FORMAT
      ":hub": { N: String(hubNumber) },
      ":spoke": { N: String(spokeNumber) },
    },
  });

  const result = await client.send(cmd);

  if (!result.Items || result.Items.length === 0) {
    return NextResponse.json(
      { error: "Spoke not found" },
      { status: 404 }
    );
  }

  const item: any = result.Items[0];

  const rawCategory =
    item.Category?.S ??
    item.category?.S ??
    "informational";

  const intent =
    rawCategory.toLowerCase() === "informational"
      ? "Informational"
      : rawCategory.toLowerCase() === "transactional"
      ? "Transactional"
      : "Edge";

  const record = {
    id: item.SortKey?.S ?? "",
    title: item.Title?.S ?? item.ShortTitle?.S ?? "",
    description: item.WhyItMatters?.S ?? "",
    keywords: item.SearchIntent?.S ?? "",
    intent,
    status: item.Status?.S ?? "draft",
    bos: item.BOS?.N ? Number(item.BOS.N) : null,
    kd: item.KD?.N ? Number(item.KD.N) : null,
    priority: item.Priority?.N ? Number(item.Priority.N) : null,
    localAngle: item.LocalAngle?.S ?? "",
    hubNumber,
    spokeNumber,
  };

  return NextResponse.json(record);
}
