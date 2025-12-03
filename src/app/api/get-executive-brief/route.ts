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

    // ---- 1. Fetch the spoke from Dynamo ----
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

    // Normalize Dynamo fields
    const spokeData = {
      title: item.Title?.S ?? "",
      description: item.Description?.S ?? "",
      whyItMatters: item.WhyItMatters?.S ?? "",
      intent: item.Category?.S ?? "",
      bos: item.BOS?.N ?? null,
      kd: item.KD?.N ?? null,
      priority: item.Priority?.N ?? null,
      searchIntent: item.SearchIntent?.S ?? "",
      localAngle: item.LocalAngle?.S ?? "",
      hubNumber: item.HubNumber?.N ? Number(item.HubNumber.N) : null,
      spokeNumber: item.SpokeNumber?.N ? Number(item.SpokeNumber.N) : null,
    };

    // ---- 2. Call the n8n Executive Brief webhook ----
    const webhookUrl =
      "https://primary-production-77e7.up.railway.app/webhook/spoke-brief";

    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spokeData),
    });

    if (!n8nRes.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch Executive Brief",
          status: n8nRes.status,
        },
        { status: 500 }
      );
    }

    const brief = await n8nRes.json();

    return NextResponse.json(brief);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
