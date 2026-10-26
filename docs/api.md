# API contract

All responses are JSON and include a request identifier. Errors use stable codes so clients can decide whether a request is safe to retry.

## Catalog

- GET /products returns active products in stable name/SKU order.
- Optional q and category parameters filter products before pagination.
- Optional limit is bounded by service configuration; the response includes page metadata and an opaque nextCursor.
- GET /products/:sku returns one active product.
- Unknown or discontinued SKUs return PRODUCT_NOT_FOUND.

## Pagination

The cursor encodes the final product name and SKU from the previous page. Clients should treat it as opaque and pass it back unchanged. Invalid or unsupported cursors return INVALID_CURSOR.

## Inventory

- GET /inventory/:sku?location=main returns on-hand, reserved, and available units.
- Availability is never negative, even when the stored reservation count is stale.
- Unknown SKU/location pairs return STOCK_NOT_FOUND.

## Errors

| Status | Code | Meaning |
| --- | --- | --- |
| 400 | INVALID_ARGUMENT | A required value is malformed. |
| 400 | INVALID_CURSOR | The catalog continuation token is invalid. |
| 404 | PRODUCT_NOT_FOUND | The product is not active. |
| 404 | STOCK_NOT_FOUND | No stock record exists. |
| 500 | INTERNAL_ERROR | The request failed unexpectedly. |
