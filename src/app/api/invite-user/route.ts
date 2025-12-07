import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  DynamoDBClient,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

const cognito = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
});

const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const TABLE = process.env.DYNAMO_TABLE_NAME!;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. CREATE USER IN COGNITO (SUPPRESSED EMAIL)
    const createCommand = new AdminCreateUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: email,
      TemporaryPassword: "TempPass@123!",
      MessageAction: "SUPPRESS",
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
      ],
    });

    const result = await cognito.send(createCommand);

    // Extract Cognito sub
    const attributes = result.User?.Attributes || [];
    const subAttr = attributes.find((a) => a.Name === "sub");
    const cognitoSub = subAttr?.Value;

    if (!cognitoSub) {
      return NextResponse.json(
        { ok: false, error: "User created but Cognito sub missing." },
        { status: 500 }
      );
    }

    // 2. WRITE INITIAL PROFILE RECORD TO DYNAMODB
    await dynamo.send(
      new PutItemCommand({
        TableName: TABLE,
        Item: {
          ClientID: { S: `sub#${cognitoSub}` },
          SortKey: { S: "PROFILE" },
          Email: { S: email },
          BusinessName: { S: "" },      // placeholder, updated later by user
          BusinessURL: { S: "" },       // placeholder
          BrandVoice: { M: {} },        // empty to start
          Social: { M: {} },
          CreatedAt: { S: new Date().toISOString() },
          UpdatedAt: { S: new Date().toISOString() },
        },
        ConditionExpression: "attribute_not_exists(ClientID)", // prevents overwrite
      })
    );

    // 3. RETURN SUCCESS
    return NextResponse.json({
      ok: true,
      message: "User invited and PROFILE created in Dynamo.",
      sub: cognitoSub,
    });

  } catch (error: any) {
    console.error("invite-user error:", error);

    // Cognito user already exists
    if (String(error).includes("UsernameExistsException")) {
      return NextResponse.json(
        {
          ok: false,
          error: "A user with this email already exists.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
