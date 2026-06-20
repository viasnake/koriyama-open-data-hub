import { describe, expect, it } from "vitest";
import { selectRssFeedsForIngestion } from "./rss";
import type { RssFeed } from "../types";

function feed(id: string): RssFeed {
  return {
    id,
    kind: "life",
    title: id,
    url: `https://example.com/${id}.xml`,
    path: `/${id}.xml`,
    source: "seed",
    enabled: true,
    verified_at: "2026-06-20T00:00:00.000Z",
    verification_status: "ok",
    http_status: 200,
    last_error: null,
    first_seen_at: "2026-06-20T00:00:00.000Z",
    last_seen_at: "2026-06-20T00:00:00.000Z",
    discovered_from_url: null,
  };
}

describe("selectRssFeedsForIngestion", () => {
  it("returns every feed when the configured batch can cover them", () => {
    const feeds = Array.from({ length: 3 }, (_, index) => feed(`feed-${index}`));

    expect(selectRssFeedsForIngestion(feeds, new Date("2026-06-20T00:00:00.000Z"), 40).map((item) => item.id)).toEqual([
      "feed-0",
      "feed-1",
      "feed-2",
    ]);
  });

  it("rotates through feed batches by scheduled hour", () => {
    const feeds = Array.from({ length: 95 }, (_, index) => feed(`feed-${index}`));

    expect(selectRssFeedsForIngestion(feeds, new Date("1970-01-01T00:00:00.000Z"), 40).map((item) => item.id)).toEqual(
      feeds.slice(0, 40).map((item) => item.id),
    );
    expect(selectRssFeedsForIngestion(feeds, new Date("1970-01-01T01:00:00.000Z"), 40).map((item) => item.id)).toEqual(
      feeds.slice(40, 80).map((item) => item.id),
    );
    expect(selectRssFeedsForIngestion(feeds, new Date("1970-01-01T02:00:00.000Z"), 40).map((item) => item.id)).toEqual(
      feeds.slice(80, 95).map((item) => item.id),
    );
    expect(selectRssFeedsForIngestion(feeds, new Date("1970-01-01T03:00:00.000Z"), 40).map((item) => item.id)).toEqual(
      feeds.slice(0, 40).map((item) => item.id),
    );
  });
});
