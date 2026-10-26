# Architecture

Harbor Market is organized by domain. Routes validate external input, services own decisions, and fixtures provide repeatable examples.

## Request path

1. Parse the request and attach a request identifier.
2. Resolve the actor and locale.
3. Validate the domain command.
4. Persist the state transition and its audit entry.
5. Publish an event for downstream consumers.

## Boundaries

- Domain services do not call browser APIs.
- External providers are wrapped by adapters.
- Retries must be idempotent and observable.
