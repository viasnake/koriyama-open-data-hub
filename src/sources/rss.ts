import { parseRssDocument } from "../parsers/rss";
import type { RssFeed, RssFeedKind, RssVerificationStatus } from "../types";

export const KORIYAMA_CITY_BASE_URL = "https://www.city.koriyama.lg.jp/" as const;
export const KORIYAMA_RSS_FEED_URL = "https://www.city.koriyama.lg.jp/rss/10/list1.xml" as const;
export const RSS_USER_AGENT = "civic-koriyama-data/0.1" as const;

export type SeedRssFeed = {
  kind: Exclude<RssFeedKind, "organization" | "unknown">;
  id: string;
  title: string;
  path: string;
};

export const KORIYAMA_RSS_FEEDS = [
  { kind: "global", id: "list1", title: "新着情報", path: "/rss/10/list1.xml" },
  { kind: "global", id: "list5", title: "事業者の方へ", path: "/rss/10/list5.xml" },
  { kind: "global", id: "list7", title: "報道資料", path: "/rss/10/list7.xml" },

  { kind: "life", id: "life1", title: "くらし", path: "/rss/10/life1.xml" },
  { kind: "life", id: "life2", title: "健康・福祉", path: "/rss/10/life2.xml" },
  { kind: "life", id: "life3", title: "子育て・教育", path: "/rss/10/life3.xml" },
  { kind: "life", id: "life4", title: "しごと・産業", path: "/rss/10/life4.xml" },
  { kind: "life", id: "life5", title: "文化・スポーツ・観光", path: "/rss/10/life5.xml" },
  { kind: "life", id: "life6", title: "市政情報", path: "/rss/10/life6.xml" },

  { kind: "life", id: "life1-1", title: "戸籍・住民票・証明", path: "/rss/10/life1-1.xml" },
  { kind: "life", id: "life1-2", title: "ごみ・リサイクル", path: "/rss/10/life1-2.xml" },
  { kind: "life", id: "life1-3", title: "国民健康保険・後期高齢者医療", path: "/rss/10/life1-3.xml" },
  { kind: "life", id: "life1-4", title: "国民年金", path: "/rss/10/life1-4.xml" },
  { kind: "life", id: "life1-5", title: "上下水道・浄化槽・簡易水道", path: "/rss/10/life1-5.xml" },
  { kind: "life", id: "life1-6", title: "税金", path: "/rss/10/life1-6.xml" },
  { kind: "life", id: "life1-7", title: "道路・交通・河川", path: "/rss/10/life1-7.xml" },
  { kind: "life", id: "life1-8", title: "ペット・動物", path: "/rss/10/life1-8.xml" },
  { kind: "life", id: "life1-9", title: "人権・男女共同参画", path: "/rss/10/life1-9.xml" },
  { kind: "life", id: "life1-10", title: "住まい", path: "/rss/10/life1-10.xml" },
  { kind: "life", id: "life1-11", title: "移住定住", path: "/rss/10/life1-11.xml" },
  { kind: "life", id: "life1-12", title: "公害", path: "/rss/10/life1-12.xml" },
  { kind: "life", id: "life1-13", title: "環境・自然保護", path: "/rss/10/life1-13.xml" },
  { kind: "life", id: "life1-14", title: "墓地・火葬場", path: "/rss/10/life1-14.xml" },
  { kind: "life", id: "life1-15", title: "防災・防犯", path: "/rss/10/life1-15.xml" },
  { kind: "life", id: "life1-16", title: "都市計画", path: "/rss/10/life1-16.xml" },
  { kind: "life", id: "life1-17", title: "都市整備", path: "/rss/10/life1-17.xml" },
  { kind: "life", id: "life1-18", title: "まちづくり", path: "/rss/10/life1-18.xml" },

  { kind: "life", id: "life2-19", title: "健康・医療・衛生", path: "/rss/10/life2-19.xml" },
  { kind: "life", id: "life2-20", title: "福祉", path: "/rss/10/life2-20.xml" },
  { kind: "life", id: "life2-21", title: "介護・高齢者福祉", path: "/rss/10/life2-21.xml" },

  { kind: "life", id: "life3-22", title: "教育・生涯学習", path: "/rss/10/life3-22.xml" },
  { kind: "life", id: "life3-23", title: "子育て", path: "/rss/10/life3-23.xml" },

  { kind: "life", id: "life4-24", title: "相談窓口", path: "/rss/10/life4-24.xml" },
  { kind: "life", id: "life4-25", title: "雇用・労働・経営支援", path: "/rss/10/life4-25.xml" },
  { kind: "life", id: "life4-26", title: "ファシリティマネジメント", path: "/rss/10/life4-26.xml" },
  { kind: "life", id: "life4-27", title: "産業振興", path: "/rss/10/life4-27.xml" },
  { kind: "life", id: "life4-28", title: "入札・契約", path: "/rss/10/life4-28.xml" },
  { kind: "life", id: "life4-29", title: "営業に関する許可等", path: "/rss/10/life4-29.xml" },
  { kind: "life", id: "life4-40", title: "現在施工中の公共工事", path: "/rss/10/life4-40.xml" },

  { kind: "life", id: "life5-30", title: "スポーツ", path: "/rss/10/life5-30.xml" },
  { kind: "life", id: "life5-31", title: "観光", path: "/rss/10/life5-31.xml" },
  { kind: "life", id: "life5-32", title: "公園", path: "/rss/10/life5-32.xml" },
  { kind: "life", id: "life5-33", title: "文化・芸術", path: "/rss/10/life5-33.xml" },

  { kind: "life", id: "life6-34", title: "市の概要", path: "/rss/10/life6-34.xml" },
  { kind: "life", id: "life6-35", title: "郡山市内各行政区", path: "/rss/10/life6-35.xml" },
  { kind: "life", id: "life6-36", title: "広報・広聴", path: "/rss/10/life6-36.xml" },
  { kind: "life", id: "life6-37", title: "情報公開・個人情報保護・オープンデータ", path: "/rss/10/life6-37.xml" },
  { kind: "life", id: "life6-38", title: "市政運営", path: "/rss/10/life6-38.xml" },
  { kind: "life", id: "life6-39", title: "市の財政", path: "/rss/10/life6-39.xml" },
  { kind: "life", id: "life6-43", title: "【県】助成金・補助金", path: "/rss/10/life6-43.xml" },

  { kind: "site", id: "site-8", title: "郡山市子育てサイト", path: "/rss/10/site-8.xml" },
  { kind: "site", id: "site-12", title: "SDGs未来都市", path: "/rss/10/site-12.xml" },
  { kind: "site", id: "site-37", title: "郡山市上下水道局", path: "/rss/10/site-37.xml" },
  { kind: "site", id: "site-57", title: "郡山市消費生活センター", path: "/rss/10/site-57.xml" },
  { kind: "site", id: "site-62", title: "郡山市議会", path: "/rss/10/site-62.xml" },
  { kind: "site", id: "site-99", title: "郡山市立美術館", path: "/rss/10/site-99.xml" },
  { kind: "site", id: "site-104", title: "市長の部屋", path: "/rss/10/site-104.xml" },
  { kind: "site", id: "site-106", title: "職員採用情報", path: "/rss/10/site-106.xml" },
  { kind: "site", id: "site-135", title: "マイナンバー", path: "/rss/10/site-135.xml" },
  { kind: "site", id: "site-169", title: "統計こおりやま", path: "/rss/10/site-169.xml" },
  { kind: "site", id: "site-183", title: "みなさんの声", path: "/rss/10/site-183.xml" },
  { kind: "site", id: "site-204", title: "官民連携ポータル", path: "/rss/10/site-204.xml" },
  { kind: "site", id: "site-212", title: "セーフコミュニティ", path: "/rss/10/site-212.xml" },
  { kind: "site", id: "site-266", title: "こおりやま広域圏ポータルサイト", path: "/rss/10/site-266.xml" },
  { kind: "site", id: "site-279", title: "こおりやま女性の活躍推進ポータル", path: "/rss/10/site-279.xml" },
  { kind: "site", id: "site-317", title: "郡山市図書館", path: "/rss/10/site-317.xml" },
  { kind: "site", id: "site-503", title: "トップスポーツ", path: "/rss/10/site-503.xml" },
  { kind: "site", id: "site-648", title: "郡山市制施行100周年記念ポータルサイト", path: "/rss/10/site-648.xml" },
  { kind: "site", id: "site-670", title: "ココカラこおりやま！", path: "/rss/10/site-670.xml" },
  { kind: "site", id: "site-918", title: "郡山新事業開発プロジェクト研究", path: "/rss/10/site-918.xml" },
  { kind: "site", id: "site-963", title: "生涯学習ポータルサイト「だれでも まなび こおりやま」", path: "/rss/10/site-963.xml" },
  { kind: "site", id: "site-1632", title: "郡山市防災ポータル", path: "/rss/10/site-1632.xml" },
] as const satisfies readonly SeedRssFeed[];

export const RSS_DISCOVERY_START_URLS = [
  "https://www.city.koriyama.lg.jp/",
  "https://www.city.koriyama.lg.jp/rss/",
  "https://www.city.koriyama.lg.jp/life/",
] as const;

export type RssLivenessResult =
  | { status: "ok"; httpStatus: 200; title: string; itemCount: number }
  | { status: "dead" | "http_error" | "parse_error"; httpStatus: number | null; error: string };

export type FeedVerification = {
  seed: SeedRssFeed;
  url: string;
  verified_at: string;
  result: RssLivenessResult;
};

export type DiscoveredFeed = {
  id: string;
  kind: RssFeedKind;
  title: string;
  url: string;
  path: string;
  discovered_from_url: string;
  first_seen_at: string;
  last_seen_at: string;
};

export type RssDiscoveryResult = {
  generated_at: string;
  visited_urls: string[];
  feeds: DiscoveredFeed[];
};

export type FeedVerificationFailure = {
  id: string;
  kind: RssFeedKind;
  title: string;
  url: string;
  path: string;
  http_status: number | null;
  last_error: string;
};

export type VerifiedFeed = {
  id: string;
  kind: RssFeedKind;
  title: string;
  url: string;
  path: string;
  http_status: 200;
  item_count: number;
  verified_at: string;
};

export type RssDiscoveryReport = {
  generated_at: string;
  seed_count: number;
  discovered_count: number;
  verified_ok_count: number;
  dead_count: number;
  parse_error_count: number;
  missing_from_seed: DiscoveredFeed[];
  seed_not_discovered: SeedRssFeed[];
  dead_seed_feeds: FeedVerificationFailure[];
  parse_error_seed_feeds: FeedVerificationFailure[];
  ok_feeds: VerifiedFeed[];
};

type FetchLike = typeof fetch;

type HtmlLink = {
  href: string;
  title: string | null;
  isFeedHint: boolean;
};

export async function fetchRssFeed(url: string = KORIYAMA_RSS_FEED_URL): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": RSS_USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch RSS: ${response.status}`);
  }

  return response.text();
}

export function rssFeedUrl(path: string): string {
  return new URL(path, KORIYAMA_CITY_BASE_URL).toString();
}

export function seedToRssFeed(seed: SeedRssFeed, now: string): RssFeed {
  return {
    id: seed.id,
    kind: seed.kind,
    title: seed.title,
    url: rssFeedUrl(seed.path),
    path: seed.path,
    source: "seed",
    enabled: false,
    verified_at: null,
    verification_status: "unchecked",
    http_status: null,
    last_error: null,
    first_seen_at: now,
    last_seen_at: now,
    discovered_from_url: null,
  };
}

export async function verifyRssFeedUrl(url: string, fetcher: FetchLike = fetch): Promise<RssLivenessResult> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    return { status: "dead", httpStatus: null, error: errorMessage(error) };
  }

  let response: Response;
  try {
    response = await fetcher(parsedUrl.toString(), {
      headers: {
        "User-Agent": RSS_USER_AGENT,
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
    });
  } catch (error) {
    return { status: "http_error", httpStatus: null, error: errorMessage(error) };
  }

  if (response.status !== 200) {
    return { status: "dead", httpStatus: response.status, error: `HTTP ${response.status}` };
  }

  let xml: string;
  try {
    xml = await response.text();
  } catch (error) {
    return { status: "http_error", httpStatus: response.status, error: errorMessage(error) };
  }

  try {
    const document = parseRssDocument(xml);
    if (document.format === "unknown") {
      return { status: "parse_error", httpStatus: response.status, error: "XML is not RSS, RDF, or Atom" };
    }
    if (!document.title) {
      return { status: "parse_error", httpStatus: response.status, error: "Feed title was not found" };
    }
    return {
      status: "ok",
      httpStatus: 200,
      title: document.title,
      itemCount: document.entries.length,
    };
  } catch (error) {
    return { status: "parse_error", httpStatus: response.status, error: errorMessage(error) };
  }
}

export async function verifySeedFeeds(fetcher: FetchLike = fetch, now = new Date().toISOString()): Promise<FeedVerification[]> {
  const results: FeedVerification[] = [];

  for (const seed of KORIYAMA_RSS_FEEDS) {
    const url = rssFeedUrl(seed.path);
    results.push({
      seed,
      url,
      verified_at: now,
      result: await verifyRssFeedUrl(url, fetcher),
    });
  }

  return results;
}

export async function discoverRssFeeds(options: { fetcher?: FetchLike; maxPages?: number; now?: string } = {}): Promise<RssDiscoveryResult> {
  const fetcher = options.fetcher ?? fetch;
  const maxPages = options.maxPages ?? 300;
  const now = options.now ?? new Date().toISOString();
  const queue = RSS_DISCOVERY_START_URLS.map((url) => normalizeKoriyamaUrl(url, KORIYAMA_CITY_BASE_URL)).filter(
    (url): url is URL => url != null,
  );
  const seenPages = new Set<string>();
  const visitedUrls: string[] = [];
  const discovered = new Map<string, DiscoveredFeed>();

  while (queue.length > 0 && visitedUrls.length < maxPages) {
    const pageUrl = queue.shift();
    if (!pageUrl) break;
    const pageKey = pageUrl.toString();
    if (seenPages.has(pageKey) || !isAllowedDiscoveryPage(pageUrl)) continue;
    seenPages.add(pageKey);

    let html: string;
    try {
      const response = await fetcher(pageKey, {
        headers: {
          "User-Agent": RSS_USER_AGENT,
          Accept: "text/html, application/xhtml+xml;q=0.9, */*;q=0.8",
        },
      });
      if (!response.ok) continue;
      html = await response.text();
    } catch {
      continue;
    }

    visitedUrls.push(pageKey);

    for (const link of extractHtmlLinks(html)) {
      const url = normalizeKoriyamaUrl(link.href, pageKey);
      if (!url) continue;

      if (isAllowedRssFeedPath(url.pathname)) {
        const existing = discovered.get(url.pathname);
        const title = cleanTitle(link.title) ?? existing?.title ?? feedIdFromPath(url.pathname);
        discovered.set(url.pathname, {
          id: feedIdFromPath(url.pathname),
          kind: feedKindFromPath(url.pathname),
          title,
          url: url.toString(),
          path: url.pathname,
          discovered_from_url: existing?.discovered_from_url ?? pageKey,
          first_seen_at: existing?.first_seen_at ?? now,
          last_seen_at: now,
        });
        continue;
      }

      if (!link.isFeedHint && isAllowedDiscoveryPage(url) && !seenPages.has(url.toString())) {
        queue.push(url);
      }
    }
  }

  return {
    generated_at: now,
    visited_urls: visitedUrls,
    feeds: [...discovered.values()].sort((a, b) => a.path.localeCompare(b.path)),
  };
}

export async function auditRssFeeds(options: { fetcher?: FetchLike; maxPages?: number; now?: string } = {}): Promise<RssDiscoveryReport> {
  const now = options.now ?? new Date().toISOString();
  const [verifications, discovery] = await Promise.all([
    verifySeedFeeds(options.fetcher, now),
    discoverRssFeeds({ fetcher: options.fetcher, maxPages: options.maxPages, now }),
  ]);

  return createRssDiscoveryReport(verifications, discovery, now);
}

export function createRssDiscoveryReport(
  verifications: FeedVerification[],
  discovery: Pick<RssDiscoveryResult, "feeds">,
  now: string,
): RssDiscoveryReport {
  const seedPaths = new Set<string>(KORIYAMA_RSS_FEEDS.map((feed) => feed.path));
  const discoveredPaths = new Set<string>(discovery.feeds.map((feed) => feed.path));
  const missingFromSeed = discovery.feeds.filter((feed) => !seedPaths.has(feed.path));
  const seedNotDiscovered = KORIYAMA_RSS_FEEDS.filter((feed) => !discoveredPaths.has(feed.path));
  const deadSeedFeeds = verificationFailures(verifications, ["dead", "http_error"]);
  const parseErrorSeedFeeds = verificationFailures(verifications, ["parse_error"]);
  const okFeeds = verifications.flatMap((verification): VerifiedFeed[] => {
    if (verification.result.status !== "ok") return [];
    return [
      {
        id: verification.seed.id,
        kind: verification.seed.kind,
        title: verification.seed.title,
        url: verification.url,
        path: verification.seed.path,
        http_status: verification.result.httpStatus,
        item_count: verification.result.itemCount,
        verified_at: verification.verified_at,
      },
    ];
  });

  return {
    generated_at: now,
    seed_count: KORIYAMA_RSS_FEEDS.length,
    discovered_count: discovery.feeds.length,
    verified_ok_count: okFeeds.length,
    dead_count: deadSeedFeeds.length,
    parse_error_count: parseErrorSeedFeeds.length,
    missing_from_seed: missingFromSeed,
    seed_not_discovered: seedNotDiscovered,
    dead_seed_feeds: deadSeedFeeds,
    parse_error_seed_feeds: parseErrorSeedFeeds,
    ok_feeds: okFeeds,
  };
}

export function feedsFromVerifications(verifications: FeedVerification[]): RssFeed[] {
  return verifications.map((verification) => {
    const base = seedToRssFeed(verification.seed, verification.verified_at);
    const status = verificationStatusFromResult(verification.result);
    return {
      ...base,
      enabled: status === "ok",
      verified_at: verification.verified_at,
      verification_status: status,
      http_status: verification.result.httpStatus,
      last_error: verification.result.status === "ok" ? null : verification.result.error,
    };
  });
}

export function verificationStatusFromResult(result: RssLivenessResult): RssVerificationStatus {
  return result.status === "ok"
    ? "ok"
    : result.status === "dead"
      ? "dead"
      : result.status === "http_error"
        ? "http_error"
        : "parse_error";
}

export function isStrictAuditFailure(report: RssDiscoveryReport): boolean {
  return report.dead_seed_feeds.length > 0 || report.parse_error_seed_feeds.length > 0 || report.missing_from_seed.length > 0;
}

function verificationFailures(verifications: FeedVerification[], statuses: RssLivenessResult["status"][]): FeedVerificationFailure[] {
  return verifications.flatMap((verification) => {
    if (!statuses.includes(verification.result.status) || verification.result.status === "ok") return [];
    return [
      {
        id: verification.seed.id,
        kind: verification.seed.kind,
        title: verification.seed.title,
        url: verification.url,
        path: verification.seed.path,
        http_status: verification.result.httpStatus,
        last_error: verification.result.error,
      },
    ];
  });
}

function normalizeKoriyamaUrl(href: string, baseUrl: string): URL | null {
  try {
    const url = new URL(href, baseUrl);
    if (url.hostname !== "www.city.koriyama.lg.jp") return null;
    url.hash = "";
    url.search = "";
    return url;
  } catch {
    return null;
  }
}

function isAllowedDiscoveryPage(url: URL): boolean {
  const path = normalizePath(url.pathname);
  if (path.startsWith("/soshiki/") || path.startsWith("/form/") || path.startsWith("/map/")) return false;
  return path === "/" || path === "/rss" || path === "/rss/" || path === "/life" || path === "/life/" || path.startsWith("/life/") || path.startsWith("/site/");
}

function isAllowedRssFeedPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (/^\/rss\/10\/soshiki-[^/]+\.xml$/u.test(path)) return false;
  return /^\/rss\/10\/(?:list[^/]*|life[^/]*|site-[^/]+)\.xml$/u.test(path);
}

function normalizePath(pathname: string): string {
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function feedIdFromPath(pathname: string): string {
  const filename = pathname.split("/").at(-1) ?? pathname;
  return filename.replace(/\.xml$/u, "");
}

function feedKindFromPath(pathname: string): RssFeedKind {
  const id = feedIdFromPath(pathname);
  if (id.startsWith("list")) return "global";
  if (id.startsWith("life")) return "life";
  if (id.startsWith("site-")) return "site";
  if (id.startsWith("soshiki-")) return "organization";
  return "unknown";
}

function extractHtmlLinks(html: string): HtmlLink[] {
  return [...extractAnchorLinks(html), ...extractFeedLinkElements(html)];
}

function extractAnchorLinks(html: string): HtmlLink[] {
  const links: HtmlLink[] = [];
  const anchorPattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/giu;
  let match: RegExpExecArray | null;
  while ((match = anchorPattern.exec(html)) != null) {
    const attrs = match[1] ?? "";
    const href = attributeValue(attrs, "href");
    if (!href) continue;
    links.push({
      href,
      title: attributeValue(attrs, "title") ?? textContent(match[2] ?? ""),
      isFeedHint: false,
    });
  }
  return links;
}

function extractFeedLinkElements(html: string): HtmlLink[] {
  const links: HtmlLink[] = [];
  const linkPattern = /<link\b([^>]*)\/?>/giu;
  let match: RegExpExecArray | null;
  while ((match = linkPattern.exec(html)) != null) {
    const attrs = match[1] ?? "";
    const type = attributeValue(attrs, "type")?.toLowerCase() ?? "";
    if (type !== "application/rss+xml" && type !== "application/atom+xml") continue;
    const href = attributeValue(attrs, "href");
    if (!href) continue;
    links.push({
      href,
      title: attributeValue(attrs, "title"),
      isFeedHint: true,
    });
  }
  return links;
}

function attributeValue(attrs: string, name: string): string | null {
  const pattern = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "iu");
  const match = pattern.exec(attrs);
  return match?.[2] ?? match?.[3] ?? match?.[4] ?? null;
}

function textContent(html: string): string | null {
  return decodeHtmlEntities(html.replace(/<[^>]*>/gu, " ").replace(/\s+/gu, " ").trim());
}

function cleanTitle(value: string | null): string | null {
  const title = value?.replace(/\s+/gu, " ").trim();
  return title ? title : null;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/gu, "&")
    .replace(/&lt;/gu, "<")
    .replace(/&gt;/gu, ">")
    .replace(/&quot;/gu, '"')
    .replace(/&#39;/gu, "'");
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
