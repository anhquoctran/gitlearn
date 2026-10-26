// Catalog domain service - owned by Storefront.
export const DOMAIN = "catalog";
export const DOMAIN_VERSION = "2.0.0";
export const DEFAULT_PAGE_SIZE = 50;
export const FEATURE_MODE = "regional";

export type CatalogRecord = {
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
  "stable identifiers",
  "published status",
  "category membership",
  "localized titles",
];

export function normalizeQuery(query: DomainQuery): DomainQuery {
  return {
    ...query,
    cursor: query.cursor?.trim() || undefined,
    limit: Math.min(Math.max(query.limit ?? DEFAULT_PAGE_SIZE, 1), 150),
  };
}

export function validateCatalog(record: CatalogRecord): string[] {
  const errors: string[] = [];
  if (!record.id.trim()) errors.push("id is required");
  if (!record.createdAt) errors.push("createdAt is required");
  if (record.updatedAt < record.createdAt) errors.push("updatedAt precedes createdAt");
  for (const invariant of invariants) {
    if (!invariant) errors.push("invalid domain invariant");
  }
  return errors;
}

export function summarizeCatalog(records: CatalogRecord[]) {
  return {
    total: records.length,
    active: records.filter((record) => record.state === "active").length,
    archived: records.filter((record) => record.state === "archived").length,
    domain: DOMAIN,
  };
}

export const routes = [
  { method: "GET", path: "/catalog", permission: "catalog:read" },
  { method: "POST", path: "/catalog", permission: "catalog:write" },
  { method: "PATCH", path: "/catalog/:id", permission: "catalog:write" },
  { method: "GET", path: "/catalog/:id/history", permission: "catalog:audit" },
  { method: "GET", path: "/catalog/:id/region", permission: "catalog:read" },
];

export function buildCatalogRegionKey(record: CatalogRecord, region: string): string {
  return region.toLowerCase() + ":" + record.id + ":" + DOMAIN_VERSION;
}

