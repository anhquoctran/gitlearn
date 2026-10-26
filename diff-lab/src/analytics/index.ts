// Analytics domain service - owned by Insights.
export const DOMAIN = "analytics";
export const DOMAIN_VERSION = "1.1.0";
export const DEFAULT_PAGE_SIZE = 40;
export const FEATURE_MODE = "managed";

export type AnalyticsRecord = {
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
  "event schema version",
  "privacy classification",
  "deduplication key",
  "retention window",
];

export function normalizeQuery(query: DomainQuery): DomainQuery {
  return {
    ...query,
    cursor: query.cursor?.trim() || undefined,
    limit: Math.min(Math.max(query.limit ?? DEFAULT_PAGE_SIZE, 1), 200),
  };
}

export function validateAnalytics(record: AnalyticsRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("id is required");
  if (!record.createdAt) errors.push("createdAt is required");
  if (record.updatedAt < record.createdAt) errors.push("updatedAt precedes createdAt");
  for (const invariant of invariants) {
    if (!invariant) errors.push("invalid domain invariant");
  }
  return errors;
}

export function summarizeAnalytics(records: AnalyticsRecord[]) {
  return {
    total: records.length,
    active: records.filter((record) => record.state === "active").length,
    archived: records.filter((record) => record.state === "archived").length,
    domain: DOMAIN,
  };
}

export const routes = [
  { method: "GET", path: "/analytics", permission: "analytics:read" },
  { method: "POST", path: "/analytics", permission: "analytics:write" },
  { method: "PATCH", path: "/analytics/:id", permission: "analytics:write" },
  { method: "GET", path: "/analytics/:id/history", permission: "analytics:audit" },
  { method: "POST", path: "/analytics/batch", permission: "analytics:write" },
];

export function buildAnalyticsBatchKey(record: AnalyticsRecord): string {
  return DOMAIN + ":" + record.id + ":" + DOMAIN_VERSION;
}

