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
  try {
    const { searchParams } = new URL(req.url);
    const spokeId = searchParams.get("spokeId");

    if (!spokeId) {
      return NextResponse.json(
        { error: "Missing spokeId" },
        { status: 400 }
      );
    }

    const sub = getSubFromCookie(req);
    if (!sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ---- Parse spokeId format ----
    // You pass something like "1-5" → hub 1, spoke 5
    const [hubNumberStr, spokeNumberStr] = spokeId.split("-");
    const hubNumber = Number(hubNumberStr);
    const spokeNumber = Number(spokeNumberStr);

    if (!hubNumber || !spokeNumber) {
      return NextResponse.json(
        { error: "Invalid spokeId format" },
        { status: 400 }
      );
    }

    // ---- Query Dynamo ----
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION ?? "us-east-1",
    });

    const cmd = new QueryCommand({
      TableName: process.env.DYNAMO_TABLE,
      KeyConditionExpression: "ClientID = :c",
      FilterExpression:
        "HubNumber = :h AND SpokeNumber = :s",
      ExpressionAttributeValues: {
        ":c": { S: sub },
        ":h": { N: `${hubNumber}` },
        ":s": { N: `${spokeNumber}` },
      },
    });

    const result = await client.send(cmd);

    if (!result.Items || result.Items.length === 0) {
      return NextResponse.json(
        { error: "Spoke not found" },
        { status: 404 }
      );
    }

    const item = result.Items[0];

    // ---- Normalize Dynamo fields for UI ----
    const spoke = {
      id: item.SortKey?.S ?? "",
      title: item.Title?.S ?? item.ShortTitle?.S ?? "",
      description: item.Description?.S ?? item.WhyItMatters?.S ?? "",
      keywords: item.SearchIntent?.S ?? "",
      category: item.Category?.S ?? "",
      status: item.Status?.S ?? "draft",
      intent: item.Category?.S ?? "",
      bos: item.BOS?.N ?? null,
      kd: item.KD?.N ?? null,
      priority: item.Priority?.N ?? null,
      localAngle: item.LocalAngle?.S ?? "",
      searchIntent: item.SearchIntent?.S ?? "",
      hubNumber: item.HubNumber?.N ? Number(item.HubNumber.N) : null,
      spokeNumber: item.SpokeNumber?.N ? Number(item.SpokeNumber.N) : null,
      whyItMatters: item.WhyItMatters?.S ?? "",
    };

    return NextResponse.json(spoke);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
