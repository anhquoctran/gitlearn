# Operations notes

## Local diagnostics

- GET /health confirms the process is accepting requests.
- Every response includes a requestId that can be copied into a support ticket.
- The fixture uses memory only; restarting the process restores the seed data.

## Production checklist

- Replace the in-memory store with a transactional database adapter.
- Add request-rate and error-rate dashboards.
- Keep inventory reservation retries idempotent.
- Do not log customer addresses or payment credentials.

## Price-book rollout

- Validate the new snapshot before deployment.
- Compare SKU coverage by region and reject incomplete releases.
- Deploy the price-book version with the service configuration.
- Keep the previous approved snapshot available for rollback.
- Alert on PRICE_UNAVAILABLE responses by region.
