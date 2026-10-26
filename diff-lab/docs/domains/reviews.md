# Reviews

Owner: Community. Collection: reviews.

## Responsibilities

- Validate incoming reviews before persistence.
- Apply state transitions through a single service boundary.
- Record actor, request identifier, and timestamps for each write.
- Return stable cursors for paginated reads.

## Invariants

- Purchase verification.
- Moderation state.
- Rating range.
- Helpful votes.

## Acceptance checks

- The service rejects rating outside range.
- The service hides pending review.
- The service counts verified purchase.

## Operational notes

- Watch the domain error rate and p95 latency together.
- Keep retries idempotent and preserve the original request identifier.
- Route irreversible recovery steps through the on-call runbook.
