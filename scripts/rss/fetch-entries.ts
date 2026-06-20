import { GENERATED_DIR, hasStrictFlag, writeJsonFile } from "./io";
import { parseRss } from "../../src/parsers/rss";
import { classifyRssEntry } from "../../src/normalizers/rss";
import { fetchRssFeed, feedsFromVerifications, verifySeedFeeds } from "../../src/sources/rss";
import { parseDateLike } from "../../src/utils/datetime";
import { sha256Hex } from "../../src/utils/hash";

const strict = hasStrictFlag();
const fetchedAt = new Date().toISOString();
const verifications = await verifySeedFeeds(undefined, fetchedAt);
const feeds = feedsFromVerifications(verifications);
const enabledFeeds = feeds.filter((feed) => feed.enabled);
const verificationFailures = verifications.filter((verification) => verification.result.status !== "ok");
const entries = new Map<string, Record<string, unknown>>();
const errors: string[] = [];

for (const feed of enabledFeeds) {
  try {
    const xml = await fetchRssFeed(feed.url);
    const parsedEntries = parseRss(xml);

    for (const entry of parsedEntries) {
      const canonicalUrl = canonicalizeUrl(entry.link);
      const sourceHash = await sha256Hex(`${entry.title}|${entry.link}|${entry.publishedAt ?? ""}`);
      const id = `rss_${(await sha256Hex(canonicalUrl ?? sourceHash)).slice(0, 16)}`;
      const classification = classifyRssEntry(entry.title, entry.sourceCategories);
      const existing = entries.get(id);

      if (existing) {
        existing.feed_ids = unique([...(existing.feed_ids as string[]), feed.id]);
        existing.feed_kinds = unique([...(existing.feed_kinds as string[]), feed.kind]);
        continue;
      }

      entries.set(id, {
        id,
        feed_id: feed.id,
        feed_ids: [feed.id],
        feed_kinds: [feed.kind],
        title: entry.title,
        link: entry.link,
        canonical_url: canonicalUrl,
        published_at: parseDateLike(entry.publishedAt),
        fetched_at: fetchedAt,
        category: classification.category,
        tags: classification.tags,
        source_hash: sourceHash,
      });
    }
  } catch (error) {
    errors.push(`${feed.id}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

await writeJsonFile(`${GENERATED_DIR}/rss-feeds.json`, {
  generated_at: fetchedAt,
  seed_count: feeds.length,
  ok_count: enabledFeeds.length,
  failure_count: verificationFailures.length,
  enabled_count: enabledFeeds.length,
  feeds,
});
await writeJsonFile(`${GENERATED_DIR}/rss-entries.json`, {
  generated_at: fetchedAt,
  feed_count: enabledFeeds.length,
  entry_count: entries.size,
  entries: [...entries.values()],
});

console.log(`RSS fetch: feeds=${enabledFeeds.length} entries=${entries.size} errors=${errors.length}`);
for (const error of errors) {
  console.warn(`[warn] ${error}`);
}

if (strict && (errors.length > 0 || entries.size === 0)) {
  process.exitCode = 1;
}

function canonicalizeUrl(value: string): string | null {
  try {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
