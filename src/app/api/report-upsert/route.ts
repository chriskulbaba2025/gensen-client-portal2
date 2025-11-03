import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// store once in a simple JSON file (for static cache)
// you can later replace this with Firestore or DynamoDB
export async function POST(req: Request) {
  const body = await req.json();
  const { emailLower, reportUrl } = body;
  if (!emailLower || !reportUrl) {
    return NextResponse.json({ ok: false, error: 'Missing data' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'static-reports.json');
  let data: Record<string, string> = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  // write once
  data[emailLower] = reportUrl;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return NextResponse.json({ ok: true });
}
