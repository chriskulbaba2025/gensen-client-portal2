import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { decodeJwt } from "jose";
import { cleanMojibake } from "@/lib/cleanMojibake";
import { TextDecoder } from "util";

const s3 = new S3Client({ region: "us-east-1" });
const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION ?? "us-east-1",
});
const BUCKET = "8144-6256-0475-omni-reports";

// Convert S3 stream → UTF-8 string
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

// Extract Cognito sub from cookie
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
    const sub = getSub(req);
    if (!sub) return NextResponse.json({ html: null }, { status: 401 });

    const clientId = `sub#${sub}`;

    // 1) Get PROFILE record for this client
    const profile = await dynamo.send(
      new GetItemCommand({
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: {
          ClientID: { S: clientId },
          SortKey: { S: "PROFILE" },
        },
      })
    );

    if (!profile.Item) {
      console.error("No PROFILE found for", clientId);
      return NextResponse.json({ html: null }, { status: 500 });
    }

    const s3Key = profile.Item.S3KeyOpportunity?.S;
    if (!s3Key) {
      console.error("Missing S3KeyOpportunity for", clientId);
      return NextResponse.json({ html: null }, { status: 500 });
    }

    // 2) Fetch from S3 using the per-client key
    const obj = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
      })
    );

    const body = obj.Body;
    if (!body) {
      return NextResponse.json({ html: null }, { status: 500 });
    }

    const rawHtml = await streamToString(body as AsyncIterable<Uint8Array>);
    const cleaned = cleanMojibake(rawHtml);

    return NextResponse.json({ html: cleaned });
  } catch (err) {
    console.error("Opportunity Map S3 error:", err);
    return NextResponse.json({ html: null }, { status: 500 });
  }
}
