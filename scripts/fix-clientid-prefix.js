import { DynamoDBClient, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

async function run() {
  const table = process.env.DYNAMO_TABLE_NAME ?? "GensenClientsMain";

  console.log("Scanning table:", table);

  const scan = await client.send(
    new ScanCommand({
      TableName: table,
    })
  );

  for (const item of scan.Items ?? []) {
    const oldId = item.ClientID.S;

    if (oldId.startsWith("sub#")) {
      console.log("Already correct →", oldId);
      continue;
    }

    const newId = `sub#${oldId}`;

    console.log("Fixing:", oldId, "→", newId);

    await client.send(
      new UpdateItemCommand({
        TableName: table,
        Key: {
          ClientID: { S: oldId },
          SortKey: item.SortKey,
        },
        UpdateExpression: "SET ClientID = :newId",
        ExpressionAttributeValues: {
          ":newId": { S: newId },
        },
      })
    );
  }

  console.log("Done.");
}

run();
