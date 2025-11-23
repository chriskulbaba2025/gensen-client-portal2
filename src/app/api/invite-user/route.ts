import { NextResponse } from 'next/server';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const command = new AdminCreateUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: email,
      MessageAction: "SUPPRESS",            // ← prevents ALL emails
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },   // ← allows login later without verification step
      ],
    });

    const result = await client.send(command);

    return NextResponse.json({
      ok: true,
      message: `User created silently. No email was sent.`,
      result,
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
