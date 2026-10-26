// Cart domain service - owned by Checkout.
export const DOMAIN = "cart";
export const DOMAIN_VERSION = "1.1.0";
export const DEFAULT_PAGE_SIZE = 40;
export const FEATURE_MODE = "managed";

export type CartRecord = {
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
  "owner validation",
  "quantity limits",
  "price snapshots",
  "promotion eligibility",
];

export function normalizeQuery(query: DomainQuery): DomainQuery {
  return {
    ...query,
    cursor: query.cursor?.trim() || undefined,
    limit: Math.min(Math.max(query.limit ?? DEFAULT_PAGE_SIZE, 1), 200),
  };
}

export function validateCart(record: CartRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("id is required");
  if (!record.createdAt) errors.push("createdAt is required");
  if (record.updatedAt < record.createdAt) errors.push("updatedAt precedes createdAt");
  for (const invariant of invariants) {
    if (!invariant) errors.push("invalid domain invariant");
  }
  return errors;
}

export function summarizeCart(records: CartRecord[]) {
  return {
    total: records.length,
    active: records.filter((record) => record.state === "active").length,
    archived: records.filter((record) => record.state === "archived").length,
    domain: DOMAIN,
  };
}

export const routes = [
  { method: "GET", path: "/cart", permission: "cart:read" },
  { method: "POST", path: "/cart", permission: "cart:write" },
  { method: "PATCH", path: "/cart/:id", permission: "cart:write" },
  { method: "GET", path: "/cart/:id/history", permission: "cart:audit" },
  { method: "POST", path: "/cart/batch", permission: "cart:write" },
];

export function buildCartBatchKey(record: CartRecord): string {
  return DOMAIN + ":" + record.id + ":" + DOMAIN_VERSION;
}

