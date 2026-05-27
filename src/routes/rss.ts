import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { listRssEntries } from "../db/queries";
import { jsonResponse } from "../constants";
import type { Bindings, RssEntry, RssEntryResponse } from "../types";
import { parsePagination } from "../utils/pagination";

export const rssRoutes = new Hono<{ Bindings: Bindings }>();

rssRoutes.get(
  "/entries",
  zValidator(
    "query",
    z.object({
      category: z.string().optional(),
      limit: z.string().optional(),
      offset: z.string().optional(),
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const pagination = parsePagination(query, 100);
    const entries = await listRssEntries(c.env.DB, {
      category: query.category,
      ...pagination,
    });
    return jsonResponse(entries.map(toRssEntryResponse), undefined, pagination);
  },
);

function toRssEntryResponse(entry: RssEntry): RssEntryResponse {
  return {
    ...entry,
    tags: parseTags(entry.tags_json),
  };
}

function parseTags(value: string): string[] {
  try {
    const tags = JSON.parse(value) as unknown;
    return Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    return [];
  }
}
