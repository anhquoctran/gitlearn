import { HttpError } from "./errors.mjs";

export class PricingService {
  constructor(priceBook, defaultRegion = "US") {
    this.priceBook = priceBook;
    this.defaultRegion = defaultRegion;
  }

  quote(product, requestedRegion) {
    const regionCode = (requestedRegion ?? this.defaultRegion).trim().toUpperCase();
    const region = this.priceBook.regions[regionCode];
    if (!region) {
      throw new HttpError(400, "UNSUPPORTED_REGION", "The requested sales region is not supported.");
    }

    const amountCents = region.prices[product.sku];
    if (!Number.isSafeInteger(amountCents) || amountCents < 0) {
      throw new HttpError(503, "PRICE_UNAVAILABLE", "No approved price is available for this product and region.");
    }

    return {
      amountCents,
      currency: region.currency,
      region: regionCode,
      priceBookVersion: this.priceBook.version
    };
  }
}
