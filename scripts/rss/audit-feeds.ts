import { GENERATED_DIR, hasStrictFlag, writeJsonFile } from "./io";
import { auditRssFeeds, isStrictAuditFailure } from "../../src/sources/rss";

const strict = hasStrictFlag();
const report = await auditRssFeeds();

await writeJsonFile(`${GENERATED_DIR}/rss-discovery-report.json`, report);

console.log(
  `RSS audit: seed=${report.seed_count} discovered=${report.discovered_count} ok=${report.verified_ok_count} dead=${report.dead_count} parse_error=${report.parse_error_count}`,
);

if (report.missing_from_seed.length > 0) {
  console.warn(`[warn] missing_from_seed=${report.missing_from_seed.length}`);
}
if (report.seed_not_discovered.length > 0) {
  console.warn(`[warn] seed_not_discovered=${report.seed_not_discovered.length}`);
}
if (report.dead_seed_feeds.length > 0) {
  console.warn(`[warn] dead_seed_feeds=${report.dead_seed_feeds.length}`);
}
if (report.parse_error_seed_feeds.length > 0) {
  console.warn(`[warn] parse_error_seed_feeds=${report.parse_error_seed_feeds.length}`);
}

if (strict && isStrictAuditFailure(report)) {
  process.exitCode = 1;
}
