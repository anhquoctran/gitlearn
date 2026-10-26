# Architecture

The HTTP adapter translates requests and responses. Catalog and inventory services enforce domain rules. The store owns current in-memory state and returns copies so callers cannot mutate records by reference.

## Request lifecycle

1. The server assigns a request identifier and parses JSON bodies.
2. The handler matches a route and reads query parameters.
3. A domain service validates identifiers and reads the store.
4. The handler maps domain errors to stable HTTP responses.

## Design constraints

- Domain services do not depend on Node's HTTP module.
- Monetary amounts are integer minor units.
- Inventory availability is derived from on-hand minus reserved units.
- State-changing endpoints must define retry and idempotency behavior before release.

## Regional price resolution

The pricing service reads an approved price-book snapshot and attaches its version to every quote. Product storage remains currency-neutral; request context selects the region before the response is serialized.
