import { NextResponse } from 'next/server';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
});

// Airtable
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE_ID!;
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN!;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. CREATE USER IN COGNITO WITH CUSTOM TEMP PASSWORD (NO EMAIL SENT)
    const createCommand = new AdminCreateUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: email,
      TemporaryPassword: "TempPass@123!",   // ← FIXED TEMP PASSWORD
      MessageAction: "SUPPRESS",            // ← disables Cognito emails
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },  // allowed to log in
      ],
    });

    const result = await client.send(createCommand);

    // Extract Cognito sub
    const attributes = result.User?.Attributes || [];
    const subAttr = attributes.find((a) => a.Name === "sub");
    const cognitoSub = subAttr?.Value;

    if (!cognitoSub) {
      return NextResponse.json(
        { ok: false, error: "Cognito user created but sub not returned." },
        { status: 500 }
      );
    }

    // 2. UPSERT INTO AIRTABLE (only section changed)
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          performUpsert: {
            fieldsToMergeOn: ["Email"],
          },
          records: [
            {
              fields: {
                Email: email,
                cognito_sub: cognitoSub,
              },
            },
          ],
          typecast: true,
        }),
      }
    );

    const airtableJson = await airtableRes.json();

    if (!airtableRes.ok) {
      console.error("Airtable error:", airtableJson);
      return NextResponse.json(
        { ok: false, error: "Failed to update Airtable." },
        { status: 500 }
      );
    }

    // 3. RETURN TO FRONTEND
    return NextResponse.json({
      ok: true,
      message: "User created silently with temporary password and saved to Airtable.",
      sub: cognitoSub,
      airtable: airtableJson,
    });

  } catch (error) {
    console.error('Error creating user:', error);

    const errMsg = error instanceof Error ? error.message : 'Unknown error';

    if (errMsg.includes('UsernameExistsException')) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'A user with this email already exists. Try signing in instead.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: errMsg },
      { status: 500 }
    );
  }
}
