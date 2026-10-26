# Catalog

Owner: Storefront. Collection: products.

## Responsibilities

- Validate incoming products before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Stable identifiers.
- Published status.
- Category membership.
- Localized titles.

## Acceptance checks

- The service filters by category.
- The service sorts by popularity.
- The service hides archived products.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
