# Webhooks

Owner: Integrations. Collection: subscriptions.

## Responsibilities

- Validate incoming subscriptions before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Signature version.
- Endpoint health.
- Event allowlist.
- Delivery attempt.

## Acceptance checks

- The service signs canonical body.
- The service backs off on timeout.
- The service pauses unhealthy endpoint.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
