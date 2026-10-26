# Operations runbook

## Triage

1. Find the request identifier in structured logs.
2. Check the domain health panel and queue lag.
3. Confirm whether the provider is degraded.
4. Retry only idempotent operations.

## Recovery

Record the operator, the affected entity range, and the recovery window. Keep the original audit records intact.

## Batch replay

1. Locate the original request identifier.
2. Export rejected row numbers and reason codes.
3. Confirm the actor and idempotency key.
4. Replay only the rejected subset.
5. Compare the reconciliation report before closing the incident.
