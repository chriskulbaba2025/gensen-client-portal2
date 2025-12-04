// scripts/migrate-clientid.js

// Load env vars (expects .env.local in project root)
require("dotenv").config({ path: ".env.local" });

const {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");

// Adjust only if these are wrong:
const TABLE_NAME = process.env.DYNAMO_TABLE_NAME || "GensenClientsMain";
const REGION = process.env.AWS_REGION || "us-east-1";

// This is the raw ClientID you showed me
const RAW_SUB = "941874a8-7051-7073-280e-455d1ddbd3a3";
// This is the format your APIs now expect
const PREFIXED_SUB = `sub#${RAW_SUB}`;

async function run() {
  const client = new DynamoDBClient({ region: REGION });

  console.log(`Using table: ${TABLE_NAME}`);
  console.log(`Migrating ClientID from "${RAW_SUB}" → "${PREFIXED_SUB}"`);

  // 1) Read all items for the old ClientID
  const queryRes = await client.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "ClientID = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: RAW_SUB },
      },
    })
  );

  const items = queryRes.Items || [];
  console.log(`Found ${items.length} items to migrate`);

  if (items.length === 0) {
    console.log("Nothing to do. Exiting.");
    return;
  }

  // 2) Write copies with new ClientID
  for (const item of items) {
    const sortKey = item.SortKey?.S;
    if (!sortKey) {
      console.warn("Skipping item with no SortKey:", item);
      continue;
    }

    const newItem = {
      ...item,
      ClientID: { S: PREFIXED_SUB },
    };

    await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: newItem,
      })
    );

    console.log(`➕ Wrote new item: ClientID=${PREFIXED_SUB}, SortKey=${sortKey}`);
  }

  // 3) Delete the old items
  for (const item of items) {
    const sortKey = item.SortKey?.S;
    if (!sortKey) continue;

    await client.send(
      new DeleteItemCommand({
        TableName: TABLE_NAME,
        Key: {
          ClientID: { S: RAW_SUB },
          SortKey: { S: sortKey },
        },
      })
    );

    console.log(`🗑️ Deleted old item: ClientID=${RAW_SUB}, SortKey=${sortKey}`);
  }

  console.log("✅ Migration complete.");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
