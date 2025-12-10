import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { decodeJwt } from "jose";
import { TextDecoder } from "util";
import { cleanMojibake } from "@/lib/cleanMojibake";

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });

const TABLE = process.env.DYNAMO_TABLE_NAME!;
const BUCKET = "8144-6256-0475-omni-reports";

// Proper UTF-8 decoding
async function streamToString(stream: AsyncIterable<Uint8Array>): Promise<string> {
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
      return NextResponse.json({ html: null });
    }

   // 3) Extract S3Key directly (flat)
const s3Key = profile.Item.S3KeyVoice?.S;

if (!s3Key) {
  return NextResponse.json({ html: null });
}

    // 4) Fetch HTML file from S3
    const s3Object = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
      })
    );

    const body = s3Object.Body;
    if (!body) return NextResponse.json({ html: null }, { status: 500 });

    const rawHtml = await streamToString(body as AsyncIterable<Uint8Array>);
    const cleanedHtml = cleanMojibake(rawHtml);

    return NextResponse.json({ html: cleanedHtml });
  } catch (err) {
    console.error("brand-voice Dynamo error:", err);
    return NextResponse.json({ html: null }, { status: 500 });
  }
}
