/* eslint-disable no-unused-vars */

import { NextResponse } from "next/server";
import {
  DynamoDBClient,
  QueryCommand,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { decodeJwt } from "jose";


const REGION = process.env.AWS_REGION ?? "us-east-1";

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

/** Safe conversion for ANY DynamoDB AttributeValue */
function convertDynamo(val: AttributeValue): any {
  if (!val) return null;

  if ("S" in val && val.S !== undefined) return val.S;
  if ("N" in val && val.N !== undefined) return Number(val.N);

  if ("BOOL" in val && val.BOOL !== undefined) return val.BOOL;

  if ("NULL" in val && val.NULL !== undefined) return null;

  if ("L" in val && Array.isArray(val.L)) {
    return val.L.map((item) => convertDynamo(item));
  }

  if ("M" in val && val.M) {
    const out: any = {};
    for (const [childKey, childVal] of Object.entries(val.M)) {
      out[childKey] = convertDynamo(childVal as AttributeValue);
    }
    return out;
  }

  return null;
}

export async function GET(req: Request) {
  //
  // 1. Validate user
  //
  const sub = getSubFromCookie(req);
  if (!sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //
  // 2. Parse query params
  //
  const { searchParams } = new URL(req.url);
  const hub = searchParams.get("hub");   // must be padded: "001"
  const spoke = searchParams.get("spoke"); // must be padded: "003"

  if (!hub || !spoke) {
    return NextResponse.json(
      { error: "Missing hub or spoke" },
      { status: 400 }
    );
  }

  const prefix = `BRIEF#${hub}#${spoke}`;

  //
  // 3. Query Dynamo
  //
  const client = new DynamoDBClient({ region: REGION });

  const cmd = new QueryCommand({
    TableName: process.env.DYNAMO_TABLE_NAME,
    KeyConditionExpression:
      "ClientID = :pk AND begins_with(SortKey, :prefix)",
    ExpressionAttributeValues: {
      ":pk": { S: `sub#${sub}` },
      ":prefix": { S: prefix },
    },
    ScanIndexForward: false, // newest first
  });

  try {
    const res = await client.send(cmd);

    if (!res.Items || res.Items.length === 0) {
      return NextResponse.json({ brief: null });
    }

    //
    // 4. Convert Dynamo item → fully normalized JSON
    //
    const item = res.Items[0];
    const out: any = {};

    for (const [key, val] of Object.entries(item)) {
      out[key] = convertDynamo(val as AttributeValue);
    }

    return NextResponse.json({ brief: out });
  } catch (err) {
    return NextResponse.json(
      { error: "Dynamo query failed", details: String(err) },
      { status: 500 }
    );
  }
}
