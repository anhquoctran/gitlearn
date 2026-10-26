import { HttpError } from "./errors.js";
import { requireString } from "./validation.js";
import type { Product, ProductStore } from "./types.js";
import type { PriceQuote, PricingService } from "./pricing-service.js";

export type PricedProduct = Product & { price: PriceQuote };

export class CatalogService {
  constructor(
    private readonly store: ProductStore,
    private readonly pricing: PricingService
  ) {}

  listProducts({ region }: { region?: unknown } = {}): PricedProduct[] {
    return this.store.listProducts().map((product) => ({
      ...product,
      price: this.pricing.quote(product, region)
    }));
  }

  getProduct(sku: unknown, region?: unknown): PricedProduct {
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
