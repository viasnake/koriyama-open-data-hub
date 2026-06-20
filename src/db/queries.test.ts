import { describe, expect, it } from "vitest";
import { resolveRssEntryUpsertIds, type RssEntryUpsert } from "./queries";

function entry(input: Partial<RssEntryUpsert> & Pick<RssEntryUpsert, "id" | "sourceHash">): RssEntryUpsert {
  return {
    feedId: "feed-1",
    title: "Entry",
    link: "https://example.com/news/1",
    publishedAt: "2026-06-20T00:00:00.000Z",
    fetchedAt: "2026-06-20T01:00:00.000Z",
    category: null,
    tags: [],
    canonicalUrl: null,
    ...input,
  };
}

describe("resolveRssEntryUpsertIds", () => {
  it("reuses an existing id matched by source hash", () => {
    const [resolved] = resolveRssEntryUpsertIds(
      [entry({ id: "rss_new", sourceHash: "same-source-hash", canonicalUrl: "https://example.com/news/1" })],
      [{ id: "rss_old", source_hash: "same-source-hash", canonical_url: null }],
    );

    expect(resolved?.id).toBe("rss_old");
  });

  it("reuses an existing id matched by canonical URL", () => {
    const [resolved] = resolveRssEntryUpsertIds(
      [entry({ id: "rss_new", sourceHash: "new-source-hash", canonicalUrl: "https://example.com/news/1" })],
      [{ id: "rss_existing", source_hash: "old-source-hash", canonical_url: "https://example.com/news/1" }],
    );

    expect(resolved?.id).toBe("rss_existing");
  });

  it("deduplicates entries within the same upsert batch", () => {
    const resolved = resolveRssEntryUpsertIds(
      [
        entry({ id: "rss_first", sourceHash: "same-source-hash" }),
        entry({ id: "rss_second", sourceHash: "same-source-hash", feedId: "feed-2" }),
      ],
      [],
    );

    expect(resolved.map((item) => item.id)).toEqual(["rss_first", "rss_first"]);
  });
});
