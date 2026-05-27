import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { listPlaces } from "../db/queries";
import { jsonResponse } from "../constants";
import type { Bindings } from "../types";
import { parsePagination } from "../utils/pagination";

export const searchRoutes = new Hono<{ Bindings: Bindings }>();

searchRoutes.get(
  "/",
  zValidator(
    "query",
    z.object({
      q: z.string().min(1),
      limit: z.string().optional(),
      offset: z.string().optional(),
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const pagination = parsePagination(query, 100);
    const places = await listPlaces(c.env.DB, { query: query.q, ...pagination });
    return jsonResponse({ places, count: places.length, ...pagination });
  },
);
