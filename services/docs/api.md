# API contract

All responses are JSON and include a request identifier. Errors use stable codes so clients can decide whether a request is safe to retry.

## Catalog

- GET /products returns active products ordered by name.
- GET /products/:sku returns one active product.
- Unknown or discontinued SKUs return PRODUCT_NOT_FOUND.

## Inventory

- GET /inventory/:sku?location=main returns on-hand, reserved, and available units.
- Availability is never negative, even when the stored reservation count is stale.
- Unknown SKU/location pairs return STOCK_NOT_FOUND.

## Errors

| Status | Code | Meaning |
| --- | --- | --- |
| 400 | INVALID_ARGUMENT | A required value is malformed. |
| 404 | PRODUCT_NOT_FOUND | The product is not active. |
| 404 | STOCK_NOT_FOUND | No stock record exists. |
| 500 | INTERNAL_ERROR | The request failed unexpectedly. |
