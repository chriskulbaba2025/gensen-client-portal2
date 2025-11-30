import { NextResponse } from "next/server";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { decodeJwt } from "jose";

// Get Cognito SUB from cookie token
async function getSubFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("gensen_session="))
    ?.split("=")[1];

  if (!token) return null;

  const decoded = decodeJwt(token);
  return decoded.sub || null;
}

export async function GET(req: Request) {
  const sub = await getSubFromCookie(req);
  if (!sub) {
    return NextResponse.json({ error: "No Cognito sub" }, { status: 401 });
  }

  const client = new DynamoDBClient({ region: "us-east-1" });

  const cmd = new QueryCommand({
    TableName: process.env.DYNAMO_TABLE,
    KeyConditionExpression: "ClientID = :c",
    ExpressionAttributeValues: {
      ":c": { S: `sub#${sub}` },
    },
  });

  const result = await client.send(cmd);

  return NextResponse.json(result.Items || []);
}
