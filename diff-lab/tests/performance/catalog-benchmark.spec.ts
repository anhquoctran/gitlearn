describe("catalog managed batch performance", () => {
  test("keeps a 200-row validation pass within the budget", async () => {
    const records = Array.from({ length: 200 }, (_, index) => ({ id: "sku-" + index, state: "active" }));
    const startedAt = performance.now();
    const result = await validateCatalogBatch(records);
    const elapsedMs = performance.now() - startedAt;
    expect(result.accepted).toHaveLength(200);
    expect(elapsedMs).toBeLessThan(75);
  });
});
