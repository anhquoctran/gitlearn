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

## Managed batch rollout

The managed path accepts bounded batches and emits one trace span per request. Operators can replay a batch with its request identifier without duplicating writes.

- Default page size is 40 and the hard ceiling is 200.
- Batch keys include the record identifier and domain version.
- Rejected rows are returned with a stable row number and reason code.
- Partial success is reported explicitly; the service never hides skipped records.
- A retry reuses the original idempotency key and preserves the audit actor.
