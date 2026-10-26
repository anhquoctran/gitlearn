import { HttpError } from "./errors.js";
import { requireString } from "./validation.js";
import type { ProductStore } from "./types.js";

export interface Availability {
  sku: string;
  location: string;
  onHand: number;
  reserved: number;
  available: number;
}

export class InventoryService {
  constructor(
    private readonly store: ProductStore,
    private readonly defaultLocation = "main"
  ) {}

  getAvailability(sku: unknown, location: unknown = this.defaultLocation): Availability {
    const productSku = requireString(sku, "sku");
    const locationId = requireString(location, "location");
    const stock = this.store.getInventory(productSku, locationId);
    if (!stock) {
      throw new HttpError(404, "STOCK_NOT_FOUND", "No stock record exists for this product and location.");
    }

    return {
      sku: productSku,
      location: locationId,
      onHand: stock.onHand,
      reserved: stock.reserved,
      available: Math.max(0, stock.onHand - stock.reserved)
    };
  }
}
