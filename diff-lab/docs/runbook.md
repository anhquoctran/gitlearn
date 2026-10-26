# Operations runbook

## Triage

1. Find the request identifier in structured logs.
2. Check the domain health panel and queue lag.
3. Confirm whether the provider is degraded.
4. Retry only idempotent operations.

## Recovery

Record the operator, the affected entity range, and the recovery window. Keep the original audit records intact.
