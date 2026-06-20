import { describe, expect, it } from "vitest";
import { hasCurrentFetchError, toPublicFetchLog } from "./health";

describe("hasCurrentFetchError", () => {
  it("ignores older errors after a newer successful fetch", () => {
    expect(
      hasCurrentFetchError([
        { status: "ok", fetched_at: "2026-06-20T15:25:26.390Z" },
        { status: "error", fetched_at: "2026-06-20T15:21:47.167Z" },
      ]),
    ).toBe(false);
  });

  it("flags errors in the latest fetch group", () => {
    expect(
      hasCurrentFetchError([
        { status: "ok", fetched_at: "2026-06-20T18:00:28.162Z" },
        { status: "error", fetched_at: "2026-06-20T18:00:28.162Z" },
        { status: "ok", fetched_at: "2026-06-19T18:00:28.162Z" },
      ]),
    ).toBe(true);
  });
});

describe("toPublicFetchLog", () => {
  it("redacts internal error details", () => {
    expect(
      toPublicFetchLog({
        id: 1,
        source_type: "rss",
        source_id: "koriyama_city",
        status: "error",
        fetched_at: "2026-06-20T15:21:47.167Z",
        records_count: 0,
        error_message: "D1_ERROR: too many SQL variables at offset 856: SQLITE_ERROR",
      }),
    ).toMatchObject({
      status: "error",
      error_message: "details_redacted",
    });
  });

  it("keeps empty error messages empty", () => {
    expect(
      toPublicFetchLog({
        id: 2,
        source_type: "rss",
        source_id: "koriyama_city",
        status: "ok",
        fetched_at: "2026-06-20T15:25:26.390Z",
        records_count: 303,
        error_message: null,
      }).error_message,
    ).toBeNull();
  });
});
