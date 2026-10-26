# Notifications

Owner: Messaging. Collection: notifications.

## Responsibilities

- Validate incoming notifications before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Template locale.
- Delivery channel.
- Retry schedule.
- Unsubscribe state.

## Acceptance checks

- The service renders fallback locale.
- The service retries transient error.
- The service honors unsubscribe.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
