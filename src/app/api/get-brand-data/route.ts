import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { decodeJwt } from "jose";

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLE = process.env.DYNAMO_TABLE_NAME!;

function getSub(req: NextRequest): string | null {
  const token = req.cookies.get("gensen_session")?.value;
  if (!token) return null;

  try {
    const decoded: any = decodeJwt(token);
    return decoded.sub || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1) Extract Cognito sub
    const sub = getSub(req);
    if (!sub) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    // 2) Load PROFILE record from Dynamo
    const profile = await dynamo.send(
      new GetItemCommand({
        TableName: TABLE,
        Key: {
          ClientID: { S: `sub#${sub}` },
          SortKey: { S: "PROFILE" },
        },
      })
    );

    if (!profile.Item) {
      return NextResponse.json({ businessName: "" });
    }

    // 3) Extract business name (and brand URL if needed)
    const businessName = profile.Item.BusinessName?.S ?? "";
    const businessURL = profile.Item.BusinessURL?.S ?? "";

    return NextResponse.json({
      businessName,
      businessURL,
    });
  } catch (err) {
    console.error("get-business-name Dynamo error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
