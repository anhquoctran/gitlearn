# Search

Owner: Discovery. Collection: search documents.

## Responsibilities

- Validate incoming search documents before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Token normalization.
- Synonym expansion.
- Facet counts.
- Ranking signals.

## Acceptance checks

- The service ignores empty query.
- The service combines filters.
- The service returns stable cursor.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
