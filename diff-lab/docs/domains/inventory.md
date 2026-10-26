# Inventory

Owner: Operations. Collection: stock records.

## Responsibilities

- Validate incoming stock records before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Warehouse scope.
- Reserved units.
- Reorder thresholds.
- Cycle counts.

## Acceptance checks

- The service prevents negative stock.
- The service releases reservations.
- The service flags low stock.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
