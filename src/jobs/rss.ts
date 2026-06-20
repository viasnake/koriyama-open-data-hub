import { parseRss } from "../parsers/rss";
import { createRssDiscoveryReport, discoverRssFeeds, fetchRssFeed, verifySeedFeeds } from "../sources/rss";
import { classifyRssEntry } from "../normalizers/rss";
import { sha256Hex } from "../utils/hash";
import { nowIso, parseDateLike } from "../utils/datetime";
import {
  insertFetchLog,
  insertRssAuditReport,
  listRssFeeds,
  syncSeedRssFeeds,
  updateRssFeedVerifications,
  upsertDiscoveredRssFeeds,
  upsertRssEntries,
  type RssEntryUpsert,
} from "../db/queries";

export async function ingestRss(db: D1Database): Promise<void> {
  const fetchedAt = nowIso();
  try {
    await syncSeedRssFeeds(db, fetchedAt);
    let feeds = await listRssFeeds(db);

    if (feeds.length === 0) {
      const verifications = await verifySeedFeeds(undefined, fetchedAt);
      await updateRssFeedVerifications(db, verifications);
      feeds = await listRssFeeds(db);
    }

    if (feeds.length === 0) {
      throw new Error("No verified RSS feeds are enabled");
    }

    const upserts: RssEntryUpsert[] = [];
    const errors: string[] = [];

    for (const feed of feeds) {
      try {
        const xml = await fetchRssFeed(feed.url);
        const entries = parseRss(xml);

        upserts.push(
          ...(await Promise.all(
            entries.map(async (entry) => {
              const canonicalUrl = canonicalizeUrl(entry.link);
              const sourceHash = await sha256Hex(`${entry.title}|${entry.link}|${entry.publishedAt ?? ""}`);
              const idSource = canonicalUrl ?? sourceHash;
              const id = `rss_${(await sha256Hex(idSource)).slice(0, 16)}`;
              const classification = classifyRssEntry(entry.title, entry.sourceCategories);

              return {
                id,
                feedId: feed.id,
                title: entry.title,
                link: entry.link,
                publishedAt: parseDateLike(entry.publishedAt),
                fetchedAt,
                category: classification.category,
                tags: classification.tags,
                sourceHash,
                canonicalUrl,
              };
            }),
          )),
        );
      } catch (error) {
        errors.push(`${feed.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    if (upserts.length === 0) {
      throw new Error(errors.length > 0 ? `RSS fetch failed for all feeds: ${errors.join("; ")}` : "RSS feeds parsed zero entries");
    }

    await upsertRssEntries(db, upserts);

    await insertFetchLog(db, {
      sourceType: "rss",
      sourceId: "koriyama_city",
      status: errors.length > 0 ? "partial" : "ok",
      fetchedAt,
      recordsCount: upserts.length,
      errorMessage: errors.length > 0 ? errors.join("; ") : undefined,
    });
  } catch (error) {
    await insertFetchLog(db, {
      sourceType: "rss",
      sourceId: "koriyama_city",
      status: "error",
      fetchedAt,
      recordsCount: 0,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function auditRssRegistry(db: D1Database): Promise<void> {
  const generatedAt = nowIso();
  try {
    await syncSeedRssFeeds(db, generatedAt);
    const [verifications, discovery] = await Promise.all([
      verifySeedFeeds(undefined, generatedAt),
      discoverRssFeeds({ now: generatedAt }),
    ]);
    const report = createRssDiscoveryReport(verifications, discovery, generatedAt);

    await updateRssFeedVerifications(db, verifications);
    await upsertDiscoveredRssFeeds(db, discovery.feeds);
    await insertRssAuditReport(db, report);

    await insertFetchLog(db, {
      sourceType: "rss_audit",
      sourceId: "koriyama_city",
      status:
        report.dead_seed_feeds.length > 0 || report.parse_error_seed_feeds.length > 0 || report.missing_from_seed.length > 0
          ? "warning"
          : "ok",
      fetchedAt: generatedAt,
      recordsCount: report.verified_ok_count,
      errorMessage:
        report.dead_seed_feeds.length > 0 || report.parse_error_seed_feeds.length > 0 || report.missing_from_seed.length > 0
          ? `dead=${report.dead_seed_feeds.length}; parse_error=${report.parse_error_seed_feeds.length}; missing=${report.missing_from_seed.length}`
          : undefined,
    });
  } catch (error) {
    await insertFetchLog(db, {
      sourceType: "rss_audit",
      sourceId: "koriyama_city",
      status: "error",
      fetchedAt: generatedAt,
      recordsCount: 0,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
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
