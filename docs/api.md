# API contract

All responses are JSON and include a request identifier. Errors use stable codes so clients can decide whether a request is safe to retry.

## Catalog

- GET /products returns active products ordered by name.
- GET /products/:sku returns one active product.
- Optional region query parameter or x-market-region header selects the approved price book.
- Product responses include price amountCents, currency, region, and priceBookVersion.
- Unknown or discontinued SKUs return PRODUCT_NOT_FOUND.

## Pricing

Prices are integer minor units and come from the versioned regional price book. Unsupported regions return UNSUPPORTED_REGION. A missing approved product price returns PRICE_UNAVAILABLE; the API never silently converts using a live FX rate.

## Inventory

- GET /inventory/:sku?location=main returns on-hand, reserved, and available units.
- Availability is never negative, even when the stored reservation count is stale.
- Unknown SKU/location pairs return STOCK_NOT_FOUND.

## Errors

| Status | Code | Meaning |
| --- | --- | --- |
| 400 | INVALID_ARGUMENT | A required value is malformed. |
| 400 | UNSUPPORTED_REGION | The requested sales region is not configured. |
| 404 | PRODUCT_NOT_FOUND | The product is not active. |
| 404 | STOCK_NOT_FOUND | No stock record exists. |
| 503 | PRICE_UNAVAILABLE | The price book has no approved price for the product. |
| 500 | INTERNAL_ERROR | The request failed unexpectedly. |
