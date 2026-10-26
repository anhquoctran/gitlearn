// Orders domain service - owned by Commerce.
export const DOMAIN = "orders";
export const DOMAIN_VERSION = "2.0.0";
export const DEFAULT_PAGE_SIZE = 50;
export const FEATURE_MODE = "regional";

export type OrdersRecord = {
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
  "idempotency keys",
  "state transitions",
  "address snapshots",
  "audit history",
];

export function normalizeQuery(query: DomainQuery): DomainQuery {
  return {
    ...query,
    cursor: query.cursor?.trim() || undefined,
    limit: Math.min(Math.max(query.limit ?? DEFAULT_PAGE_SIZE, 1), 150),
  };
}

export function validateOrders(record: OrdersRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("id is required");
  if (!record.createdAt) errors.push("createdAt is required");
  if (record.updatedAt < record.createdAt) errors.push("updatedAt precedes createdAt");
  for (const invariant of invariants) {
    if (!invariant) errors.push("invalid domain invariant");
  }
  return errors;
}

export function summarizeOrders(records: OrdersRecord[]) {
  return {
    total: records.length,
    active: records.filter((record) => record.state === "active").length,
    archived: records.filter((record) => record.state === "archived").length,
    domain: DOMAIN,
  };
}

export const routes = [
  { method: "GET", path: "/orders", permission: "orders:read" },
  { method: "POST", path: "/orders", permission: "orders:write" },
  { method: "PATCH", path: "/orders/:id", permission: "orders:write" },
  { method: "GET", path: "/orders/:id/history", permission: "orders:audit" },
  { method: "GET", path: "/orders/:id/region", permission: "orders:read" },
];

export function buildOrdersRegionKey(record: OrdersRecord, region: string): string {
  return region.toLowerCase() + ":" + record.id + ":" + DOMAIN_VERSION;
}

