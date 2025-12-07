import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { decodeJwt } from "jose";
import { cleanMojibake } from "@/lib/cleanMojibake";
import { TextDecoder } from "util";

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: "us-east-1" });

const TABLE = process.env.DYNAMO_TABLE_NAME!;
// Keep your existing bucket for opportunity reports
const BUCKET = "8144-6256-0475-omni-reports";

// Proper UTF-8 decoding
async function streamToString(
  stream: AsyncIterable<Uint8Array>
): Promise<string> {
  const decoder = new TextDecoder("utf-8");
  let result = "";

  for await (const chunk of stream) {
    result += decoder.decode(chunk, { stream: true });
  }

  result += decoder.decode();
  return result;
}

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
    // 1) Get Cognito sub
    const sub = getSub(req);
    if (!sub) return NextResponse.json({ html: null }, { status: 401 });

    // 2) Load PROFILE from Dynamo
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
      return NextResponse.json({ html: null });
    }

    // 3) Extract Opportunity.S3Key
    const opportunity = profile.Item.Opportunity?.M;
    const s3Key = opportunity?.S3Key?.S;

    if (!s3Key) {
      return NextResponse.json({ html: null });
    }

    // 4) Fetch HTML from S3
    const s3Object = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
      })
    );

    const body = s3Object.Body;
    if (!body)
      return NextResponse.json({ html: null }, { status: 500 });

    const rawHtml = await streamToString(
      body as AsyncIterable<Uint8Array>
    );
    const cleanedHtml = cleanMojibake(rawHtml);

    return NextResponse.json({ html: cleanedHtml });
  } catch (err) {
    console.error("opportunity-report Dynamo error:", err);
    return NextResponse.json({ html: null }, { status: 500 });
  }
}
