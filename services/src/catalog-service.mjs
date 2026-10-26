import { HttpError } from "./errors.mjs";
import { requireString } from "./validation.mjs";

export class CatalogService {
  constructor(store, pricing) {
    this.store = store;
    this.pricing = pricing;
  }

  listProducts({ region } = {}) {
    return this.store.listProducts().map((product) => ({
      ...product,
      price: this.pricing.quote(product, region)
    }));
  }

  getProduct(sku, region) {
    const product = this.store.getProduct(requireString(sku, "sku"));
    if (!product) {
      throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product was not found.");
    }
    return {
      ...product,
      price: this.pricing.quote(product, region)
    };
  }
}
