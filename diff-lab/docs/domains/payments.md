# Payments

Owner: Finance. Collection: payments.

## Responsibilities

- Validate incoming payments before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Currency precision.
- Provider references.
- Retry windows.
- Settlement status.

## Acceptance checks

- The service rounds minor units.
- The service deduplicates callbacks.
- The service keeps failed attempt.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
