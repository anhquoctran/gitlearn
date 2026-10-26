# Orders

Owner: Commerce. Collection: orders.

## Responsibilities

- Validate incoming orders before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Idempotency keys.
- State transitions.
- Address snapshots.
- Audit history.

## Acceptance checks

- The service creates pending order.
- The service rejects invalid transition.
- The service records actor.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
