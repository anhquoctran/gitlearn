# Harbor Market API

A small Node.js service fixture for reviewing realistic changes across API handlers, domain services, storage, and operational docs.

## Run locally

Requires Node.js 20 or newer.

    npm start

The service listens on port 4100 by default. The in-memory store is seeded with a few products and stock records.

## Core routes

- GET /health
- GET /products?q=trail&category=hydration&limit=20
- GET /products/:sku
- GET /inventory/:sku?location=main

The catalog discovery branch adds filtered keyset pagination. The pricing branch adds region-aware product prices.

## Catalog discovery

Search terms are matched against product name, category, and SKU. Results use a stable name/SKU order and an opaque cursor so clients can request the next page without offset drift.
