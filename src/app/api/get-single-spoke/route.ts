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
  const spokeId = searchParams.get("spokeId"); // Expect FULL SortKey, e.g. HUB#1#SPOKE#001  (hub unpadded, spoke padded)


  if (!spokeId || !spokeId.startsWith("HUB#")) {
    return NextResponse.json(
      { error: "Invalid spokeId. Expected full SortKey." },
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

  // Query for this exact spoke
  const cmd = new QueryCommand({
    TableName: process.env.DYNAMO_TABLE_NAME,
    KeyConditionExpression: "ClientID = :c AND SortKey = :sk",
    ExpressionAttributeValues: {
      ":c": { S: `sub#${sub}` },
      ":sk": { S: spokeId },
    },
  });

  const result = await client.send(cmd);

  if (!result.Items || result.Items.length === 0) {
    return NextResponse.json({ error: "Spoke not found" }, { status: 404 });
  }

  const item: any = result.Items[0];

  // FULLY ALIGNED WITH FRONTEND INTERFACE + MAPPING TABLE
  const record = {
    id: item.SortKey?.S ?? "",
    title: item.Title?.S ?? item.ShortTitle?.S ?? "",
    description: item.Description?.S ?? "",
    whyItMatters: item.WhyItMatters?.S ?? "",
    keywords: item.SearchIntent?.S ?? "",
    searchIntent: item.SearchIntent?.S ?? "",
    intent: item.Category?.S ?? "informational",
    status: item.Status?.S ?? "",
    hubNumber: item.HubNumber?.N ? Number(item.HubNumber.N) : 0,
    spokeNumber: item.SpokeNumber?.N ? Number(item.SpokeNumber.N) : 0,
    localAngle: item.LocalAngle?.S ?? "",
    bos: item.BOS?.N ? Number(item.BOS.N) : null,
    kd: item.KD?.N ? Number(item.KD.N) : null,
    priority: item.Priority?.N ? Number(item.Priority.N) : null,
  };

  return NextResponse.json(record);
}
