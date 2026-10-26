import { HttpError } from "./errors.mjs";
import { decodeProductCursor, encodeProductCursor } from "./cursor.mjs";
import { normalizeCategory, normalizeSearchTerm, parsePositiveInteger, requireString } from "./validation.mjs";

export class CatalogService {
  constructor(store, { defaultPageSize = 20, maxPageSize = 100 } = {}) {
    this.store = store;
    this.defaultPageSize = defaultPageSize;
    this.maxPageSize = maxPageSize;
  }

  listProducts({ query, category, cursor, limit } = {}) {
    const normalizedQuery = normalizeSearchTerm(query);
    const normalizedCategory = normalizeCategory(category);
    const pageSize = parsePositiveInteger(limit, "limit", {
      fallback: this.defaultPageSize,
      max: this.maxPageSize
    });
    const after = decodeProductCursor(cursor);
    const matches = this.store.listProducts({
      query: normalizedQuery,
      category: normalizedCategory
    });
    const startIndex = after
      ? matches.findIndex((product) =>
          product.name.localeCompare(after.name) > 0 ||
          (product.name === after.name && product.sku.localeCompare(after.sku) > 0)
        )
      : 0;
    const start = startIndex < 0 ? matches.length : startIndex;
    const window = matches.slice(start, start + pageSize + 1);
    const hasMore = window.length > pageSize;
    const items = window.slice(0, pageSize);

    return {
      items,
      page: {
        limit: pageSize,
        total: matches.length,
        hasMore,
        nextCursor: hasMore ? encodeProductCursor(items.at(-1)) : null
      }
    };
  }

  getProduct(sku) {
    const product = this.store.getProduct(requireString(sku, "sku"));
    if (!product) {
      throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product was not found.");
    }
    return product;
  }
}
