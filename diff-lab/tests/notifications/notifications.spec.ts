import { normalizeQuery, summarizeNotifications, validateNotifications } from "../../src/notifications/index.js";

describe("Notifications domain", () => {
  const validRecord = { id: "rec-001", state: "active" as const, createdAt: "2026-01-01", updatedAt: "2026-01-02", attributes: {} };

  test("uses a bounded default page size", () => {
    expect(normalizeQuery({ requestId: "req-1" }).limit).toBe(20);
    expect(normalizeQuery({ requestId: "req-2", limit: 500 }).limit).toBe(100);
  });

  test("trims cursors before passing them to storage", () => {
    expect(normalizeQuery({ requestId: "req-3", cursor: " next " }).cursor).toBe("next");
  });

  test("accepts a complete active notifications record", () => {
    expect(validateNotifications(validRecord)).toEqual([]);
  });

  test("reports a missing identifier", () => {
    expect(validateNotifications({ ...validRecord, id: " " })).toContain("id is required");
  });

  test("summarizes active and archived records", () => {
    const summary = summarizeNotifications([validRecord, { ...validRecord, id: "rec-002", state: "archived" }]);
    expect(summary.total).toBe(2);
    expect(summary.active).toBe(1);
    expect(summary.archived).toBe(1);
  });
});
