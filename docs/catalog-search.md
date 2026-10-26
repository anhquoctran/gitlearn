# Catalog search rollout

Catalog reads support a bounded query, optional category, and keyset pagination.

## Client behavior

- Keep the cursor opaque and reuse it only with the same query and category.
- Start a fresh request when filters change.
- Stop when hasMore is false or nextCursor is null.
- Render the exact total only as informational data; product visibility may change between requests.

## Operational review

Watch query latency and result counts by category. If the backing store moves to SQL, keep the same sort tuple and add an index matching the filter and order columns.
