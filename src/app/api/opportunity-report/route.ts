import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/verifyCognitoJwt';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { cleanMojibake } from '@/lib/cleanMojibake';
import { TextDecoder } from 'util';

const s3 = new S3Client({ region: 'us-east-1' });
const BUCKET = '8144-6256-0475-omni-reports';

// Proper UTF-8 decoding
async function streamToString(stream: AsyncIterable<Uint8Array>): Promise<string> {
  const decoder = new TextDecoder('utf-8');
  let result = '';

  for await (const chunk of stream) {
    result += decoder.decode(chunk, { stream: true });
  }

  result += decoder.decode();
  return result;
}

export async function GET(req: NextRequest) {
  try {
    // 1) Get Cognito JWT
    const token = req.cookies.get('gensen_session')?.value;
    if (!token) return NextResponse.json({ html: null }, { status: 401 });

  const payload = await verifyIdToken(token);
const rawEmail = String(payload.email || "");
const email = rawEmail.trim().toLowerCase().replace(/\s+/g, "");

if (!email) return NextResponse.json({ html: null }, { status: 400 });


    // 2) Query Airtable by CleanEmail
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Responses?filterByFormula={CleanEmail}="${email}"`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
      cache: 'no-store',
    });

    const data = await res.json();
    const record = data.records?.[0];
    if (!record) return NextResponse.json({ html: null });

    // 3) Correct Airtable field: S3 Key Opportunity
    const s3Key = record.fields['S3 Key Opportunity'];
    if (!s3Key) return NextResponse.json({ html: null });

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
    console.error("opportunity-report error:", err);
    return NextResponse.json({ html: null }, { status: 500 });
  }
}
