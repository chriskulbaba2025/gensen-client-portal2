import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/verifyCognitoJwt';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { cleanMojibake } from '@/lib/cleanMojibake';

const s3 = new S3Client({ region: 'us-east-1' });
const BUCKET = 'gensen-voice-reports';

// Convert S3 stream → string (safe type)
async function streamToString(
  stream: AsyncIterable<Uint8Array>
): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

export async function GET(req: NextRequest) {
  try {
    // 1. Read Cognito cookie
    const token = req.cookies.get('gensen_session')?.value;
    if (!token) {
      return NextResponse.json({ html: null }, { status: 401 });
    }

    // 2. Decode JWT → email
    const payload = await verifyIdToken(token);
    const email = payload.email;
    if (!email) {
      return NextResponse.json({ html: null }, { status: 400 });
    }

    // 3. Lookup Airtable record by Clean Email
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Responses?filterByFormula={Clean Email}="${email}"`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
      cache: 'no-store',
    });

    const data = await res.json();
    const record = data.records?.[0];
    if (!record) {
      return NextResponse.json({ html: null });
    }

    // 4. Get S3 key
    const s3Key = record.fields['s3OpportunityKey']; // ensure this matches your field name
    if (!s3Key) {
      return NextResponse.json({ html: null });
    }

    // 5. Fetch object from S3
    const s3Object = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
      })
    );

    // 6. Validate Body exists and convert to string
    const body = s3Object.Body;
    if (!body) {
      return NextResponse.json({ html: null }, { status: 500 });
    }

    const rawHtml = await streamToString(body as AsyncIterable<Uint8Array>);

    // 7. Clean mojibake
    const cleanedHtml = cleanMojibake(rawHtml);

    // 8. Return cleaned HTML to client
    return NextResponse.json({ html: cleanedHtml });
  } catch (err) {
    console.error('brand-voice fetch error:', err);
    return NextResponse.json({ html: null }, { status: 500 });
  }
}
