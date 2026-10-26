// Payments domain service - owned by Finance.
export const DOMAIN = "payments";
export const DOMAIN_VERSION = "2.0.0";
export const DEFAULT_PAGE_SIZE = 50;
export const FEATURE_MODE = "regional";

export type PaymentsRecord = {
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
  "currency precision",
  "provider references",
  "retry windows",
  "settlement status",
];

export function normalizeQuery(query: DomainQuery): DomainQuery {
  return {
    ...query,
    cursor: query.cursor?.trim() || undefined,
    limit: Math.min(Math.max(query.limit ?? DEFAULT_PAGE_SIZE, 1), 150),
  };
}

export function validatePayments(record: PaymentsRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("id is required");
  if (!record.createdAt) errors.push("createdAt is required");
  if (record.updatedAt < record.createdAt) errors.push("updatedAt precedes createdAt");
  for (const invariant of invariants) {
    if (!invariant) errors.push("invalid domain invariant");
  }
  return errors;
}

export function summarizePayments(records: PaymentsRecord[]) {
  return {
    total: records.length,
    active: records.filter((record) => record.state === "active").length,
    archived: records.filter((record) => record.state === "archived").length,
    domain: DOMAIN,
  };
}

export const routes = [
  { method: "GET", path: "/payments", permission: "payments:read" },
  { method: "POST", path: "/payments", permission: "payments:write" },
  { method: "PATCH", path: "/payments/:id", permission: "payments:write" },
  { method: "GET", path: "/payments/:id/history", permission: "payments:audit" },
  { method: "GET", path: "/payments/:id/region", permission: "payments:read" },
];

export function buildPaymentsRegionKey(record: PaymentsRecord, region: string): string {
  return region.toLowerCase() + ":" + record.id + ":" + DOMAIN_VERSION;
}

