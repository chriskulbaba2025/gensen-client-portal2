// src/app/api/get-brand-data/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // ✅ ensures .env variables load properly in Next.js App Router
export const dynamic = 'force-dynamic'; // ✅ disables Next.js caching for dynamic requests

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const cleanEmail = email.trim().replace(/\s+/g, '');
const formula = `LOWER(TRIM({Email}))="${cleanEmail.toLowerCase()}"`;
const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}?filterByFormula=${encodeURIComponent(formula)}`;


    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
      cache: 'no-store',
    });

    const data = await res.json();
    if (!data.records?.length) {
      return NextResponse.json({ found: false });
    }

    const record = data.records[0].fields;
    return NextResponse.json({
      found: true,
      audience: record.Audience || '',
      icp: record.ICP || '',
      brandStatement: record['Brand Statement'] || '',
    });
  } catch (err) {
    console.error('❌ Airtable fetch failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
