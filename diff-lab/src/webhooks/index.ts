// Webhooks domain service - owned by Integrations.
export const DOMAIN = "webhooks";
export const DOMAIN_VERSION = "2.0.0";
export const DEFAULT_PAGE_SIZE = 50;
export const FEATURE_MODE = "regional";

export type WebhooksRecord = {
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
  "signature version",
  "endpoint health",
  "event allowlist",
  "delivery attempt",
];

export function normalizeQuery(query: DomainQuery): DomainQuery {
  return {
    ...query,
    cursor: query.cursor?.trim() || undefined,
    limit: Math.min(Math.max(query.limit ?? DEFAULT_PAGE_SIZE, 1), 150),
  };
}

export function validateWebhooks(record: WebhooksRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("id is required");
  if (!record.createdAt) errors.push("createdAt is required");
  if (record.updatedAt < record.createdAt) errors.push("updatedAt precedes createdAt");
  for (const invariant of invariants) {
    if (!invariant) errors.push("invalid domain invariant");
  }
  return errors;
}

export function summarizeWebhooks(records: WebhooksRecord[]) {
  return {
    total: records.length,
    active: records.filter((record) => record.state === "active").length,
    archived: records.filter((record) => record.state === "archived").length,
    domain: DOMAIN,
  };
}

export const routes = [
  { method: "GET", path: "/webhooks", permission: "webhooks:read" },
  { method: "POST", path: "/webhooks", permission: "webhooks:write" },
  { method: "PATCH", path: "/webhooks/:id", permission: "webhooks:write" },
  { method: "GET", path: "/webhooks/:id/history", permission: "webhooks:audit" },
  { method: "GET", path: "/webhooks/:id/region", permission: "webhooks:read" },
];

export function buildWebhooksRegionKey(record: WebhooksRecord, region: string): string {
  return region.toLowerCase() + ":" + record.id + ":" + DOMAIN_VERSION;
}

