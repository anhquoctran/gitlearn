# Analytics

Owner: Insights. Collection: events.

## Responsibilities

- Validate incoming events before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Event schema version.
- Privacy classification.
- Deduplication key.
- Retention window.

## Acceptance checks

- The service drops malformed event.
- The service deduplicates replay.
- The service keeps event order.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
