import axios from "axios";

// ─────────────────────────────────────────────
// Environment
// ─────────────────────────────────────────────
const BASE = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!;
const TOKEN = process.env.AIRTABLE_TOKEN!;

const HUBS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_HUBS_TABLE_ID!;
const HUBS_VIEW = process.env.NEXT_PUBLIC_AIRTABLE_HUBS_VIEW_ID!;

const SPOKE_TABLES = Array.from({ length: 10 }, (_, i) => ({
  table: process.env[`NEXT_PUBLIC_AIRTABLE_SPOKE_${i + 1}_TABLE_ID`],
  view: process.env[`NEXT_PUBLIC_AIRTABLE_SPOKE_${i + 1}_VIEW_ID`],
}));

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface AirtableRecord<T> {
  id: string;
  fields: T;
}

interface HubFields {
  Client?: string;
  Keyword_Topic?: string;
  Hub_Description?: string;
  Search_Intent?: string;
  Title?: string;
  URL_Slug?: string;
  Hub_Index?: number;
}

interface SpokeFields {
  Title?: string;
  Keywords?: string;
  "Meta Description"?: string;
  "Search Intent"?: string;
  Status?: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
async function fetchTable<T extends object>(
  tableId: string,
  viewId?: string
): Promise<AirtableRecord<T>[]> {
  const url = `https://api.airtable.com/v0/${BASE}/${tableId}${
    viewId ? `?view=${viewId}&pageSize=100` : ""
  }`;

  const res = await axios.get<{ records: AirtableRecord<T>[] }>(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  return res.data.records;
}

function normalizeIntent(raw: string): "Informational" | "Transactional" | "Edge" {
  const s = raw.trim().toLowerCase();
  if (["informational", "information", "awareness"].includes(s)) return "Informational";
  if (["transactional", "consideration", "conversion"].includes(s)) return "Transactional";
  return "Edge";
}

function normalizeStatus(raw?: string): "published" | "draft" {
  const s = (raw || "draft").trim().toLowerCase();
  return s === "published" ? "published" : "draft";
}

// ─────────────────────────────────────────────
// Hubs
// ─────────────────────────────────────────────
export async function getHubs() {
  try {
    const records = await fetchTable<HubFields>(HUBS_TABLE, HUBS_VIEW);

    return records.map((r) => ({
      id: r.id,
      client: r.fields.Client || "",
      topic: r.fields.Title || r.fields.Keyword_Topic || "",
      description: r.fields.Hub_Description || "",
      intent: r.fields.Search_Intent || "",
      title: r.fields.Title || "",
      slug:
        (r.fields.URL_Slug || r.fields.Title || "")
          ?.trim()
          .toLowerCase()
          .replace(/\s+/g, "-") || "",
      index: Number(r.fields.Hub_Index) || 1,
      value: 10,
    }));
  } catch (err) {
    console.error("❌ getHubs error:", err);
    return [];
  }
}

// ─────────────────────────────────────────────
// Spokes (dynamic by Hub_Index)
// ─────────────────────────────────────────────
export async function getSpokesBySlug(slug: string) {
  try {
    const hubs = await getHubs();
    const hub = hubs.find((h) => h.slug === slug);
    const index = hub?.index || 1;

    const { table, view } = SPOKE_TABLES[index - 1];

    if (!table) {
      console.warn(`⚠️ No spoke table for hub slug: ${slug}`);
      return [];
    }

    const records = await fetchTable<SpokeFields>(table!, view);

    return records.map((r) => ({
      id: r.id,
      title: r.fields.Title || "",
      keywords: r.fields.Keywords || "",
      description: r.fields["Meta Description"] || "",
      intent: normalizeIntent(r.fields["Search Intent"] || ""),
      status: normalizeStatus(r.fields.Status),
    }));
  } catch (err) {
    console.error("❌ getSpokesBySlug error:", err);
    return [];
  }
}
