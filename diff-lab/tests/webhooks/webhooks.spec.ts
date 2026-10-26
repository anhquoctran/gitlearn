import { buildWebhooksRegionKey, normalizeQuery, summarizeWebhooks, validateWebhooks } from "../../src/webhooks/index.js";

describe("Webhooks domain", () => {
  const validRecord = { id: "rec-001", state: "active" as const, createdAt: "2026-01-01", updatedAt: "2026-01-02", attributes: {} };

  test("uses a bounded default page size", () => {
    expect(normalizeQuery({ requestId: "req-1" }).limit).toBe(50);
    expect(normalizeQuery({ requestId: "req-2", limit: 500 }).limit).toBe(150);
  });

  test("trims cursors before passing them to storage", () => {
    expect(normalizeQuery({ requestId: "req-3", cursor: " next " }).cursor).toBe("next");
  });

  test("accepts a complete active webhooks record", () => {
    expect(validateWebhooks(validRecord)).toEqual([]);
  });

  test("reports a missing identifier", () => {
    expect(validateWebhooks({ ...validRecord, id: " " })).toContain("id is required");
  });

  test("summarizes active and archived records", () => {
    const summary = summarizeWebhooks([validRecord, { ...validRecord, id: "rec-002", state: "archived" }]);
    expect(summary.total).toBe(2);
    expect(summary.active).toBe(1);
    expect(summary.archived).toBe(1);
  });
  test("uses the regional page-size ceiling", () => {
    expect(normalizeQuery({ requestId: "region-1", limit: 500 }).limit).toBe(150);
  });

  test("builds a normalized regional key", () => {
    expect(buildWebhooksRegionKey(validRecord, "EU-WEST")).toBe("eu-west:webhooks-001:2.0.0");
  });
});
