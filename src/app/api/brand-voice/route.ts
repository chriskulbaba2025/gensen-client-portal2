import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/verifyCognitoJwt';

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_API_KEY = process.env.AIRTABLE_TOKEN!;
const TABLE_NAME = 'Responses';

export async function GET(req: NextRequest) {
  try {
    // 1. Read Cognito session cookie
    const token = req.cookies.get('gensen_session')?.value;
    if (!token) {
      return NextResponse.json(
        { reportUrl: null },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // 2. Verify and decode JWT to get user email
    const payload = await verifyIdToken(token);
    const email = payload.email as string;
    if (!email) {
      return NextResponse.json(
        { reportUrl: null },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // 3. Query Airtable for that user's record
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}?filterByFormula={Clean Email}="${email}"`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      cache: 'no-store',
    });
    const data = await res.json();

    // 4. Extract Cognito Report URL (if any)
    const record = data.records?.[0];
    const reportUrl =
      typeof record?.fields['Cognito Report URL'] === 'string'
        ? record.fields['Cognito Report URL']
        : null;

    // 5. Return URL if found; otherwise null to trigger placeholder
    return NextResponse.json(
      { reportUrl },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('brand-voice GET error', err);
    return NextResponse.json(
      { reportUrl: null },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
