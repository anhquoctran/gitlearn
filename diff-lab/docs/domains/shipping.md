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

## Regional processing rollout

The regional path applies locale-aware policy before storage and keeps regional state isolated from the global default.

- Default page size is 50 and the regional ceiling is 150.
- Region keys are normalized before cache lookup.
- Currency and locale are resolved from the request context.
- Provider failures fall back to the last approved regional snapshot.
- Cross-region reads require an explicit permission and an audit reason.
