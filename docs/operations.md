# Operations notes

## Local diagnostics

- Run `npm install`, then `npm start` from the repository root.
- Run `npm run typecheck` before sending a change for review.
- GET /health confirms the process is accepting requests.
- Every response includes a requestId that can be copied into a support ticket.
- The fixture uses memory only; restarting the process restores the seed data.

## Production checklist

- Replace the in-memory store with a transactional database adapter.
- Add request-rate and error-rate dashboards.
- Keep inventory reservation retries idempotent.
- Do not log customer addresses or payment credentials.
