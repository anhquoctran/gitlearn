# Git review fixture

A compact Node.js commerce API for exercising branch comparison and code review tooling.

## Review branches

- `diff-lab/base` contains the shared service baseline.
- `diff-lab/left` adds catalog search and cursor pagination.
- `diff-lab/right` adds region-aware pricing from a versioned price book.
- `diff-lab/conflict` is a local merge-conflict workspace based on the left branch.

The feature branches change the catalog service, HTTP handler, configuration, API docs, and application wiring. Their changes are intentionally related so a reviewer can trace behavior across layers.

Run the sample API from `diff-lab/` with `npm start` (Node.js 20 or newer).
