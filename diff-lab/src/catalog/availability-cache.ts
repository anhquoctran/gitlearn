export type RegionalAvailability = { sku: string; region: string; available: number; currency: string; checkedAt: string };

export class AvailabilityCache {
  private readonly entries = new Map<string, RegionalAvailability>();

  put(entry: RegionalAvailability) {
    const key = entry.region.toLowerCase() + ":" + entry.sku;
    this.entries.set(key, entry);
  }

  get(sku: string, region: string) {
    return this.entries.get(region.toLowerCase() + ":" + sku);
  }

  invalidateRegion(region: string) {
    const prefix = region.toLowerCase() + ":";
    for (const key of this.entries.keys()) {
      if (key.startsWith(prefix)) this.entries.delete(key);
    }
  }
}
