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

  // 🔥 LOG 1 — Endpoint hit
  console.log("API /get-spokes HIT");

  const body = await req.json();

  // 🔥 LOG 2 — Full body received
  console.log("API /get-spokes received body:", body);

  const { hubNumber } = body;

  // 🔥 LOG 3 — Confirm hubNumber extracted
  console.log("API /get-spokes extracted hubNumber:", hubNumber);

  if (!hubNumber) {
    console.log("API /get-spokes ERROR: Missing hubNumber");
    return NextResponse.json({ error: "Missing hubNumber" }, { status: 400 });
  }

  const sub = getSubFromCookie(req);
  console.log("API /get-spokes Cognito sub:", sub);

  if (!sub) {
    console.log("API /get-spokes ERROR: Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION ?? "us-east-1",
  });

  const prefix = `HUB#${hubNumber}#SPOKE#`;
  console.log("API /get-spokes Query prefix:", prefix);

  const cmd = new QueryCommand({
    TableName: process.env.DYNAMO_TABLE_NAME,
    KeyConditionExpression:
      "ClientID = :c AND begins_with(SortKey, :prefix)",
    ExpressionAttributeValues: {
      ":c": { S: `sub#${sub}` },
      ":prefix": { S: prefix },
    },
  });

  const result = await client.send(cmd);

  // 🔥 LOG 4 — Raw Dynamo result
  console.log("API /get-spokes Dynamo result:", result);

  // 🔥 LOG 5 — Items found
  console.log("API /get-spokes Dynamo Items:", result.Items);

  const records =
    result.Items?.map((item: any) => {
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

      return {
        id: item.SortKey?.S ?? "",
        title: item.Title?.S ?? item.ShortTitle?.S ?? "",
        keywords: item.SearchIntent?.S ?? "",
        description: item.WhyItMatters?.S ?? "",
        intent,
        status: item.Status?.S ?? "draft",
        bos: item.BOS?.N ? Number(item.BOS.N) : null,
        kd: item.KD?.N ? Number(item.KD.N) : null,
        priority: item.Priority?.N ? Number(item.Priority.N) : null,
        localAngle: item.LocalAngle?.S ?? "",
        hubNumber: item.HubNumber?.N ? Number(item.HubNumber.N) : null,
        spokeNumber: item.SpokeNumber?.N ? Number(item.SpokeNumber.N) : null,
        seoValue: item.SEOValue?.S ?? "",
      };
    }) ?? [];

  // 🔥 LOG 6 — Sending back final records
  console.log("API /get-spokes sending back:", records);

  return NextResponse.json(records);
}
