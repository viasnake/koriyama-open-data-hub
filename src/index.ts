import { Hono } from "hono";
import { cors } from "hono/cors";
import { CORS_HEADERS, jsonResponse } from "./constants";
import { changeRoutes } from "./routes/changes";
import { datasetRoutes } from "./routes/datasets";
import { healthRoutes } from "./routes/health";
import { placeRoutes } from "./routes/places";
import { rssRoutes } from "./routes/rss";
import { searchRoutes } from "./routes/search";
import { ingestOpenData } from "./jobs/ingest";
import { ingestRss } from "./jobs/rss";
import type { Bindings } from "./types";

export const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "OPTIONS"],
  }),
);

app.options("*", () => new Response(null, { headers: CORS_HEADERS }));

app.get("/", () =>
  jsonResponse({
    name: "Koriyama Open Data Hub",
    description:
      "Unofficial API for Koriyama City open data, RSS entries, places, and GeoJSON.",
    api_base_path: "/api/v2",
    endpoints: [
      "/api/v2/health",
      "/api/v2/datasets",
      "/api/v2/places",
      "/api/v2/places.geojson",
      "/api/v2/search?q=",
      "/api/v2/changes",
      "/api/v2/rss/entries",
    ],
  }),
);

const api = new Hono<{ Bindings: Bindings }>();
api.route("/health", healthRoutes);
api.route("/datasets", datasetRoutes);
api.route("/places", placeRoutes);
api.route("/search", searchRoutes);
api.route("/rss", rssRoutes);
api.route("/changes", changeRoutes);

app.route("/api/v2", api);

app.notFound(() => jsonResponse({ error: "not_found" }, { status: 404 }));

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext): Promise<void> {
    if (event.cron === "0 18 * * *") {
      ctx.waitUntil(ingestOpenData(env.DB));
      return;
    }

    ctx.waitUntil(ingestRss(env.DB));
  },
};
