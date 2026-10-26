import { HttpError } from "./errors.js";
import type { Product } from "./types.js";

export interface PriceBookRegion {
  currency: string;
  prices: Record<string, number>;
}

export interface PriceBook {
  version: string;
  regions: Record<string, PriceBookRegion>;
}

export interface PriceQuote {
  amountCents: number;
  currency: string;
  region: string;
  priceBookVersion: string;
}

export class PricingService {
  constructor(
    private readonly priceBook: PriceBook,
    private readonly defaultRegion = "US"
  ) {}

  quote(product: Product, requestedRegion?: unknown): PriceQuote {
    const selectedRegion = requestedRegion ?? this.defaultRegion;
    if (typeof selectedRegion !== "string") {
      throw new HttpError(400, "INVALID_ARGUMENT", "region must be a string.");
    }

    const regionCode = selectedRegion.trim().toUpperCase();
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
