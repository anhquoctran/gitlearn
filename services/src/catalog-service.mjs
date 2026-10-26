import { HttpError } from "./errors.mjs";
import { requireString } from "./validation.mjs";

export class CatalogService {
  constructor(store) {
    this.store = store;
  }

  listProducts() {
    return this.store.listProducts();
  }

  getProduct(sku) {
    const product = this.store.getProduct(requireString(sku, "sku"));
    if (!product) {
      throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product was not found.");
    }
    return product;
  }
}
