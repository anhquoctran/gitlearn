# Regional service boundaries

The regional release resolves locale and currency once per request. Domain services receive an immutable context and return values with an explicit source region.

## Isolation checks

- Reject an unknown region before reading customer data.
- Keep cache keys region-aware.
- Include currency and conversion timestamp in price results.
- Record cross-region access in the audit stream.
