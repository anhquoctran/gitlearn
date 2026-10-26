export type AvailabilityEntry = { sku: string; available: number; checkedAt: string; warehouse: string };

export class AvailabilityCache {
  private readonly entries = new Map<string, AvailabilityEntry>();

  put(entry: AvailabilityEntry) {
    this.entries.set(entry.sku + ":" + entry.warehouse, entry);
  }

  get(sku: string, warehouse: string) {
    return this.entries.get(sku + ":" + warehouse);
  }

  invalidateWarehouse(warehouse: string) {
    for (const [key, entry] of this.entries) {
      if (entry.warehouse === warehouse) this.entries.delete(key);
    }
  }
}
