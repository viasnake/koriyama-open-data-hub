import { XMLParser } from "fast-xml-parser";

export type ParsedRssEntry = {
  title: string;
  link: string;
  publishedAt: string | null;
  sourceCategories: string[];
};

export type ParsedRssDocument = {
  format: "rss" | "atom" | "rdf" | "unknown";
  title: string | null;
  entries: ParsedRssEntry[];
};

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
});

export function parseRss(xml: string): ParsedRssEntry[] {
  return parseRssDocument(xml).entries;
}

export function parseRssDocument(xml: string): ParsedRssDocument {
  const document = parser.parse(xml) as {
    rss?: { channel?: { title?: unknown; item?: unknown[] | unknown } };
    feed?: { title?: unknown; entry?: unknown[] | unknown };
    "rdf:RDF"?: { channel?: { title?: unknown }; item?: unknown[] | unknown };
  };

  const format = document.rss ? "rss" : document.feed ? "atom" : document["rdf:RDF"] ? "rdf" : "unknown";
  const title = textValue(document.rss?.channel?.title ?? document.feed?.title ?? document["rdf:RDF"]?.channel?.title);
  const items = normalizeArray(document.rss?.channel?.item ?? document.feed?.entry ?? document["rdf:RDF"]?.item);

  return {
    format,
    title,
    entries: items.flatMap((item) => {
      if (!isRecord(item)) return [];
      const title = textValue(item.title);
      const link = entryLink(item.link);
      if (!title || !link) return [];

      return [
        {
          title,
          link,
          publishedAt: textValue(item.pubDate ?? item.published ?? item.updated ?? item["dc:date"]),
          sourceCategories: sourceCategories(item),
        },
      ];
    }),
  };
}

function sourceCategories(item: Record<string, unknown>): string[] {
  return [
    textValue(item["dc:subject"]),
    textValue(item["nc:category01"]),
    textValue(item["nc:category02"]),
    textValue(item["nc:category03"]),
  ].flatMap((value) => (value ? [value] : []));
}

function normalizeArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  return value == null ? [] : [value];
}

function entryLink(value: unknown): string | null {
  if (Array.isArray(value)) {
    const alternate = value.find((item) => isRecord(item) && (item["@_rel"] == null || item["@_rel"] === "alternate"));
    return textValue(alternate ?? value[0]);
  }
  return textValue(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null;
}

function textValue(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (isRecord(value) && typeof value["#text"] === "string") return value["#text"];
  if (isRecord(value) && typeof value["@_href"] === "string") return value["@_href"];
  return null;
}
