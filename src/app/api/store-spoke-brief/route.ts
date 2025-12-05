/* eslint-disable no-unused-vars */

import { NextResponse } from "next/server";
import {
  DynamoDBClient,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { decodeJwt } from "jose";


const REGION = process.env.AWS_REGION ?? "us-east-1";

/** Extract Cognito sub */
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

/** Convert JS → DynamoDB AttributeValue */
function toAttr(val: any): any {
  if (typeof val === "string") return { S: val };
  if (typeof val === "number") return { N: String(val) };
  if (Array.isArray(val))
    return {
      L: val.map((x) => toAttr(x)),
    };
  if (typeof val === "object" && val !== null) {
    const M: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      M[k] = toAttr(v);
    }
    return { M };
  }
  return { NULL: true };
}

export async function POST(req: Request) {
  //
  // 1. Validate user
  //
  const sub = getSubFromCookie(req);
  if (!sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //
  // 2. Parse payload
  //
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const brief = body.brief;
  if (!brief) {
    return NextResponse.json(
      { error: "Missing brief payload" },
      { status: 400 }
    );
  }

  //
  // 3. Generate SortKey
  // MUST be consistent with get-spoke-brief route
  //
  const hubStr = String(brief.hubNumber).padStart(3, "0");
  const spokeStr = String(brief.spokeNumber).padStart(3, "0");
  const timestamp = Date.now();

  const sortKey = `BRIEF#${hubStr}#${spokeStr}#${timestamp}`;

  //
  // 4. Store in DynamoDB
  //
  const client = new DynamoDBClient({ region: REGION });

  const cmd = new PutItemCommand({
    TableName: process.env.DYNAMO_TABLE_NAME,
    Item: {
      ClientID: { S: `sub#${sub}` },
      SortKey: { S: sortKey },
      CreatedAt: { N: String(timestamp) },
      UpdatedAt: { N: String(timestamp) },
      BriefData: toAttr(brief),
    },
  });

  try {
    await client.send(cmd);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Dynamo write failed", details: String(err) },
      { status: 500 }
    );
  }
}
