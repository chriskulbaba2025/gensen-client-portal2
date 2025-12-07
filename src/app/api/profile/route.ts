import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { decodeJwt } from "jose";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

function getSub(req: NextRequest) {
  const cookie = req.cookies.get("gensen_session")?.value;
  if (!cookie) return null;

  try {
    const decoded: any = decodeJwt(cookie);
    return decoded.sub || null;
  } catch {
    return null;
  }
}

const TABLE = process.env.DYNAMO_TABLE_NAME!;

export async function GET(req: NextRequest) {
  const sub = getSub(req);
  if (!sub) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const result = await client.send(
    new GetItemCommand({
      TableName: TABLE,
      Key: {
        ClientID: { S: `sub#${sub}` },
        SortKey: { S: "PROFILE" },
      },
    })
  );

  if (!result.Item) return NextResponse.json({});

  const item = {
    Email: result.Item.Email?.S ?? "",
    BusinessName: result.Item.BusinessName?.S ?? "",
    BusinessURL: result.Item.BusinessURL?.S ?? "",
    BrandVoice: result.Item.BrandVoice?.M ?? {},
    Social: result.Item.Social?.M ?? {},
  };

  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const sub = getSub(req);
  if (!sub) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();

  await client.send(
    new PutItemCommand({
      TableName: TABLE,
      Item: {
        ClientID: { S: `sub#${sub}` },
        SortKey: { S: "PROFILE" },
        Email: { S: body.Email ?? "" },
        BusinessName: { S: body.BusinessName ?? "" },
        BusinessURL: { S: body.BusinessURL ?? "" },
        BrandVoice: { M: body.BrandVoice ?? {} },
        Social: { M: body.Social ?? {} },
        UpdatedAt: { S: new Date().toISOString() },
      },
    })
  );

  return NextResponse.json({ ok: true });
}
