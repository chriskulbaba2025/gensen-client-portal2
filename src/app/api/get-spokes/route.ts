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
  const { hubNumber } = await req.json();

  if (!hubNumber) {
    return NextResponse.json({ error: "Missing hubNumber" }, { status: 400 });
  }

  const sub = getSubFromCookie(req);
  if (!sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION ?? "us-east-1",
  });

  const cmd = new QueryCommand({
    TableName: process.env.DYNAMO_TABLE_NAME,   // FIXED
    KeyConditionExpression: "ClientID = :c",
    FilterExpression: "HubNumber = :hub AND SpokeNumber > :zero",
    ExpressionAttributeValues: {
      ":c": { S: `sub#${sub}` },                // FIXED PK FORMAT
      ":hub": { N: `${hubNumber}` },
      ":zero": { N: "0" },
    },
  });

  const result = await client.send(cmd);

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

  return NextResponse.json(records);
}
