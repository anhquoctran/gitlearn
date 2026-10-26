# Shipping

Owner: Fulfillment. Collection: shipments.

## Responsibilities

- Validate incoming shipments before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Service availability.
- Package dimensions.
- Tracking events.
- Delivery windows.

## Acceptance checks

- The service selects eligible service.
- The service normalizes tracking code.
- The service preserves delivery estimate.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
