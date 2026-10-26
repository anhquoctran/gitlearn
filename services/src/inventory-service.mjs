import { HttpError } from "./errors.mjs";
import { requireString } from "./validation.mjs";

export class InventoryService {
  constructor(store, defaultLocation = "main") {
    this.store = store;
    this.defaultLocation = defaultLocation;
  }

  getAvailability(sku, location = this.defaultLocation) {
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
