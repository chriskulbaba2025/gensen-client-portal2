import { NextRequest, NextResponse } from 'next/server';

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_API_KEY = process.env.AIRTABLE_TOKEN!;

const TABLE_NAME = "Responses"; // Airtable table

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${process.env.N8N_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, reportUrl } = await req.json();
    if (!email || !reportUrl)
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    // find record by Clean Email
    const findUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}?filterByFormula={Clean Email}="${email}"`;
    const findRes = await fetch(findUrl, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });

    const findData = await findRes.json();
    const recordId = findData.records?.[0]?.id;

    if (!recordId)
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });

    // update Cognito Report URL
    await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}/${recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: { 'Cognito Report URL': reportUrl },
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Upsert error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
