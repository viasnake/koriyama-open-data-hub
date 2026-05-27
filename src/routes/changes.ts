import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { jsonResponse } from "../constants";
import type { Bindings } from "../types";
import { parsePagination } from "../utils/pagination";

export const changeRoutes = new Hono<{ Bindings: Bindings }>();

changeRoutes.get(
  "/",
  zValidator(
    "query",
    z.object({
      since: z.string().optional(),
      limit: z.string().optional(),
      offset: z.string().optional(),
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const pagination = parsePagination(query, 100);
    const statement = query.since
      ? c.env.DB
          .prepare("select * from record_changes where changed_at >= ? order by changed_at desc limit ? offset ?")
          .bind(query.since, pagination.limit, pagination.offset)
      : c.env.DB
          .prepare("select * from record_changes order by changed_at desc limit ? offset ?")
          .bind(pagination.limit, pagination.offset);
    const result = await statement.all();
    return jsonResponse(result.results, undefined, pagination);
  },
);
