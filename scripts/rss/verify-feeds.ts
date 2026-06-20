import { GENERATED_DIR, hasStrictFlag, writeJsonFile } from "./io";
import { feedsFromVerifications, verifySeedFeeds } from "../../src/sources/rss";

const strict = hasStrictFlag();
const verifications = await verifySeedFeeds();
const feeds = feedsFromVerifications(verifications);
const failures = verifications.filter((verification) => verification.result.status !== "ok");

await writeJsonFile(`${GENERATED_DIR}/rss-feeds.json`, {
  generated_at: new Date().toISOString(),
  seed_count: verifications.length,
  ok_count: verifications.length - failures.length,
  failure_count: failures.length,
  feeds,
});

console.log(`RSS verify: ok=${verifications.length - failures.length} failed=${failures.length}`);
for (const failure of failures) {
  if (failure.result.status === "ok") continue;
  console.warn(`[warn] ${failure.seed.id} ${failure.url}: ${failure.result.status} ${failure.result.error}`);
}

if (strict && failures.length > 0) {
  process.exitCode = 1;
}
