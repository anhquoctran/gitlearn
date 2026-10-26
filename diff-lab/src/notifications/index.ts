// Notifications domain service - owned by Messaging.
export const DOMAIN = "notifications";
export const DOMAIN_VERSION = "1.0.0";
export const DEFAULT_PAGE_SIZE = 20;
export const FEATURE_MODE = "standard";

export type NotificationsRecord = {
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
  "template locale",
  "delivery channel",
  "retry schedule",
  "unsubscribe state",
];

export function normalizeQuery(query: DomainQuery): DomainQuery {
  return {
    ...query,
    cursor: query.cursor?.trim() || undefined,
    limit: Math.min(Math.max(query.limit ?? DEFAULT_PAGE_SIZE, 1), 100),
  };
}

export function validateNotifications(record: NotificationsRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("id is required");
  if (!record.createdAt) errors.push("createdAt is required");
  if (record.updatedAt < record.createdAt) errors.push("updatedAt precedes createdAt");
  for (const invariant of invariants) {
    if (!invariant) errors.push("invalid domain invariant");
  }
  return errors;
}

export function summarizeNotifications(records: NotificationsRecord[]) {
  return {
    total: records.length,
    active: records.filter((record) => record.state === "active").length,
    archived: records.filter((record) => record.state === "archived").length,
    domain: DOMAIN,
  };
}

export const routes = [
  { method: "GET", path: "/notifications", permission: "notifications:read" },
  { method: "POST", path: "/notifications", permission: "notifications:write" },
  { method: "PATCH", path: "/notifications/:id", permission: "notifications:write" },
  { method: "GET", path: "/notifications/:id/history", permission: "notifications:audit" },
];
