# Harbor Market API

A small Node.js service fixture for reviewing realistic changes across API handlers, domain services, storage, and operational docs.

## Run locally

Requires Node.js 20 or newer.

    npm start

The service listens on port 4100 by default. The in-memory store is seeded with a few products and stock records.

## Core routes

- GET /health
- GET /products?region=CA
- GET /products/:sku?region=CA
- GET /inventory/:sku?location=main

The discovery branch adds filtered keyset pagination. The pricing branch returns approved prices for the requested sales region.

## Regional pricing

Product responses include an integer amount in minor units, currency, region, and price-book version. Pass a region query parameter or the x-market-region header. The service uses approved regional prices and does not calculate live exchange rates.
