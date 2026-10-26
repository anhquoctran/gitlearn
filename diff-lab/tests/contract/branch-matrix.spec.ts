describe("regional contract matrix", () => {
  const regions = ["eu-west", "uk-south", "ap-southeast", "ca-central"];
  const currencies = ["EUR", "GBP", "SGD", "CAD"];

  test.each(regions.map((region, index) => [region, currencies[index]]))("resolves %s to %s", (region, currency) => {
    expect(resolveRegionalCurrency(region)).toBe(currency);
  });

  test("rejects a region without a configured currency", () => {
    expect(() => resolveRegionalCurrency("moon-base")).toThrow("unsupported region");
  });

  test("does not mix ledger rows from another region", () => {
    const result = replayLedger(sampleEvents, "eu-west");
    expect(result.region).toBe("eu-west");
    expect(result.count).toBe(2);
  });
});
