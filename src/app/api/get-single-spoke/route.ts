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

    // ✅ Added for consistency across all routes
    console.log("COGNITO SUB EXTRACTED:", decoded.sub);

    return decoded.sub || null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const spokeId = searchParams.get("spokeId");

  console.log("API_GET_SINGLE_SPOKE_RECEIVED:", spokeId);

  if (!spokeId || !spokeId.startsWith("HUB#")) {
    console.log("API_GET_SINGLE_SPOKE_INVALID:", spokeId);
    return NextResponse.json(
      { error: "Invalid spokeId. Expected full SortKey." },
      { status: 400 }
    );
  }

  const sub = getSubFromCookie(req);
  if (!sub) {
    console.log("API_GET_SINGLE_SPOKE_UNAUTHORIZED");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("API_GET_SINGLE_SPOKE_QUERY_KEYS:", {
    ClientID: `sub#${sub}`,
    SortKey: spokeId,
  });

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION ?? "us-east-1",
  });

  const cmd = new QueryCommand({
    TableName: process.env.DYNAMO_TABLE_NAME,
    KeyConditionExpression: "ClientID = :c AND SortKey = :sk",
    ExpressionAttributeValues: {
      ":c": { S: `sub#${sub}` },
      ":sk": { S: spokeId },
    },
  });

  let result;
  try {
    result = await client.send(cmd);

    // ✅ Added: formatted, readable Dynamo output
    console.log(
      "API_GET_SINGLE_SPOKE_DYNAMO_RESULT_FULL:",
      JSON.stringify(result, null, 2)
    );

  } catch (err) {
    console.error("API_GET_SINGLE_SPOKE_DYNAMO_ERROR:", err);
    return NextResponse.json(
      { error: "dynamo_failed", details: String(err) },
      { status: 500 }
    );
  }

  if (!result.Items || result.Items.length === 0) {
    console.log("API_GET_SINGLE_SPOKE_NOT_FOUND:", spokeId);
    return NextResponse.json({ error: "Spoke not found" }, { status: 404 });
  }

  const item: any = result.Items[0];

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

  console.log("API_GET_SINGLE_SPOKE_FINAL_RECORD:", record);

  return NextResponse.json(record);
}
