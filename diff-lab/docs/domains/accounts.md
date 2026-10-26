# Accounts

Owner: Identity. Collection: accounts.

## Responsibilities

- Validate incoming accounts before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Verified email.
- Account status.
- Consent history.
- Role assignments.

## Acceptance checks

- The service requires verified address.
- The service keeps audit trail.
- The service denies suspended account.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
