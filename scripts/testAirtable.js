import Airtable from "airtable";
const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
base(process.env.AIRTABLE_TABLE_ID)
  .select({ maxRecords: 1 })
  .firstPage((err, records) => {
    if (err) {
      console.error("❌ Airtable error:", err);
      return;
    }
    console.log("✅ Airtable connected. First record:");
    console.log(records[0].fields);
  });
