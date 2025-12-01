/* eslint-disable no-unused-vars */

import { NextResponse } from "next/server";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { decodeJwt } from "jose";

function getSubFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("gensen_session="))
    ?.split("=")[1];

  if (!token) return null;

  const decoded: any = decodeJwt(token);
  return decoded.sub || null;
}

export async function POST(req: Request) {
  const { hubNumber } = await req.json();

  if (hubNumber === undefined || hubNumber === null) {
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
    TableName: process.env.DYNAMO_TABLE, // gensen_content
    KeyConditionExpression: "ClientID = :c",
    FilterExpression: "HubNumber = :hub AND SpokeNumber > :zero",
    ExpressionAttributeValues: {
      ":c": { S: `sub#${sub}` },
      ":hub": { N: `${hubNumber}` },
      ":zero": { N: "0" },
    },
  });

  const result = await client.send(cmd);

  const records =
    result.Items?.map((item) => ({
      id: item.SortKey?.S ?? "",
      title: item.Title?.S ?? "",
      keywords: item.SearchIntent?.S ?? "",
      description: item.WhyItMatters?.S ?? "",
      intent: item.Category?.S ?? "",
      status: item.Status?.S ?? "draft",
    })) ?? [];

  return NextResponse.json(records);
}
