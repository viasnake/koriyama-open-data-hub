import { GENERATED_DIR, hasStrictFlag, writeJsonFile } from "./io";
import { createRssDiscoveryReport, discoverRssFeeds, isStrictAuditFailure } from "../../src/sources/rss";

const strict = hasStrictFlag();
const discovery = await discoverRssFeeds();
const report = createRssDiscoveryReport([], discovery, discovery.generated_at);

await writeJsonFile(`${GENERATED_DIR}/rss-discovery-report.json`, report);
await writeJsonFile(`${GENERATED_DIR}/rss-discovered-feeds.json`, {
  generated_at: discovery.generated_at,
  visited_urls: discovery.visited_urls,
  feeds: discovery.feeds,
});

console.log(`RSS discover: visited=${discovery.visited_urls.length} discovered=${discovery.feeds.length}`);
if (report.missing_from_seed.length > 0) {
  console.warn(`[warn] missing_from_seed=${report.missing_from_seed.length}`);
}
if (report.seed_not_discovered.length > 0) {
  console.warn(`[warn] seed_not_discovered=${report.seed_not_discovered.length}`);
}

if (strict && isStrictAuditFailure(report)) {
  process.exitCode = 1;
}
