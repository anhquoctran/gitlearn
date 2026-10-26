import { HttpError } from "./errors.js";
import { requireString } from "./validation.js";
import type { Product, ProductStore } from "./types.js";

export class CatalogService {
  constructor(private readonly store: ProductStore) {}

  listProducts(): Product[] {
    return this.store.listProducts();
  }

  getProduct(sku: unknown): Product {
    const product = this.store.getProduct(requireString(sku, "sku"));
    if (!product) {
      throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product was not found.");
    }
    return product;
  }
}
