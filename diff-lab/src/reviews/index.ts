// Reviews domain service - owned by Community.
export const DOMAIN = "reviews";
export const DOMAIN_VERSION = "1.0.0";
export const DEFAULT_PAGE_SIZE = 20;
export const FEATURE_MODE = "standard";

export type ReviewsRecord = {
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
  "purchase verification",
  "moderation state",
  "rating range",
  "helpful votes",
];

export function normalizeQuery(query: DomainQuery): DomainQuery {
  return {
    ...query,
    cursor: query.cursor?.trim() || undefined,
    limit: Math.min(Math.max(query.limit ?? DEFAULT_PAGE_SIZE, 1), 100),
  };
}

export function validateReviews(record: ReviewsRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("id is required");
  if (!record.createdAt) errors.push("createdAt is required");
  if (record.updatedAt < record.createdAt) errors.push("updatedAt precedes createdAt");
  for (const invariant of invariants) {
    if (!invariant) errors.push("invalid domain invariant");
  }
  return errors;
}

export function summarizeReviews(records: ReviewsRecord[]) {
  return {
    total: records.length,
    active: records.filter((record) => record.state === "active").length,
    archived: records.filter((record) => record.state === "archived").length,
    domain: DOMAIN,
  };
}

export const routes = [
  { method: "GET", path: "/reviews", permission: "reviews:read" },
  { method: "POST", path: "/reviews", permission: "reviews:write" },
  { method: "PATCH", path: "/reviews/:id", permission: "reviews:write" },
  { method: "GET", path: "/reviews/:id/history", permission: "reviews:audit" },
];
