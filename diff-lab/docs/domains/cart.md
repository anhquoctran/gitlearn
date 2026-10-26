# Cart

Owner: Checkout. Collection: cart lines.

## Responsibilities

- Validate incoming cart lines before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Owner validation.
- Quantity limits.
- Price snapshots.
- Promotion eligibility.

## Acceptance checks

- The service rejects zero quantity.
- The service recalculates totals.
- The service keeps line order.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
