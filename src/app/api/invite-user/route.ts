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
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'false' },
      ],
      DesiredDeliveryMediums: ['EMAIL'], // sends the invitation email
    });

    const result = await client.send(command);

    return NextResponse.json({
      ok: true,
      message: `Invitation sent to ${email}.`,
      result,
    });
  } catch (error) {
    console.error('Error creating user:', error);

    const errMsg = error instanceof Error ? error.message : 'Unknown error';

    // Common Cognito error: user already exists
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
