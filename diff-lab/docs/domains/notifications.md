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

## Managed batch rollout

The managed path accepts bounded batches and emits one trace span per request. Operators can replay a batch with its request identifier without duplicating writes.

- Default page size is 40 and the hard ceiling is 200.
- Batch keys include the record identifier and domain version.
- Rejected rows are returned with a stable row number and reason code.
- Partial success is reported explicitly; the service never hides skipped records.
- A retry reuses the original idempotency key and preserves the audit actor.
