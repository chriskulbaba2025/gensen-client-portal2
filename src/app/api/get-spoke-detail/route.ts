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

export async function POST(req: Request) {
  try {
    const { hubNumber, spokeNumber } = await req.json();

    if (!hubNumber || !spokeNumber) {
      return NextResponse.json(
        { error: "Missing hubNumber or spokeNumber" },
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

    // Ensure format: HUB#001#SPOKE#003
    const hubStr = String(hubNumber).padStart(3, "0");
    const spokeStr = String(spokeNumber).padStart(3, "0");
    const sortKey = `HUB#${hubStr}#SPOKE#${spokeStr}`;

    const cmd = new QueryCommand({
      TableName: process.env.DYNAMO_TABLE_NAME,
      KeyConditionExpression:
        "ClientID = :c AND SortKey = :sk",
      ExpressionAttributeValues: {
        ":c": { S: `sub#${sub}` },     // FIXED partition key
        ":sk": { S: sortKey },
      },
    });

    const result = await client.send(cmd);
    const item = result.Items?.[0];

    if (!item) {
      return NextResponse.json(
        { error: "Spoke not found" },
        { status: 404 }
      );
    }

    // Normalize result safely
    const record = {
      id: item.SortKey?.S ?? "",
      title: item.Title?.S ?? item.ShortTitle?.S ?? "",
      description: item.WhyItMatters?.S ?? "",
      intent: item.Category?.S ?? "Informational",
      hubNumber: Number(item.HubNumber?.N ?? hubNumber),
      spokeNumber: Number(item.SpokeNumber?.N ?? spokeNumber),
      keywords: item.SearchIntent?.S ?? "",
      localAngle: item.LocalAngle?.S ?? "",
      bos: item.BOS?.N ? Number(item.BOS.N) : null,
      kd: item.KD?.N ? Number(item.KD.N) : null,
      priority: item.Priority?.N ? Number(item.Priority.N) : null,
    };

    return NextResponse.json(record);

  } catch (err) {
    console.error("get-spoke-detail error", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
