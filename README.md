# Harbor Market API review fixture

A small TypeScript and Express commerce API for exercising realistic branch comparisons and code review tools. The application lives at the repository root; its source is in `src/`, configuration in `config/`, and operational notes in `docs/`.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm start
```

The API listens on port `4100` by default. Set `PORT` to use a different port. Run `npm run typecheck` to check the TypeScript sources.

## Core routes

- `GET /health`
- `GET /products`
- `GET /products/:sku`
- `GET /inventory/:sku?location=main`

## Review branches

- `diff-lab/base` contains the shared API baseline.
- `diff-lab/left` adds catalog search and cursor pagination.
- `diff-lab/right` adds region-aware pricing from a versioned price book.

The feature branches make related changes across routes, domain services, storage, configuration, and documentation so reviewers can trace behavior through the application.
