# Managed data pipeline

The preview pipeline accepts bounded imports, validates every row, and publishes a reconciliation artifact. Operators can pause a run without losing its cursor.

## Rollout

- Enable the feature flag for internal accounts.
- Compare accepted and rejected row counts.
- Replay a small sample with the original idempotency key.
- Expand the cohort only after the queue stays below its age budget.
