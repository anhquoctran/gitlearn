# Harbor Market API

A small Node.js service fixture for reviewing realistic changes across API handlers, domain services, storage, and operational docs.

## Run locally

Requires Node.js 20 or newer.

    npm start

The service listens on port 4100 by default. The in-memory store is seeded with a few products and stock records.

## Core routes

- GET /health
- GET /products
- GET /products/:sku
- GET /inventory/:sku?location=main

The two review branches add catalog discovery and inventory reservation behavior.
