import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { decodeJwt } from "jose";
import { cleanMojibake } from "@/lib/cleanMojibake";
import { TextDecoder } from "util";

const s3 = new S3Client({ region: "us-east-1" });
const BUCKET = "8144-6256-0475-omni-reports";

// Convert S3 stream → UTF-8 string
async function streamToString(stream: AsyncIterable<Uint8Array>): Promise<string> {
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

    // FINAL NEW CANONICAL S3 PATH
    const clientId = `sub#${sub}`;
    const s3Key = `content/${clientId}/reports/opportunity/latest.html`;

    // Fetch from S3
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
