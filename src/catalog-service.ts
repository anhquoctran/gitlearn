import { HttpError } from "./errors.js";
import { decodeProductCursor, encodeProductCursor } from "./cursor.js";
import {
  normalizeCategory,
  normalizeSearchTerm,
  parsePositiveInteger,
  requireString
} from "./validation.js";
import type { Product, ProductStore } from "./types.js";

export interface CatalogQuery {
  query?: unknown;
  category?: unknown;
  cursor?: unknown;
  limit?: unknown;
}

export interface ProductPage {
  items: Product[];
  page: {
    limit: number;
    total: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export interface CatalogOptions {
  defaultPageSize?: number;
  maxPageSize?: number;
}

export class CatalogService {
  private readonly defaultPageSize: number;
  private readonly maxPageSize: number;

  constructor(
    private readonly store: ProductStore,
    { defaultPageSize = 20, maxPageSize = 100 }: CatalogOptions = {}
  ) {
    this.defaultPageSize = defaultPageSize;
    this.maxPageSize = maxPageSize;
  }

  listProducts({ query, category, cursor, limit }: CatalogQuery = {}): ProductPage {
    const normalizedQuery = normalizeSearchTerm(query);
    const normalizedCategory = normalizeCategory(category);
    const pageSize = parsePositiveInteger(limit, "limit", {
      fallback: this.defaultPageSize,
      max: this.maxPageSize
    }) ?? this.defaultPageSize;
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
        nextCursor: hasMore ? encodeProductCursor(items.at(-1)!) : null
      }
    };
  }

  getProduct(sku: unknown): Product {
    const product = this.store.getProduct(requireString(sku, "sku"));
    if (!product) {
      throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product was not found.");
    }
    return product;
  }
}
