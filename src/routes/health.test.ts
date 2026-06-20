import { describe, expect, it } from "vitest";
import { hasCurrentFetchError } from "./health";

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
