import { describe, expect, it } from "vitest";
import { app } from "./index";

type RootResponse = {
  data: {
    name: string;
    api_base_path: string;
    repository_url?: string;
    endpoints: string[];
  };
};

describe("root route", () => {
  it("returns service information instead of redirecting", async () => {
    const response = await app.request("/");
    const body = (await response.json()) as RootResponse;

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(body.data).toMatchObject({
      name: "Koriyama Open Data Hub",
      api_base_path: "/api/v2",
    });
    expect(body.data.repository_url).toBeUndefined();
    expect(body.data.endpoints).toContain("/api/v2/health");
  });
});
