/* eslint-disable no-unused-vars */

import { NextResponse } from "next/server";
import {
  DynamoDBClient,
  QueryCommand,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { decodeJwt } from "jose";

const TABLE_NAME = process.env.DYNAMO_TABLE_NAME ?? "GensenClientsMain";
const REGION = process.env.AWS_REGION ?? "us-east-1";

/** Get Cognito sub from cookie */
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
  //
  // 1. Validate user
  //
  const sub = getSubFromCookie(req);
  if (!sub) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  //
  // 2. Parse query params
  //
  const { searchParams } = new URL(req.url);
  const hub = searchParams.get("hub"); // "01"
  const spoke = searchParams.get("spoke"); // "003"

  if (!hub || !spoke) {
    return NextResponse.json(
      { error: "Missing hub or spoke" },
      { status: 400 }
    );
  }

  const prefix = `BRIEF#${hub}#${spoke}`;

  //
  // 3. Dynamo query for ALL briefs for this spoke
  //
  const client = new DynamoDBClient({ region: REGION });

  const cmd = new QueryCommand({
    TableName: TABLE_NAME,
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
    // 4. Convert DynamoDB → plain JSON
    //
    const item = res.Items[0];
    const out: any = {};

    for (const [key, val] of Object.entries(item)) {
      const v = val as AttributeValue;

      if ("S" in v && v.S !== undefined) {
        out[key] = v.S;
      } else if ("N" in v && v.N !== undefined) {
        out[key] = Number(v.N);
      } else if ("L" in v && v.L !== undefined) {
        // array
        out[key] = v.L.map((x) =>
          "S" in x && x.S !== undefined
            ? x.S
            : "N" in x && x.N !== undefined
            ? Number(x.N)
            : x
        );
      } else if ("M" in v && v.M !== undefined) {
        // map / object
        const child: any = {};
        for (const [ck, cv] of Object.entries(v.M ?? {})) {
          const c = cv as AttributeValue;

          if ("S" in c && c.S !== undefined) {
            child[ck] = c.S;
          } else if ("N" in c && c.N !== undefined) {
            child[ck] = Number(c.N);
          } else if ("L" in c && c.L !== undefined) {
            child[ck] = c.L.map((x) =>
              "S" in x && x.S !== undefined
                ? x.S
                : "N" in x && x.N !== undefined
                ? Number(x.N)
                : x
            );
          }
        }
        out[key] = child;
      }
    }

    return NextResponse.json({ brief: out });
  } catch (err) {
    return NextResponse.json(
      { error: "Dynamo query failed", details: String(err) },
      { status: 500 }
    );
  }
}
