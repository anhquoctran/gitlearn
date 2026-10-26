# Version 2 migration plan

## Compatibility window

1. Add nullable regional columns while version 1 readers remain active.
2. Backfill region identifiers from the account profile.
3. Compare aggregate counts by currency and region.
4. Switch readers after the reconciliation report is approved.
5. Remove legacy columns in the next release window.

Rollback uses the migration checkpoint and never rewrites the original audit trail.
