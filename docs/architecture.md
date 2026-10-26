# Architecture

Express owns routing, JSON parsing, request identifiers, and the final error response. Catalog and inventory services enforce domain rules. The in-memory store owns current state and returns copies so callers cannot mutate records by reference.

## Request lifecycle

1. Middleware assigns a request identifier and parses JSON bodies with a size limit.
2. Express matches a route and passes validated inputs to a domain service.
3. The service reads the store and returns domain data.
4. Error middleware maps domain and parser errors to stable HTTP responses.

## Design constraints

- Domain services do not depend on Express or Node's HTTP module.
- Monetary amounts are integer minor units.
- Inventory availability is derived from on-hand minus reserved units.
- State-changing endpoints must define retry and idempotency behavior before release.

## Catalog reads

The store applies category and token filters before the service slices a page. Pagination uses the last name/SKU pair as its continuation key, avoiding offset changes when products are inserted before the current page.
