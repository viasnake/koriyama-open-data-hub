import { describe, expect, it } from "vitest";
import { createRssDiscoveryReport, KORIYAMA_RSS_FEEDS, rssFeedUrl, type FeedVerification, type RssDiscoveryResult } from "./rss";

describe("Koriyama RSS seed", () => {
  it("does not include organization RSS feeds", () => {
    expect(KORIYAMA_RSS_FEEDS.some((feed) => feed.path.includes("/soshiki-"))).toBe(false);
  });
});

describe("createRssDiscoveryReport", () => {
  it("reports missing, undiscovered, dead, parse error, and ok feeds", () => {
    const now = "2026-06-20T00:00:00.000Z";
    const firstSeed = KORIYAMA_RSS_FEEDS[0];
    const secondSeed = KORIYAMA_RSS_FEEDS[1];
    const thirdSeed = KORIYAMA_RSS_FEEDS[2];

    if (!firstSeed || !secondSeed || !thirdSeed) {
      throw new Error("RSS seed fixtures are missing");
    }

    const verifications: FeedVerification[] = [
      {
        seed: firstSeed,
        url: rssFeedUrl(firstSeed.path),
        verified_at: now,
        result: { status: "ok", httpStatus: 200, title: "ok", itemCount: 0 },
      },
      {
        seed: secondSeed,
        url: rssFeedUrl(secondSeed.path),
        verified_at: now,
        result: { status: "dead", httpStatus: 404, error: "HTTP 404" },
      },
      {
        seed: thirdSeed,
        url: rssFeedUrl(thirdSeed.path),
        verified_at: now,
        result: { status: "parse_error", httpStatus: 200, error: "bad xml" },
      },
    ];
    const discovery: RssDiscoveryResult = {
      generated_at: now,
      visited_urls: ["https://www.city.koriyama.lg.jp/rss/"],
      feeds: [
        {
          id: firstSeed.id,
          kind: firstSeed.kind,
          title: firstSeed.title,
          url: rssFeedUrl(firstSeed.path),
          path: firstSeed.path,
          discovered_from_url: "https://www.city.koriyama.lg.jp/rss/",
          first_seen_at: now,
          last_seen_at: now,
        },
        {
          id: "site-9999",
          kind: "site",
          title: "new site",
          url: rssFeedUrl("/rss/10/site-9999.xml"),
          path: "/rss/10/site-9999.xml",
          discovered_from_url: "https://www.city.koriyama.lg.jp/rss/",
          first_seen_at: now,
          last_seen_at: now,
        },
      ],
    };

    const report = createRssDiscoveryReport(verifications, discovery, now);

    expect(report.ok_feeds).toHaveLength(1);
    expect(report.dead_seed_feeds).toHaveLength(1);
    expect(report.parse_error_seed_feeds).toHaveLength(1);
    expect(report.missing_from_seed.map((feed) => feed.id)).toEqual(["site-9999"]);
    expect(report.seed_not_discovered).toContain(secondSeed);
  });
});
