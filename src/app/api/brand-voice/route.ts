import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/verifyCognitoJwt';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
// REMOVED: import { cleanMojibake } from '@/lib/cleanMojibake';
import { TextDecoder } from 'util';

const s3 = new S3Client({ region: 'us-east-1' });
const BUCKET = '8144-6256-0475-omni-reports';

// Proper UTF-8 decoding for S3 streams
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
    // 1) Cognito login → decode JWT
    const token = req.cookies.get('gensen_session')?.value;
    if (!token) return NextResponse.json({ html: null }, { status: 401 });

    const payload = await verifyIdToken(token);
    const email = payload.email;
    if (!email) return NextResponse.json({ html: null }, { status: 400 });

    // 2) Pull S3 key from Airtable (field is "CleanEmail")
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Responses?filterByFormula={CleanEmail}="${email}"`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
      cache: 'no-store',
    });

    const data = await res.json();
    const record = data.records?.[0];
    if (!record) return NextResponse.json({ html: null });

    // Your correct Airtable field for S3 voice report
    const s3Key = record.fields['S3 Key Voice'];
    if (!s3Key) return NextResponse.json({ html: null });

    // 3) Fetch HTML file from S3 bucket
    const s3Object = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
      })
    );

    const body = s3Object.Body;
    if (!body) return NextResponse.json({ html: null }, { status: 500 });

    // 4) Decode S3 content properly as UTF-8
    const rawHtml = await streamToString(body as AsyncIterable<Uint8Array>);

    // 5) Bypass all cleaning and return raw HTML directly
    // const cleanedHtml = cleanMojibake(rawHtml); // <-- Removed original line
    
    // 6) Return raw HTML to frontend
    return NextResponse.json({ html: rawHtml });

  } catch (err) {
    console.error("brand-voice fetch error:", err);
    return NextResponse.json({ html: null }, { status: 500 });
  }
}