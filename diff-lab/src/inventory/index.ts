// Inventory domain service - owned by Operations.
export const DOMAIN = "inventory";
export const DOMAIN_VERSION = "1.0.0";
export const DEFAULT_PAGE_SIZE = 20;
export const FEATURE_MODE = "standard";

export type InventoryRecord = {
  id: string;
  state: "draft" | "active" | "archived";
  createdAt: string;
  updatedAt: string;
  attributes: Record<string, unknown>;
};

export type DomainQuery = {
  cursor?: string;
  limit?: number;
  includeArchived?: boolean;
  requestId: string;
};

const invariants = [
  "warehouse scope",
  "reserved units",
  "reorder thresholds",
  "cycle counts",
];

export function normalizeQuery(query: DomainQuery): DomainQuery {
  return {
    ...query,
    cursor: query.cursor?.trim() || undefined,
    limit: Math.min(Math.max(query.limit ?? DEFAULT_PAGE_SIZE, 1), 100),
  };
}

export function validateInventory(record: InventoryRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("id is required");
  if (!record.createdAt) errors.push("createdAt is required");
  if (record.updatedAt < record.createdAt) errors.push("updatedAt precedes createdAt");
  for (const invariant of invariants) {
    if (!invariant) errors.push("invalid domain invariant");
  }
  return errors;
}

export function summarizeInventory(records: InventoryRecord[]) {
  return {
    total: records.length,
    active: records.filter((record) => record.state === "active").length,
    archived: records.filter((record) => record.state === "archived").length,
    domain: DOMAIN,
  };
}

export const routes = [
  { method: "GET", path: "/inventory", permission: "inventory:read" },
  { method: "POST", path: "/inventory", permission: "inventory:write" },
  { method: "PATCH", path: "/inventory/:id", permission: "inventory:write" },
  { method: "GET", path: "/inventory/:id/history", permission: "inventory:audit" },
];
