import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    table: process.env.DYNAMO_TABLE,
    region: process.env.AWS_REGION,
  });
}
