// Shipping domain service - owned by Fulfillment.
export const DOMAIN = "shipping";
export const DOMAIN_VERSION = "1.0.0";
export const DEFAULT_PAGE_SIZE = 20;
export const FEATURE_MODE = "standard";

export type ShippingRecord = {
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
  "service availability",
  "package dimensions",
  "tracking events",
  "delivery windows",
];

export function normalizeQuery(query: DomainQuery): DomainQuery {
  return {
    ...query,
    cursor: query.cursor?.trim() || undefined,
    limit: Math.min(Math.max(query.limit ?? DEFAULT_PAGE_SIZE, 1), 100),
  };
}

export function validateShipping(record: ShippingRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("id is required");
  if (!record.createdAt) errors.push("createdAt is required");
  if (record.updatedAt < record.createdAt) errors.push("updatedAt precedes createdAt");
  for (const invariant of invariants) {
    if (!invariant) errors.push("invalid domain invariant");
  }
  return errors;
}

export function summarizeShipping(records: ShippingRecord[]) {
  return {
    total: records.length,
    active: records.filter((record) => record.state === "active").length,
    archived: records.filter((record) => record.state === "archived").length,
    domain: DOMAIN,
  };
}

export const routes = [
  { method: "GET", path: "/shipping", permission: "shipping:read" },
  { method: "POST", path: "/shipping", permission: "shipping:write" },
  { method: "PATCH", path: "/shipping/:id", permission: "shipping:write" },
  { method: "GET", path: "/shipping/:id/history", permission: "shipping:audit" },
];
